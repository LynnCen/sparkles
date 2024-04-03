/**
 * @Author Pull
 * @Date 2021-05-23 14:55
 * @project chat
 */
import { observable, action, computed } from "mobx";
import messageModel from "@newSdk/model/Message";
import sendMessage from "@newSdk/service/api/handleMessage";
import SessionStore from "./session";
import MessageStatus from "@newSdk/model/MessageStatus";
import { createMessageId, getSingleChatTarget, isGroup, isP2P } from "@newSdk/utils";
import React, { Fragment } from "react";
import { NotificationAgentId } from "@newSdk/index";
import MessageType from "@newSdk/model/MessageType";
import _, { groupBy, sortBy } from "lodash";
import UiEventCenter, { UiEventType } from "utils/sn_event_center";
import nc from "@newSdk/notification";
import chatModel from "@newSdk/model/Chat";
import groupMemberModel from "@newSdk/model/GroupMembers";
import UserInfo from "@newSdk/model/UserInfo";
import checkGroupAlive from "@newSdk/logic/group/checkGroupAlive";
import moment from "moment";
import settings from "../stores/settings";
import { remote } from "electron";
import quoteStore from "../pages/Home/NewChat/components/quote/quoteStore";
import UserInfoModel from "@newSdk/model/UserInfo";
import { encode } from "@newSdk/utils/messageFormat";
import draftTable from "@newSdk/model/draft";
class Chat {
    /* 数据源 */
    @observable currentMessageList = [];
    currentMessageMap = new Map();

    /* 列表控制 */
    @observable hasMore = true;
    messageLoading = false;

    /* 被提出群聊 flag */
    @observable alreadyKicked = false;

    /* 多选的mids */
    @observable msgIdsWillDelete = [];

    /* 是否显示多选 */
    @observable isShowSelect = false;

    constructor() {
        nc.addObserver(messageModel.Event.MessageChangeEvent, this.onReceiveMessage);
    }

    @action onReceiveMessage(messageList) {
        self.transformNewMessage(messageList);
    }

    @observable msgUploadingList = {};

    @computed get timeGroupByMessageList() {
        const messageList = self.currentMessageList;
        const local = settings.locale;

        //
        moment.locale(local);

        // 时间分组
        const groupedArr = groupBy(
            messageList.filter((msg) => !msg.deleteFlag),
            (item) => moment(item.displayTime).format("YYYYMMDD")
        );

        // sort
        return {
            keys: sortBy(Object.keys(groupedArr), function (o) {
                return moment(o);
            }),
            groupedArr,
        };
    }

    @action async clearMessage(chatId) {
        const mids = await messageModel.getWaitSendMessageByChatId(chatId);
        const message = (await messageModel.getMessagesByMids(mids)) || [];
        self.currentMessageList = message;
        self.currentMessageMap = new Map(message);
        self.hasMore = true;
        self.messageLoading = false;
    }

    // Map ==> Array
    @action transformNewMessage(messageList, forceId = SessionStore.focusSessionId, init = false) {
        if (!forceId) return;

        let notFriendsTip = false;

        const currentSessionUnread = [];

        // const updateUnreadCount = (id) => {
        //     return chatModel.updateUnread(id);
        // };

        messageList.forEach((item) => {
            // 当前会话
            if (item.chatId === forceId) {
                // not friends flag
                if (item.status === MessageStatus.sendFail && item.local && item.local.notFriends)
                    notFriendsTip = true;
                else notFriendsTip = false;

                const exist = self.currentMessageMap.has(item.mid);

                // add unread Message
                if (item.status === MessageStatus.unread) currentSessionUnread.push(item);

                // 删除通知
                if ((item.status === MessageStatus.deleted || item.deleteFlag) && exist) {
                    self.currentMessageMap.delete(item.mid);
                }
                // 消息已读
                else if (item.status === MessageStatus.read && exist) {
                    self.currentMessageMap.set(item.mid, item);
                }
                // DB位置更新
                else if (exist && self.currentMessageMap.get(item.mid).id !== item.id) {
                    // id更新，消息表的顺序更新了
                    self.currentMessageMap.delete(item.mid);
                    self.currentMessageMap.set(item.mid, item);
                }
                // 查询，更新
                else self.currentMessageMap.set(item.mid, item);
            }
        });
        // self.messageList = Array.from(self.currentMessageMap).map(([k ,v]) => newSdkMessageToWfcMessage(v))
        self.currentMessageList = Array.from(self.currentMessageMap).map(([k, v]) => v);

        // insert Tip
        const lastMessage = self.currentMessageList[self.currentMessageList.length - 1];
        if (
            notFriendsTip &&
            isP2P(lastMessage.chatId) &&
            (!lastMessage.extra || lastMessage.extra.type !== "notFriends")
        ) {
            self.insertTempNode(
                {
                    type: "notFriends",
                    uid: getSingleChatTarget(lastMessage.chatId),
                },
                {
                    displayTime: lastMessage.displayTime,
                    sendTime: lastMessage.sendTime,
                    timestamp: lastMessage.timestamp,
                }
            );
        }

        if (
            (currentSessionUnread && currentSessionUnread.length) ||
            init ||
            SessionStore.focusSessionInfo.unreadCount
        ) {
            const isWindowForce = remote.getCurrentWindow().isFocused();
            if (!isWindowForce) return;
            // 当出现 force=true，则代表有脏数据，强制清除
            const force = !currentSessionUnread.length && SessionStore.focusSessionInfo.unreadCount;
            return messageModel.markSingleSessionAsRead(currentSessionUnread, forceId, force); // else updateUnreadCount(forceId);
        }
    }

    // 初始化会话加载
    @action async loadConversationMessage(focusSessionId = SessionStore.focusSessionId) {
        // 初始化 会话
        self.messageLoading = true;
        self.hasMore = true;
        // end

        const msg = await messageModel.loadMessage(focusSessionId, 20, 0, 0);
        if (msg.length < 20) self.hasMore = false;

        // self.currentMessageList = [];
        self.currentMessageMap.clear();
        // self.focusSessionId = focusSessionId;
        self.transformNewMessage(msg, focusSessionId, true);

        // 初始化会话后， 1s内不触发 加载更多
        setTimeout(() => (self.messageLoading = false), 100);

        return msg;
    }

    // 加载历史消息
    @action async loadHistoryMessage(offset = self.currentMessageList.length, count = 20) {
        if (!self.hasMore) return;
        if (self.messageLoading) return;

        self.messageLoading = true;
        const msg = await messageModel.loadMessage(SessionStore.focusSessionId, count, 0, offset);
        if (msg.length < count) self.hasMore = false;

        const map = new Map();
        msg.forEach((item) => map.set(item.mid, item));

        // 合并
        self.currentMessageMap = new Map([...map, ...self.currentMessageMap]);
        // self.messageList = [... Array.from(self.currentMessageMap).map(([k ,v]) => newSdkMessageToWfcMessage(v))]
        self.currentMessageList = [...Array.from(self.currentMessageMap).map(([_, v]) => v)];
        self.messageLoading = false;
    }

    // 重置列表长度，避免长列表
    @action async sliceMessageList(ultimateSize = 40) {
        const { messageLoading, currentMessageList } = self;
        if (messageLoading) return false;

        if (currentMessageList.length <= ultimateSize) return false;

        self.currentMessageList = currentMessageList.slice(currentMessageList.length - 40);
        const _currentMessageMap = new Map();
        self.currentMessageList.forEach((item) => _currentMessageMap.set(item.mid, item));
        self.currentMessageMap = _currentMessageMap;
        return true;
    }

    insertTempNode(extra, extendsOptions = {}) {
        const priKey = createMessageId(`notification_${Date.now()}`);
        const msg = {
            id: priKey,
            mid: priKey,
            chatId: "",
            sender: NotificationAgentId,
            type: MessageType._LocalTempTipMsg,
            content: {
                text: "",
            },
            timestamp: Date.now(),
            ...extendsOptions,
            extra,
        };

        self.currentMessageMap.set(msg.id, msg);
        self.currentMessageList = Array.from(self.currentMessageMap).map(([k, v]) => v);
    }

    @action async sendMessage(message) {
        if (!message) return;
        const { type } = message;

        const displayProgressMedia = [MessageType.VideoMessage, MessageType.AttachmentMessage];

        UiEventCenter.emit(UiEventType.SCROLL_TO_BOTTOM, message);
        if (displayProgressMedia.includes(type)) {
            return await sendMessage(message, self.updateLoadingProgressByMid);
        }
        // add quote
        const { currentMessage } = quoteStore;
        if (currentMessage && currentMessage.mid) message.extra = { mids: [currentMessage.mid] };

        // cls quote
        quoteStore.abrogateQuote();
        return await sendMessage(message);
    }

    @action
    updateLoadingProgressByMid(id, progress) {
        const { loaded, total } = progress;
        const rate = (loaded / total) * 100;
        self.msgUploadingList = { ...self.msgUploadingList, [id]: rate.toFixed(0) };

        let timer;
        if (rate === 100 && !timer) {
            timer = setTimeout(() => {
                delete self.msgUploadingList[id];
                clearTimeout(timer);
                timer = undefined;
            }, 1000);
        }
    }

    @action toggleShowSelect(val) {
        self.isShowSelect = val;
    }

    @action updateMsgIdsWillDelete(mid, checked) {
        if (checked) {
            return (self.msgIdsWillDelete = [...self.msgIdsWillDelete, mid]);
        }
        return (self.msgIdsWillDelete = self.msgIdsWillDelete.filter((item) => item !== mid));
    }

    @action resetMsgIdsWillDelete() {
        self.msgIdsWillDelete = [];
    }

    @action clearCache() {
        self.currentMessageList = [];
        self.currentMessageMap = new Map();

        /* 列表控制 */
        self.hasMore = true;
        self.messageLoading = false;

        /* 被提出群聊 flag */
        self.alreadyKicked = false;

        /* 多选的mids */
        self.msgIdsWillDelete = [];

        /* 是否显示多选 */
        self.isShowSelect = false;
    }

    @action async isGroupAlive(sessionId) {
        // const groupMember = await groupMemberModel.getGroupMembers(sessionId, true);
        // const user = groupMember.find((item) => item.uid === UserInfo._id);

        const info = await checkGroupAlive(sessionId);

        if (info.kicked !== undefined) {
            self.alreadyKicked = info.kicked;
        }
        // const isAlive = user && !user.deleted;
    }

    @action async updateAlreadyKicked(alreadyKicked) {
        self.alreadyKicked = alreadyKicked;
    }

    async insertDraftDb(msg = {}, quote) {
        const userId = UserInfoModel._id;
        const mid = createMessageId(userId);
        const { chatId, type, content = {} } = msg;
        const draftInfoMap = SessionStore.focusDraftInfo;
        const draftInfoDb = await draftTable.getMsg(SessionStore.focusSessionId);
        if (draftInfoDb) {
            let message;
            //引用消息
            if (quote) {
                message = Object.assign(draftInfoDb, {
                    timestamp: Date.now(),
                    content: draftInfoDb.content,
                    extra: encode(msg.extra),
                });
                return await draftTable.updateMsg(chatId, message);
            }
            //内容一致 不更新 数据库
            if (
                (type === MessageType.AtMessage &&
                    encode(draftInfoDb.content.items) === encode(content.items)) ||
                (type === MessageType.TextMessage &&
                    encode(draftInfoDb.content) === encode(content))
            ) {
                return;
            }
            message = Object.assign(
                { ...draftInfoDb },
                {
                    mid,
                    chatId,
                    sender: userId,
                    type,
                    content: content,
                    timestamp: Date.now(),
                }
            );
            return await draftTable.updateMsg(chatId, message);
        }
        const message = {
            mid,
            chatId,
            sender: userId,
            type,
            content: content,
            timestamp: Date.now(),
            extra: quote ? encode(msg.extra) : "",
        };
        await draftTable.putMsg(message);
    }
}

const self = new Chat();
export default self;
