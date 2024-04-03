/**
 * class 装饰器
 */
import { Message } from "./Message";
import { decode, decodeList } from "../utils/messageFormat";
import _ from "lodash";

export function authorize(target: any, name: string, descriptor: PropertyDescriptor) {
    const nativeCall = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
        const isAuth = target.constructor.authorize;
        if (!isAuth) {
            console.error(`unauthorized ${name}, You haven\'t login in`);
            return [];
        } else return nativeCall.apply(this, args);
    };

    return descriptor;
}

// message format: decode content
export function messageContentDecode(target: any, _: string, descriptor: PropertyDescriptor) {
    const nativeCall = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
        const data: Message[] | Message = await nativeCall.apply(this, args);
        return decodeList(data);
    };
}

/*
// filter image Message that haven't download to local cache
export function prevLoadMediaMessage(target: any, _: string, descriptor: PropertyDescriptor) {
    const nativeFn = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
        let data: Message<any>[] = await nativeFn.apply(this, args);
        return await handleMediaMessage(data);
    };
}*/

export function sessionLastMessageDecode(target: any, _: string, descriptor: PropertyDescriptor) {
    const nativeCall = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
        const data: Message[] | undefined = await nativeCall.apply(this, args);
        let formatData = null;
        if (data && data instanceof Array) {
            formatData = data.map((item: any) => {
                const newItem = { ...item };
                try {
                    if (newItem?.lastMessage?.content)
                        newItem.lastMessage.content = decode(newItem.lastMessage.content) as any;
                } catch (e) {}

                return newItem;
            });
        }
        return formatData || data;
    };
}

export function publishThrottle(timeout: number, mergeKey: string) {
    let args: any[] = [];
    let throttleTimer: any;
    return (target: any, _s: string, descriptor: PropertyDescriptor) => {
        const nativeCall = descriptor.value;
        descriptor.value = async function (arg: unknown[], ...other: any) {
            // has multi args
            if (other.length) {
                nativeCall.apply(this, [[...arg, ...args], ...other]);
                throttleTimer = null;
                return (args = []);
            }

            // single throttle main
            args = args.concat(arg);
            if (throttleTimer) clearTimeout(throttleTimer);
            throttleTimer = setTimeout(() => {
                const setMap = _.keyBy(args, mergeKey) || {};
                const list = Object.values(setMap);
                nativeCall.apply(this, [list]);
                throttleTimer = null;
                args = [];
            }, timeout);
        };
    };
}
