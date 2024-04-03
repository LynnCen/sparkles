import { Spread, MessageItem } from "./PullMessage";
import MessageStatus from "@newSdk/model/MessageStatus";
import Chat from "@newSdk/model/Chat";
import { TYPE_AT_ME, TYPE_AT_ALL, AT_ALL } from "@newSdk/model/message/AtMessageContent";
import MessageModel, { Message } from "@newSdk/model/Message";
import tmmUserInfo from "@newSdk/model/UserInfo";
import chatModel from "@newSdk/model/Chat";
import _ from "lodash";

export const sortWithMap = (sortList: Spread[], infoMap: { [key: string]: MessageItem }) => {
    return sortList
        .map(({ id, sequence, is_read }) => {
            const item: MessageItem = infoMap[id] as MessageItem;
            if (item) {
                return { ...item, sequence, is_read };
            }
            return null;
        })
        .filter((item) => !!item);
};

export const transformData = (item: MessageItem & Spread) => ({
    mid: item.id,
    chatId: item.chat_id,
    sender: item.sender_id,
    content: item.content,
    status: MessageStatus.unread, // 默认未读
    type: item.type,
    sequence: item.sequence,
    displayTime: item.displayTime,
    timestamp: item.create_time,
    sendTime: item.send_time,
    deleteFlag: item.status ?? 0,
    extra: item.extra,
    at: item.at || 0,
});

export const putUnreadIdsToMap = async (map: Map<string, Set<String>>, item: MessageItem) => {
    try {
        const { chat_id, content } = item;
        let { mids = [], operator } = JSON.parse(content);
        const data = JSON.parse(content);
        const unreadSet = map.get(chat_id);
        if (data.chat_id) {
            mids = await MessageModel.getAllRevokeMidsByChatId(chat_id, operator);
        }
        if (unreadSet) {
            mids.forEach((item: string) => unreadSet.add(item));
            map.set(chat_id, unreadSet);
        } else {
            const initUnreadSet: Set<string> = new Set();
            mids.forEach((item: string) => initUnreadSet.add(item));
            map.set(chat_id, initUnreadSet);
        }
    } catch (e) {
        console.error("mark read error, api/pullMessage", e);
    }
};
export const putAtType = (item: any) => {
    try {
        const { content } = item;
        const { items } = JSON.parse(content);
        let at = 0;

        if (items.length > 0 && typeof items == "object") {
            items.forEach((item: { t: string; v: string }) => {
                if (item.v == tmmUserInfo._id) {
                    at = at | TYPE_AT_ME;
                }
                if (item.v == AT_ALL) {
                    at = at | TYPE_AT_ALL;
                }
            });
        }

        item.at = at;
    } catch (error) {
        console.error("putAtType  error, api/pullMessage", error);
    }
};
export const collectionClearSequence = (
    clearSessionBelowOrEqual: { [key: string]: number },
    item: any
) => {
    try {
        const _map = { ...clearSessionBelowOrEqual };
        const { chat_id, sequence } = item.content;
        if (chat_id) {
            const old = _map[chat_id] || 0;
            _map[chat_id] = Math.max(old, sequence);
        }
        return _map;
    } catch (e) {
        console.error("mark delete error, api/pullMessage", e);
    }
};

export const collectionDelIds = (allDelSet: string[], item: MessageItem) => {
    try {
        const data = JSON.parse(item.content);
        const mids: string[] = [];
        if (data.mids) {
            mids.push(data.mids);
        }
        return mids.flat(Infinity);
    } catch (e) {
        //
        console.error("mark delete error, api/pullMessage", e);
        return allDelSet;
    }
};

export const collectionRevokeIds = (needRevokeMsgs: { [key: string]: {} }, item: MessageItem) => {
    try {
        const _map = { ...needRevokeMsgs };
        const { sequence } = item;
        const { chat_id, except_mids, operator } = JSON.parse(item.content);

        const needId = { except_mids, operator };
        if (chat_id) {
            if (sequence) _map[chat_id] = needId;
        }

        return _map;
    } catch (e) {
        return needRevokeMsgs;
    }
};

export const updateMessageToRead_SyncSession = (
    unreadMap: Map<string, Set<string>>,
    groupByChatIdMap: { [chatId: string]: Message }
) => {
    let ids: string[] = [];
    const currentViewSessionList = chatModel.getCurrentSessionSnapshot();
    const currentSessionMap = _.keyBy(currentViewSessionList, "chatId");
    unreadMap.forEach((value, key) => {
        // check groupByChat message is include. to update
        const session = currentSessionMap[key];

        if (groupByChatIdMap[key] && value.has(groupByChatIdMap[key].mid)) {
            groupByChatIdMap[key].status = MessageStatus.ACKRead;
        } else if (session && session.lastMessage && value.has(session.lastMessage.mid)) {
            const message = { ...session.lastMessage, status: MessageStatus.ACKRead };
            // chatModel.updateLastMessage(key, message);
        }

        ids = [...ids, ...Array.from(value)];
    });

    // if (ids.length) MessageModel.updateAckRead();
    return { groupByChatIdMap, ids };
};

export const handleDeleteMessage = (ids: string[], currentList: Message[]): Message[] => {
    const markDelMsg: Message[] = [];
    const normalMsg: Message[] = [];

    currentList.forEach((item) => {
        // 需要删除的消息 和 服务端已经标记删除的消息
        if (ids.includes(item.mid) || item.deleteFlag === 1) {
            item.deleteFlag = 1;
            markDelMsg.push(item);
        } else {
            normalMsg.push(item);
        }

        return item;
    });

    // 取差集
    let less = ids;
    const deletedInCurrent = markDelMsg.map((item) => item.mid);
    if (deletedInCurrent.length) {
        less = _.xor(ids, deletedInCurrent);
    }

    // 不在当前同步列表中，则存在本地历史消息，删除。
    if (less.length) MessageModel.setMessageDeleteFlag(less);

    // 插入本次 标记删除的消息
    if (markDelMsg.length) MessageModel.insertBulkItems(markDelMsg);
    return normalMsg;
};
