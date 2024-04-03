import nc, { Event } from "../../notification";
import MessageModel, { Message, isUserMessage, filterNeedAckMessage } from "../../model/Message";
import MessageStatus from "../../model/MessageStatus";
import { update_by_last } from "../../utils/update_display_time";
import UserInfo, { InitLoadingStatus } from "../../model/UserInfo";
import { ipcRenderer, remote } from "electron";
import _, { filter } from "lodash";
import {
    initConversationList,
    initSessionUnreadCount,
    // initAndSyncGroupBaseConfig,
} from "@newSdk/logic/initScript/initConversations";
import axios from "@newSdk/service/apiCore/tmmCore";
import MessageType from "@newSdk/model/MessageType";
import {
    sortWithMap,
    transformData,
    putUnreadIdsToMap,
    putAtType,
    collectionDelIds,
    updateMessageToRead_SyncSession,
    collectionRevokeIds,
    handleDeleteMessage,
} from "./PullMessage+logic";
import { getInitSequence } from "@newSdk/service/api/index";
import tmmUserInfo from "../../model/UserInfo";
import groupInfoModel from "../../model/GroupInfo";
import { createRoundAvatar } from "utils/canvas/createRoundAvatar";
import { messageModel } from "@newSdk/model";

const pullMessageIdsBySequence = (sequence: number) =>
    axios({
        method: "post",
        url: "/getMessageIds",
        data: { sequence },
    });

const getMessagesByIds = (ids: string[]) =>
    axios({
        url: "/getMessageInfo",
        method: "post",
        data: { ids },
    });

const StatusEnum = {
    NORMAL: 0,

    DELETED: 1,
};

export interface Spread {
    sequence: number;
    id: string;
    is_read: number; // 0-default 1-true
    status: number; // is delete 0-false 1-true
}
export interface MessageItem {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    create_time: number;
    update_time: number;
    displayTime: number;
    type: number;
    sequence: number;
    send_time: number;
    at?: number;
    extra: any;
    status: number; // is delete 0-false 1-true
}

/**
 * pull spread table
 */
const chunkSize = 1000;
const _pullMessageIdList = async (sequence: number) => {
    let flag = true;
    try {
        const res = await pullMessageIdsBySequence(sequence);

        const items = (res.data.items || []).sort(
            (a: Spread, b: Spread) => a.sequence - b.sequence
        );

        const abstractLayer = async (items: Spread[]) => {
            try {
                // db 去重
                const arr = await MessageModel.getUnExistMsg(items);

                // 更新 sequence
                let newSequence = items[items.length - 1]?.sequence || 0;

                // 无需要更新消息，本次操作完成
                if (!arr || !arr.length) {
                    nc.publish(Event.PullDone, newSequence);
                    return true;
                }

                // 排序
                const sortArr: Spread[] = arr
                    .sort((a, b) => a.sequence - b.sequence)
                    .filter((item) => item.status !== StatusEnum.DELETED);

                const maxSequence = sortArr[sortArr.length - 1]?.sequence;

                if (maxSequence) {
                    // 存在 未拉取消息
                    const midList = sortArr.map((item) => item.id);
                    return await _pullMessage(midList, maxSequence, sortArr);
                }
            } catch (e) {
                console.error(`_pullMessageIdList`, e);
                return false;
            }
        };

        const chunks: Spread[][] = [];

        // split to chunk
        const len = Math.floor(items.length / chunkSize);
        for (let i = 0; i <= len; i++) {
            chunks.push(items.slice(i * chunkSize, (i + 1) * chunkSize));
        }

        // request by serial
        for await (const chunk of chunks) {
            const res = await abstractLayer(chunk);
            if (!res) {
                // init && nc.publish(Event.TmmInit, InitLoadingStatus.LOADING_FAIL);
                break;
            }
        }

        flag = true;
    } catch (e) {
        console.error(e);
        // init && nc.publish(Event.TmmInit, InitLoadingStatus.LOADING_FAIL);
        flag = false;
    } finally {
        nc.publish(Event.PullDone, sequence);
    }

    return flag;
};

/**
 *
 * pull message table
 */
const _pullMessage = async (ids: string[], newSequence: number, sortArr: Spread[]) => {
    try {
        const {
            data: { items },
        } = await getMessagesByIds(ids);
        // 消息详情转map --> 排序
        // const map = new Map<string, MessageItem>();
        // res.data.items.forEach((item: any) => item.id && map.set(item.id, item));
        // id -> item
        const map = _.keyBy(items, "id");

        // const sortMap = new Map<string, Message>();
        // 排序
        // const sort_arr = sortArr
        //     .map(({ id, sequence, is_read }) => {
        //         const item: MessageItem = map[id] as MessageItem;
        //         if (item) {
        //             return { ...item, sequence, is_read };
        //         }
        //         return null;
        //     })
        //     .filter((item) => !!item);

        // 根据 消息ids 排序
        const sort_arr = sortWithMap(sortArr, map);

        // 生成 displayTime
        const resArr = await update_by_last(sort_arr);

        // delete msg
        let needDelIds: string[] = [];

        // revoke all msg
        let needRevokeMsgs: { [key: string]: {} } = {};

        // 未读消息集合 chatId -> set
        let markAsRead: Map<string, Set<string>> = new Map();

        let userMessageList: Message[] = []; // filter deep message type

        // delete msg by ChatId
        let clearSessionBelowOrEqual: { [key: string]: number } = {};

        const msgList: Message[] = resArr.map((item: MessageItem & Spread) => {
            let formatItem = transformData(item);

            // tag: delete flag
            // if (item.status) {
            //     formatItem = { ...formatItem, deleteFlag: item.status };
            // }

            // tag: read flag && 不是用户消息，默认已读
            if (item.is_read || !filterNeedAckMessage(formatItem)) {
                // formatItem = { ...formatItem, status: MessageStatus.ACKRead };
                // 已读
                formatItem = { ...formatItem, status: MessageStatus.read };
            }

            // to delete in local
            if (item.type === MessageType.DeleteFlagMessage) {
                needDelIds = collectionDelIds(needDelIds, item);
                needRevokeMsgs = collectionRevokeIds(needRevokeMsgs, item);
                putUnreadIdsToMap(markAsRead, item);
            }

            // 回执消息 加入 集合
            if (item.type === MessageType.ACKReadMessage) putUnreadIdsToMap(markAsRead, item);
            // At Message
            if (item.type === MessageType.AtMessage) {
                const isWinForce = remote.getCurrentWindow().webContents.isFocused();
                putAtType(formatItem);
                //收到@与我相关的 托盘图标闪烁提醒
                if (formatItem.at && !isWinForce) {
                    const { chatId } = formatItem;
                    groupInfoModel.getGroupInfo(chatId).then(async (res) => {
                        const { avatarPath } = res;
                        if (avatarPath) {
                            const localPath = await createRoundAvatar(avatarPath);
                            ipcRenderer.send("receive-newMsg", { senderAvatar: localPath });
                        }
                    });
                }
            }

            // 过滤 用户可见消息
            if (isUserMessage(formatItem)) userMessageList.push(formatItem);

            return formatItem;
        });

        // 删除消息
        // if (needDelIds.length) {
        //     userMessageList = handleDeleteMessage(needDelIds, userMessageList);
        // }

        let groupByChat = _.keyBy(userMessageList, "chatId");

        needDelIds.length && (await MessageModel.setMessageDeleteFlag(needDelIds));

        await Promise.all(
            Object.entries(needRevokeMsgs).map(async ([chatId, needId]) => {
                await MessageModel.setMessageRevokeFlag(chatId, needId);
            })
        );
        /* {

            // let ids: string[] = [];
            // markAsRead.forEach((value, key) => {
            //     // check groupByChat message is include. to update
            //     if (groupByChat[key] && value.has(groupByChat[key].mid)) {
            //         groupByChat[key].status = MessageStatus.ACKRead;
            //     }
            //
            //     ids = [...ids, ...Array.from(value)];
            // });
            //
            // if (ids.length) MessageModel.updateAckRead(ids);
        }*/

        // get session baseInfo id not exist
        // const gids = Object.keys(groupByChat).filter((item) => item.startsWith("g"));

        // new Message insert to db

        // use native bulk api
        // if (isInit) await MessageModel.bulkAddItems(msgList);

        let markReadIds: string[] = [];
        if (markAsRead.size) {
            const { groupByChatIdMap, ids } = updateMessageToRead_SyncSession(
                markAsRead,
                groupByChat
            );

            // 更新最后一条消息 在会话表中的状态
            groupByChat = groupByChatIdMap;

            // 已读回执ids
            markReadIds = ids;
        }

        // sync conversation list
        await initConversationList(groupByChat);

        await MessageModel.insertBulkItems(msgList);

        if (markReadIds.length) MessageModel.updateAckRead(markReadIds);

        // 拉取完成
        nc.publish(Event.PullDone, newSequence);
        return true;
    } catch (e) {
        console.error(e);
        nc.publish(Event.PullDone);
        return false;
    }
};

/**
 * to pull
 * @params sequence { Long string }
 */
export const pull = (() => {
    let currentSequence: number = 0; // TODO 本地缓存 seq
    let isPulling = false; // 是否在这拉取中
    let isContinue = false; // 是否需要拉取结束后再次拉取

    // 一次读取完成
    nc.addObserver<number>(Event.PullDone, (sequence: number | null) => {
        isPulling = false;

        // 是否需要再次拉取
        if (sequence && sequence > currentSequence) {
            currentSequence = sequence;

            try {
                let seq: any = localStorage.getItem("cacheSequence");
                if (seq) seq = JSON.parse(seq);
                else seq = {};

                seq[UserInfo._id] = sequence;

                seq = JSON.stringify(seq);
                localStorage.setItem("cacheSequence", seq);
            } catch (e) {}
        }

        // console.log(`currentSequence`, currentSequence)

        if (isContinue) {
            isContinue = false;
            return pull(currentSequence);
        }
    });

    return async (sequence?: number, useInit?: boolean) => {
        // <= 本地

        // 大于本地seq
        if (sequence && sequence <= currentSequence) return false;

        if (useInit && sequence !== undefined) currentSequence = sequence;

        // if (!sequence) sequence = currentSequence;
        // 正在读取中
        if (isPulling) {
            isContinue = true;
            return false;
        }

        // 空闲
        isPulling = true;

        // await _pullMessageIdList(sequence);
        return await _pullMessageIdList(currentSequence);
    };
})();
