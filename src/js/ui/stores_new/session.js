/**
 * @Author Pull
 * @Date 2021-05-22 18:14
 * @project session
 */
import { action, observable, computed, toJS } from "mobx";
import chatModel from "@newSdk/model/Chat";
import NewChat from "./chat";
import messageModel from "@newSdk/model/Message";
import UserInfo from "@newSdk/model/UserInfo";
import memberModel from "@newSdk/model/Members";
import groupMemberModel from "@newSdk/model/GroupMembers";
import getGroupNotice from "@newSdk/service/api/group/getGroupNotice";
import nc from "@newSdk/notification/index";
import _ from "lodash";
import chatStore from "./chat";
import groupInfoModel from "@newSdk/model/GroupInfo";
import { arrayToMap, fillAndUpdate, getMsgDisplayTime, getSingleChatTarget } from "@newSdk/utils";
import getGroupInfos from "@newSdk/logic/group/getGroupInfos";
import { OfficialServices } from "@newSdk/index";
import translateStore from "../pages/Home/NewChat/components/Message/MessageContent/TextContent/stores/translate";
import sessionInfoProxy from "./sessionInfoProxy";
import quoteStore from "../pages/Home/NewChat/components/quote/quoteStore";
import { encryptSha1 } from "utils/sn_utils";
import draftTable from "@newSdk/model/draft";
import keyValueModel from "@newSdk/model/keyValues/KeyValue";
import SupportDBKey from "@newSdk/model/keyValues/SupportDBKey";
class Session {
    @observable sessionList = [];
    @observable sessionMap = new Map();
    @observable draftMap = new Map();

    @observable tempSessionList = []; // Temporary session list
    @observable focusSessionId = "";
    @observable search = "";
    hideSessionChatId = "";

    prevFocusSessionId = "";

    // @observable focusSessionInfo = {};
    //
    @observable page = 1;
    pageCount = 20;
    hasMore = true;
    @observable lastEmoji = [];
    // view
    // is scrollIntoViewIfNeeded doing
    @observable scrolling = false;

    constructor() {
        nc.on(messageModel.Event.MessageChangeEvent, async () => {
            if (!this.focusSessionId.startsWith("g_")) return;

            // console.log(messages);
            // const session = _.keyBy([...messages].reverse(), "chatId");
            //
            const { focusSessionId } = self;

            // get current session message
            const lastMessage = await messageModel.getLastMessageOfSession(focusSessionId);

            if (lastMessage && lastMessage.content) {
                // current session kick out of session
                if (lastMessage.content.temId === "kick-out-session-member") {
                    if (lastMessage.content.target.includes(UserInfo._id)) {
                        return NewChat.updateAlreadyKicked(true);
                    } else {
                        return NewChat.isGroupAlive(focusSessionId);
                    }
                }

                if (
                    lastMessage.content.temId === "invite-join-session" &&
                    lastMessage.content.target.includes(UserInfo._id)
                ) {
                    NewChat.updateAlreadyKicked(false);
                    return false;
                }
            }
        });

        nc.on(groupMemberModel.Event.MemberInfoChanged, (list, gid) => {
            if (gid === self.focusSessionId && NewChat.alreadyKicked) {
                const isExist = list.find((item) => item.uid === UserInfo._id);
                // existence
                if (isExist && !isExist.deleted) {
                    NewChat.updateAlreadyKicked(false);
                }
            }
        });

        nc.on(chatModel.Event.ChatChange, (sessions) => {
            return self.loadConversation(sessions);
        });
        nc.on(draftTable.Event.DraftChange, async (chatId) => {
            self.loadDraftmsg(chatId);
            // const draftMsg = await draftTable.getMsg(chatId);
            // console.log("draftMsg", draftMsg);
        });
        nc.on(keyValueModel.Event.lastEmojiModelChange, (list) => {
            self.lastEmoji = list;
        });
    }
    @action async loadDraftmsg(chatId) {
        const draftMsg = await draftTable.getMsg(chatId);
        if (!draftMsg && self.draftMap.has(chatId)) {
            self.draftMap.delete(chatId);
        }
        {
            self.draftMap.set(chatId, draftMsg);
        }
    }
    @action async initLastEmoji() {
        let emojiList = (await keyValueModel.getValueByKey(SupportDBKey.LastEmoji)) || [];
        if (emojiList.length > 10) emojiList = emojiList.slice(-10);
        self.lastEmoji = emojiList;
    }
    @computed get renderList() {
        if (self.search) {
            return self.sortSessionAsideByRule.filter((item) => {
                const info = Object.assign(
                    {},
                    item,
                    sessionInfoProxy.sessionInfoProxy(item.chatId)
                );
                return `${info.name}${info.friendAlias}${info.alias}`.includes(self.search);
            });
        }

        const renderCount = self.page * self.pageCount;
        const renderAbleList = self.sortSessionAsideByRule;
        if (renderCount - renderAbleList.length > 0) self.hasMore = false;
        else self.hasMore = true;

        return renderAbleList.slice(0, renderCount);
    }

    @computed get isReadonlySession() {
        return OfficialServices.includes(getSingleChatTarget(self.focusSessionId));
    }

    @computed get focusSessionInfo() {
        if (!self.focusSessionId) return {};
        const item = self.sortSessionAsideByRule.find(
            (item) => item.chatId === self.focusSessionId
        );
        return item || {};
    }
    @computed get focusDraftInfo() {
        if (!self.focusSessionId) return {};
        const item = self.draftMap.get(self.focusSessionId);
        return item || {};
    }

    // isTop by stickActionTime <-- timestamp
    @computed get sortSessionAsideByRule() {
        const withDraftList = [...self.tempSessionList, ...self.sessionList].map((item) => {
            if (self.draftMap.has(item.chatId) && self.draftMap.get(item.chatId)) {
                const { timestamp } = self.draftMap.get(item.chatId);

                return {
                    ...item,
                    timestamp: timestamp > item.timestamp ? timestamp : item.timestamp,
                    draft: self.draftMap.get(item.chatId),
                };
            } else {
                return item;
            }
        });
        const list = withDraftList.sort((a, b) => {
            if (a.isTop && b.isTop) return b.stickActionTime - a.stickActionTime;
            if (!a.isTop && b.isTop) return 1;
            if (!b.isTop && a.isTop) return -1;

            let aTimeStamp = a.timestamp;
            let bTimeStamp = b.timestamp;
            if (!aTimeStamp && a.lastMessage) {
                const time = getMsgDisplayTime(a.lastMessage);
                if (time) aTimeStamp = time;
            }
            if (!bTimeStamp && b.lastMessage) {
                const time = getMsgDisplayTime(b.lastMessage);
                if (time) bTimeStamp = time;
            }

            if (!aTimeStamp && bTimeStamp) return 1;
            if (!bTimeStamp && aTimeStamp) return -1;
            if (!aTimeStamp && !bTimeStamp) return 0;

            return bTimeStamp - aTimeStamp;
        });
        // .sort((a, b) => (b.isTop || 0) - (a.isTop || 0));

        return list;
    }

    @action updateSearch(value) {
        self.search = value;
    }

    @action async loadConversation(sessions) {
        // Load local session
        // const chatList = await chatModel.getSessionList((item) => !item.hide);
        const list = sessions.filter((item) => !item.hide);
        // const map = new Map();
        // list.forEach((item) => map.set(item.chatId, item));

        const map = arrayToMap(list, "chatId");

        // Update temporary session
        self.tempSessionList = self.tempSessionList.filter((item) => !map.has(item.chatId));

        let newList = fillAndUpdate(self.sessionList, list, "chatId");
        newList = await self.filterHideSession(newList);
        self.sessionList = newList;
        self.sessionMap = arrayToMap(newList, "chatId");
        // Check whether the session corresponding to the current day message exists
        if (
            !self.sessionMap.has(self.focusSessionId) &&
            !self.tempSessionList.map((item) => item.chatId).includes(self.focusSessionId)
        ) {
            self.focusSessionId = "";
        }

        // if (selectDefault && self.sessionList[0] && !self.focusSessionId) {
        //     const defSessionId = self.renderList[0].chatId;
        //
        //     return self.selectSession(defSessionId);
        // }
    }

    @action async loadAllSession() {
        // Load local session
        let list = await chatModel.getSessionList();
        let draftList = await draftTable.getAllDraftMsg();
        const draftMap = arrayToMap(draftList, "chatId");
        const map = arrayToMap(list, "chatId");

        // Update temporary session
        self.tempSessionList = self.tempSessionList.filter((item) => !map.has(item.chatId));
        list = await self.filterHideSession(list);
        self.sessionList = list;
        self.sessionMap = map;
        self.draftMap = draftMap;

        // Check whether the session corresponding to the current day message exists
        if (
            !map.has(self.focusSessionId) &&
            !self.tempSessionList.map((item) => item.chatId).includes(self.focusSessionId)
        ) {
            self.focusSessionId = "";
        }
    }

    @action async checkIsKickedOutOfGroup({ chatId, lastMessage }) {
        let flag = false;

        if (!lastMessage) {
            const sessionSnapshot = chatModel.getCurrentSessionSnapshot();
            const session = sessionSnapshot.find((item) => item.chatId === chatId);
            lastMessage = (session || {}).lastMessage;
        }
        try {
            // check isKicked by lastMessage
            if (
                lastMessage &&
                lastMessage.content.temId === "kick-out-session-member" &&
                lastMessage.content.target.includes(UserInfo._id)
            ) {
                NewChat.updateAlreadyKicked(true);
                return true;
            }

            // check by is still GroupMember
            const groupMember = await groupMemberModel.getGroupMembers(chatId, true);
            // be sure with the session data synced
            if (groupMember && groupMember.length) {
                const isExist = groupMember.find((item) => item.uid === UserInfo._id);
                if (!isExist || isExist.deleted) {
                    NewChat.updateAlreadyKicked(true);
                    return true;
                }
            }

            NewChat.updateAlreadyKicked(false);
        } catch (e) {
            console.error(e);
        }
    }

    @action async selectSession(chatId, autoVisible = false, force = false) {
        if (!chatId) return;
        chatStore.toggleShowSelect(false);
        chatStore.resetMsgIdsWillDelete();
        //  Repeat Click
        // if (self.focusSessionId === chatId && !force) return false;
        // clear quote
        if (self.focusSessionId !== chatId) {
            // Session translation agent empty
            translateStore.clearTransitionMap();
            // Message reference cleanup
            // MessageQuote.abrogateQuote();
            quoteStore.abrogateQuote();

            const res = await draftTable.getMsg(self.focusSessionId);
            if (res) draftTable.publishNC(self.focusSessionId);
        }
        if (self.focusSessionId === chatId && !self.focusSessionInfo.unreadCount) return;

        // todo: intersection
        // intersectionObserver.resetObserve();

        NewChat.updateAlreadyKicked(false);
        // NewChat.alreadyKicked = false;

        // self.updateFocusSessionInfo(chatId);

        if (chatId.startsWith("g_")) {
            // sync session base info
            getGroupInfos([chatId]);

            // check is out of
            const isKicked = await self.checkIsKickedOutOfGroup({ chatId });
            if (!isKicked) {
                const groupInfo = await groupInfoModel.getGroupInfo(chatId);
                const noticeId = encryptSha1(groupInfo.notice ? groupInfo.notice : "");
                getGroupNotice(chatId, noticeId);
            }
        }

        // no exist in conversation
        // NewChat.clearMessage();
        let session = await chatModel.getSessionById(chatId);

        if (session && session.hide) await chatModel.showSessionByChatId(chatId);

        if (!session) {
            session = self.tempSessionList.find((item) => item.chatId === chatId);
        }
        // checkout local db to create session
        if (!session) {
            session = await self.checkHistorySession(chatId);
        }

        if (!session) {
            self.insertTemSession(chatId);
        }

        // scroll to visible if need
        if (autoVisible) self.setConversationVisible(chatId);
        // load message
        await NewChat.loadConversationMessage(chatId);
        self.focusSessionId = chatId;
    }

    @action setConversationVisible(chatId) {
        const sortList = self.sortSessionAsideByRule;
        const index = sortList.findIndex((item) => item.chatId === chatId) + 10;

        self.page = Math.ceil(index / self.pageCount) + 1;

        self.scrolling = true;
        setTimeout(() => {
            /*scrollInto view*/
            const $conversation = document.querySelector(`[data-conversationkey=${chatId}]`);
            console.log($conversation);
            if ($conversation) {
                $conversation.scrollIntoViewIfNeeded(true);
            }
            setTimeout(() => (self.scrolling = false), 1000);
        }, 1000);
    }

    @action setLoadPage(page) {
        if (page) {
            self.page = page;
        }
        if (self.hasMore) self.page = self.page + 1;
    }

    @action async deleteSession(chatId) {
        self.hideSessionChatId = chatId;
        self.tempSessionList = self.tempSessionList.filter((item) => item.chatId !== chatId);
        const res = await chatModel.hideSessionByChatId(chatId);
        if (res && chatId === self.focusSessionId) self.focusSessionId = "";
    }

    async getInfoByChatId(sessionId) {
        if (sessionId.startsWith("s_")) {
            const uids = sessionId.split("_");
            const { _id } = UserInfo;
            const id = uids[1] === _id ? uids[2] : uids[1];

            return await memberModel.getMemberById(id);
        } else if (sessionId.startsWith("g_")) {
            return await groupInfoModel.getGroupInfo(sessionId);
        }
        return {};
    }

    // Zero hour session
    @action async insertTemSession(sessionId) {
        const temExist = self.tempSessionList.filter((item) => item.chatId === sessionId);
        if (temExist && temExist.length > 0) return false;
        if (self.sessionMap.has(sessionId)) return false;

        const info = await self.getInfoByChatId(sessionId);
        if (info) {
            self.tempSessionList.push({
                chatId: sessionId,
                name: info.friendAlias || info.name,
                avatar: info.avatarPath,
                unreadCount: 0,
                timestamp: Date.now(),
                lastMessage: { timestamp: Date.now() },
                isTop: 0,
            });
        }
    }

    async checkHistorySession(chatId) {
        const message = await messageModel.getLastMessageOfSession(chatId);
        if (message) {
            const info = await self.getInfoByChatId(chatId);

            const conversation = chatModel.createNewSession({
                name: info.friendAlias || info.name,
                avatar: info.avatarPath,
                chatId,
                lastMessage: message,
                timestamp: Date.now(),
                unreadCount: 0,
                isTop: 0,
            });
            self.tempSessionList.push(conversation);
            // create session
            // await chatModel.updateSessionById(chatId, {}, conversation);
            return conversation;
        }
    }

    async filterHideSession(sessionList) {
        const res = await Promise.all(
            sessionList.map(async (item) => {
                const {
                    hideInfo: { seq, i } = {},
                    lastMessage: { id = 0, sequence = 0 } = {},
                } = item;
                let hide = false;

                if (item.timestamp) {
                    hide = false;
                }
                if (i) {
                    // if (i === id || i === item.timestamp) hide = true;
                    if (i >= id || i === item.timestamp) hide = true;
                } else if (seq && seq !== -1) {
                    let maxSeq = sequence;
                    if (!maxSeq)
                        maxSeq = await messageModel.getMaxSequenceByChatIdWithUserMessage(
                            item.chatId
                        );
                    if (seq >= maxSeq && maxSeq !== 0) hide = true;
                }

                item.hide = hide;
                return item;
            })
        );
        const filterVis = res.filter((item) => !item.hide);
        return filterVis;
    }

    unForceSession() {}

    forceSession() {}

    @action
    clearCache() {
        self.sessionList = [];
        self.sessionMap = new Map();
        self.draftMap = new Map();
        self.tempSessionList = []; // Temporary session list
        self.focusSessionId = "";

        // @observable focusSessionInfo = {};
        //
        self.page = 1;
        self.pageCount = 20;
        self.hasMore = true;

        // view
        // is scrollIntoViewIfNeeded doing
        self.scrolling = false;
    }
}

const self = new Session();

export default self;
