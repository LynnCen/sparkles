import { Message } from "@newSdk/model/Message";
import chatModel from "@newSdk/model/Chat";
import {
    arrayToMap,
    getSingleChatTarget,
    isMyFriend,
    isP2P,
    mergeObArray,
    mergeObArrayRight,
} from "@newSdk/utils";
import Members, { FriendsStatus, IMember } from "@newSdk/model/Members";
import getRelationList from "@newSdk/service/api/addFriends/getRelationList";
import  messageModel  from "@newSdk/model/Message";

export const initConversationList = async (messages: { [key: string]: Message }) => {
    try {
        const msgArr = Object.values(messages);
        // const singleChat =

        const oldSession = await chatModel.getSessionList();
        const oldSessionIds = oldSession.map((item) => item.chatId);

        // 初始化的 单聊 (不再当前会话列表中,即未创建会话，)
        const firstInitSingleSessionChatIds: string[] = [];
        // 收集当前所有单聊会话
        const p2pChatList: string[] = [];
        msgArr.forEach((message: Message) => {
            const { chatId } = message;
            //
            if (isP2P(chatId)) p2pChatList.push(getSingleChatTarget(chatId));

            const isInit = isP2P(chatId) && !oldSessionIds.includes(chatId);
            // const isInit = isP2P(chatId);

            if (isInit) firstInitSingleSessionChatIds.push(getSingleChatTarget(chatId));
        });

        // 获取单聊对象 是否是好友
        const relationMap_isHide: any = {};

        const userInfos = await Members.getMemberByIds(p2pChatList);
        const infoMap = arrayToMap(userInfos, "id");

        if (firstInitSingleSessionChatIds.length) {
            firstInitSingleSessionChatIds.forEach((id) => {
                const user = infoMap.get(id) || {};

                const stranger = Members.isStrangeRelation(user);
                const isOfficial = Members.isOfficialAccount(user);

                //
                relationMap_isHide[id] = !isOfficial && stranger;
                // if (stranger) strangeArr.push(id);
            });
        }

        const sessions = Object.values(messages).map((message: Message) => {
            const { chatId } = message;
            const item: any = {
                chatId: message.chatId,
                // name: info?.friendAlias || info?.name || "",
                // avatar: info?.avatarPath || "",
                lastMessage: message,
                timestamp: message.timestamp,
                // unreadCount: unreadMap[message.chatId] || 0,
                // hide: isP2P(chatId) ? relationMap_isHide[getSingleChatTarget(chatId)] : false,
            };

            const uid = getSingleChatTarget(chatId);
            const initHideStatus = relationMap_isHide[uid];
            if (initHideStatus != undefined) item.hide = initHideStatus;
            return item;
        });

        const newList = mergeObArray(sessions, oldSession, "chatId");
        // console.log(
        //     `---> put`,
        //     newList.filter((item) => item.chatId.startsWith("s_"))
        // );

        // 验证单聊会话好友关系
        checkFriendsRelationIfNeed(p2pChatList, infoMap);
        // if (strangeArr.length) checkStrangerRelation(strangeArr);
        await chatModel.bulkPutSession(newList);
    } catch (e) {
        console.error(e);
    }
};

const checkFriendsRelationIfNeed = async (uidList: string[], userInfoMap: Map<string, IMember>) => {
    let stranger: string[] = [];

    uidList.forEach((uid) => {
        const user = userInfoMap.get(uid);
        if (user && Members.isStrangeRelation(user)) stranger.push(uid);
        if (!user) stranger.push(uid);
    });

    checkStrangerRelation(stranger);
};

const checkStrangerRelation = async (uids: string[]) => {
    const relations = await getRelationList(uids);
    if (relations) {
        const hasNewFriends = relations.some((item) =>
            [FriendsStatus.friends, FriendsStatus.friendsForMe_strangerForYou].includes(
                item.isFriend
            )
        );

        // 同步朋友关系
        if (hasNewFriends) {
            const users = await Members.getMemberByIds(uids);

            const updateUserInfos = mergeObArrayRight(users, relations, "id");

            // 更新好友关系
            Members.bulkPutMemberInfo(updateUserInfos);
        }
    }
};
export const initSessionUnreadCount = async (messageMap: any) => {
    const res = await Promise.allSettled(
        Object.entries(messageMap).map(async ([k, message]) => {
            const unread = await messageModel.getAllUnReadMsgById(k);
            return {
                unreadCount: unread,
                chatId: k,
            };
        })
    );
    const list = res.map((item: any) => item.value);
    return chatModel.bulkPutSession(list);
};

/*
export const initSingleSession = async (messages: Message[]) => {
    if (!messages.length) return [];
    const chatIds: Set<string> = new Set();
    const memberIds = messages.map((message) => {
        const { chatId } = message;
        chatIds.add(chatId);
        return getSingleChatTarget(chatId);
    });
    const members = await memberModel.getMemberByIds(memberIds);
    const memberMap = _.keyBy(members, "id");
    // const unreadMap = await getUnreadOfChats(Array.from(chatIds));
    unreadHandler.add(Array.from(chatIds));

    // unExist
    const existIds = Object.keys(memberMap);
    const syncIds = memberIds.filter((item) => !existIds.includes(item));
    if (syncIds.length) {
        getUserListInfo(syncIds);
    }

    // const list = await Promise.allSettled(
    return messages.map((message) => {
        // const uid = getSingleChatTarget(message.chatId);
        // const info = memberMap[uid];
        // if (!info) getUserListInfo([uid]);
        // const count = await messageModel.getAllUnReadMsgById(message.chatId);

        return {
            chatId: message.chatId,
            // name: info?.friendAlias || info?.name || "",
            // avatar: info?.avatarPath || "",
            lastMessage: message,
            timestamp: message.timestamp,
            // unreadCount: unreadMap[message.chatId] || 0,
            hide: false,
            // hide:
            //     info &&
            //     [FriendsStatus.strangerForMe_friendsForYou, FriendsStatus.stranger].includes(
            //         info.isFriend || FriendsStatus.stranger
            //     ),
            // unreadCount: count,
        };
    });
    // );
    // return list.map((item: any) => item.value);
};

export const initGroupSession = async (messages: Message[]) => {
    if (!messages.length) return [];
    const chatIds: Set<string> = new Set();
    const gids = messages.map((message) => {
        const { chatId } = message;
        chatIds.add(chatId);
        return chatId;
    });
    const groupInfos = await groupInfoModel.getGroupInfoByIds(gids);
    const groupInfoMap = _.keyBy(groupInfos, "id");

    // const unreadMap = await getUnreadOfChats(Array.from(chatIds));
    unreadHandler.add(Array.from(chatIds));

    // const list = await Promise.allSettled(
    return messages.map((message) => {
        const info = groupInfoMap[message.chatId] || {};
        // todo with line:113
        // const count = await messageModel.getAllUnReadMsgById(message.chatId);
        // console.log("count", count);
        return {
            lastMessage: message,
            timestamp: message.timestamp,
            chatId: message.chatId,
            name: info.name || "",
            avatar: info.avatarPath || "",
            hide: false,
            // unreadCount: unreadMap[message.chatId],
        };
    });
    // );
    // return list.map((item: any) => item.value);
};

async function getUnreadOfChats(chatIds: string[]) {
    const unreadMap: { [key: string]: number } = {};
    const prs = chatIds.map(async (id: string) => {
        unreadMap[id] = await messageModel.getAllUnReadMsgById(id);
    });

    await Promise.allSettled(prs);
    return unreadMap;
}

export const initSessionUnreadCount = async (messageMap: any) => {
    const res = await Promise.allSettled(
        Object.entries(messageMap).map(async ([k, message]) => {
            const unread = await messageModel.getAllUnReadMsgById(k);
            return {
                unreadCount: unread,
                chatId: k,
            };
        })
    );
    const list = res.map((item: any) => item.value);
    return chatModel.bulkPutSession(list);
};

export const initAndSyncGroupBaseConfig = async (gids: string[]) => {
    const syncIds = Array.from(new Set(gids));
    const existGroups = await groupInfoModel.getGroupInfoByIds(syncIds);

    // all exist
    if (syncIds.length === existGroups.length) return;

    // filter request need;
    const existIds = existGroups.map((item) => item.id);
    const requestIds = syncIds.filter((item) => !existIds.includes(item));

    // sync session member info
    await getGroupInfos(requestIds);
    await syncGroupMemberBaseInfo(gids);

    // todo: temp sync remote every time
};

const syncGroupMemberBaseInfo = async (gids: string[]) => {
    const pros = await Promise.allSettled(gids.map((gid) => getGroupMemberIds(gid, true)));
    const membersArr = pros.map((item) => (item.status === "fulfilled" ? item.value : []));
    const memberIds: string[] = _.flattenDeep(membersArr);
    // query exist
    const existUsers = await memberModel.getMemberByIds(memberIds);
    const existIds = existUsers.map((item) => item.id);

    // sync
    const needSyncIds = memberIds.filter((uid) => !existIds.includes(uid));
    if (needSyncIds.length) {
        return getUserListInfo(needSyncIds);
    }
};*/
/*

export const syncConversationInfoOfThrottle = (fn: Function) => {
    const throttleTimeout = 44;
    let timer: any;

    const self = this;
    return (...args: any) => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            fn.apply(self, args);
            timer = null;
        }, throttleTimeout);
    };
};
*/
