import messageModel from "../model/Message";
import { Message } from "../model/Message";
import { db } from "../model";
import reSendMessage from "./reSendMessage";
import { getSingleChatTarget, isGroup } from "@newSdk/utils";
import groupMembersModel, { GroupMembers } from "@newSdk/model/GroupMembers";
import userInfoModel from "@newSdk/model/UserInfo";
import memberModel, { FriendsStatus, IMember } from "@newSdk/model/Members";

//
export default async function () {
    if (!db || !db.isOpen()) return;

    const waitSendMessage = await messageModel.getWaitSendMessage();

    const multiSessionMap: Map<string, Message[]> = new Map();

    // split session
    waitSendMessage
        .filter((chat) => chat.chatId)
        .forEach((item) => {
            const { chatId } = item;
            if (multiSessionMap.has(chatId)) multiSessionMap.get(chatId)?.push(item);
            else {
                multiSessionMap.set(chatId, [item]);
            }
        });

    // filter kicked or not friends relation
    const multiSessionList = (
        await Promise.all(
            Array.from(multiSessionMap).map(async ([k, v]) => {
                if (isGroup(k)) {
                    const groupInfo = await groupMembersModel.getGroupMember(k, userInfoModel._id);
                    if (groupInfo && (groupInfo as GroupMembers).deleted) return false;
                } else {
                    const uid = getSingleChatTarget(k);
                    const friendInfo: IMember = await memberModel.getMemberById(uid);

                    if (friendInfo.isFriend !== FriendsStatus.friends) return false;
                }
                return v;
            })
        )
    ).filter((item) => !!item);

    // const multiSessionList = Array.from(multiSessionMap.values());
    // 多个会话并行，单个会话内部消息串行
    for (const singleSessionAwaitSendMessage of multiSessionList) {
        // 微任务 异步注册所有会话
        Promise.resolve().then(async () => {
            // 单个会话重发 串行
            // @ts-ignore
            for (let msg of singleSessionAwaitSendMessage) {
                await reSendMessage(msg);
            }
        });
    }
}
