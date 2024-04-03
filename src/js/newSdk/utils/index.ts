import md5 from "md5";
import UserInfo from "../model/UserInfo";
import groupInfoModel from "../model/GroupInfo";
import memberInfoModel, { FriendsStatus } from "../model/Members";
import _ from "lodash";
import { Message } from "@newSdk/model/Message";
/** create md5 16 */
export const getMd5 = (prefix: string, suffix: string): string => {
    let timeStamp = window.performance ? window.performance.now() : Date.now();
    // 6位随机数
    const random = [...new Array(6)].map(() => Math.floor(Math.random() * 10)).join("");

    return md5(`${prefix}${timeStamp}${random}${suffix}`).slice(8, 24);
};

/** create single chat id */
export const createSingleChatId = (userId1: string, userId2: string) => {
    const str = [userId1, userId2].sort().join("_");
    return `s_${str}`;
};

/** create session chat Id */
export const createGroupChatId = (uid: string) => {
    const md5Str = getMd5(uid, "group");
    return `g_${md5Str}`;
};

/** create messageId */
export const createMessageId = (uid: string) => getMd5(uid, "createmessage");

/**
 * create moments
 */
export const createMomentId = (uid: string) => getMd5(uid, "createmomentid");

export const createCommentId = (uid: string) => getMd5(uid, "createCommentId");

/* get single chat target */
export const getSingleChatTarget = (chatId: string): string => {
    if (chatId.startsWith("s_")) {
        const ids = chatId.split("_");
        return ids[1] === UserInfo._id ? ids[2] : ids[1];
    }
    return "";
};

export const isGroup = (chatId: string): boolean => chatId?.startsWith("g_");

export const isP2P = (chatId: string): boolean => chatId?.startsWith("s_");

export const isMyFriend = (status: number = FriendsStatus.stranger): boolean =>
    [FriendsStatus.friends, FriendsStatus.friendsForMe_strangerForYou].includes(status);

export const isMe = (id: string) => id === UserInfo._id;

export const getMsgDisplayTime = (message: Message) => {
    const { sender, timestamp, sendTime } = message;
    return isMe(sender) ? timestamp : sendTime;
};

export const getBaseInfoByChatId = async (chatId: string) => {
    if (isGroup(chatId)) {
        return groupInfoModel.getGroupInfo(chatId);
    } else {
        const uid = getSingleChatTarget(chatId);
        return memberInfoModel.getMemberById(uid);
    }
};

export const arrayToMap = (array: any[], primaryKey: string) => {
    const map = new Map();
    array.forEach((item) => {
        map.set(item[primaryKey], item);
    });
    return map;
};

export const arrayToHashTable = (array: any[], primaryKey: string) => {
    const map: any = {};
    array.forEach((item) => {
        map[item[primaryKey]] = item;
    });
    return map;
};

const _mergeOb = (...args: any[]) => {
    const mergeKey = args.pop();
    // const upCollection = args.shift();

    //
    const kSet = args.reduce((acc, current) => {
        current.forEach((item: any) => {
            if (item[mergeKey]) acc.add(item[mergeKey]);
        });
        return acc;
    }, new Set());
    const eachKeys: string[] = Array.from(kSet);

    const otherMapList = args.map((item) => _.keyBy(item, mergeKey)) || [];

    return {
        eachKeys,
        otherMapList,
        mergeKey,
    };
};

/**
 * @description: 每次迭代，第一项的item 会覆盖其余项合并的 item, 从右往左合并
 * @param args
 */
export const mergeObArray = (...args: any[]): any[] => {
    // const mergeKey = args.pop();
    //
    // const upCollection = args.shift();
    // const upMap = _.keyBy(upCollection, mergeKey);
    //
    // const otherMapList = args.map((item) => _.keyBy(item, mergeKey)) || [];

    const { eachKeys, otherMapList, mergeKey } = _mergeOb(...args);

    return eachKeys.map((key) => {
        return otherMapList.reduceRight(
            (acc, current) => {
                Object.assign(acc, current[key as string] || {});
                return acc;
            },
            { [mergeKey]: key }
        );
    });
};

/**
 * @description: 每次迭代，其余项合并的 item 会覆盖 第一项的item，从左往右合并
 * @param args
 */
export const mergeObArrayRight = (...args: any[]): any[] => {
    const { eachKeys, otherMapList, mergeKey } = _mergeOb(...args);

    return eachKeys.map((key) => {
        return otherMapList.reduce(
            (acc, current) => {
                Object.assign(acc, current[key as string] || {});
                return acc;
            },
            { [mergeKey]: key }
        );
    });
};

export const groupListByKey = (list: any[], key: string) => {
    let map: any = {};

    list.forEach((item) => {
        const name = item[key];
        const row = map[name];

        if (row) row.push(item);
        else map[name] = [item];
    });

    return map;
};

export const trimAndDropEmpty = (obj: any) => {
    const { isEmpty, isNil, mapValues, omitBy } = _;
    const isReallyEmpty = (value: any) =>
        (isNil(value) || isEmpty(value)) && typeof value !== "number" && typeof value !== "boolean";
    return omitBy(
        mapValues(obj, (value) => (typeof value === "string" ? value.trim() : value)),
        isReallyEmpty
    );
};

export const fillAndUpdate = (source: any[], updateList: any[], compareKey: string) => {
    let list = [...source];
    const map = arrayToHashTable(updateList, compareKey);

    // console.log(`to map --->`, updateList, compareKey, map);
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const updateProps = map[item[compareKey]];

        if (updateProps) {
            list[i] = { ...updateProps };

            // map.delete(item[compareKey]);
            Reflect.deleteProperty(map, item[compareKey]);
        }
    }
    // @ts-ignore
    list = list.concat(Object.values(map));
    return list;
};

export const getDisplayMessage = (message: Message) =>
    isMe(message.sender) ? message.timestamp : message.sendTime;
