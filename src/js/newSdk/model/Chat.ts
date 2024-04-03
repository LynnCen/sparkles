import Dexie, { Table } from "dexie";
import { authorize, sessionLastMessageDecode, publishThrottle } from "./descriptor";
import nc from "../notification/index";
import { isUserMessage, Message } from "./Message";
import messageModal from "@newSdk/model/Message";
import reportUnread from "../logic/reportUnread";
import {
    createSingleChatId,
    getSingleChatTarget,
    getBaseInfoByChatId,
    arrayToMap,
} from "@newSdk/utils/index";
import memberModel from "./Members";
import _ from "lodash";
import { chatModel, db } from "./index";
import MessageStatus from "@newSdk/model/MessageStatus";
import groupInfoModel from "./GroupInfo";
import UserInfoModel from "./UserInfo";
import hideConversation from "@newSdk/logic/session/hideConversation";
import { decode } from "@newSdk/utils/messageFormat";
export interface Session {
    id?: number;
    chatId: string;
    lastMessage?: Message;
    unreadCount?: number;
    isMute?: number;
    avatar?: string;
    name: string;
    isTop?: number;
    isShowName?: number;
    timestamp?: number;
    hide?: boolean;
    hideInfo?: {
        i: number;
        seq: number;
    };
    stickActionTime?: number;
    // groupKicked?: boolean;
}
type UpdateGroupInfo = {
    [K in keyof Session]?: Session[K];
};

export enum EventType {
    ChatChange = "Chat_Change",
}

class Chat {
    private db?: Dexie;
    private userId?: string;
    private store?: Table<Session, string>;
    private sessionSnapshot: Session[] = [];
    static authorize = false;

    public Event = {
        ChatChange: "Chat_Change",
    };

    init(db: Dexie) {
        this.db = db;
        this.userId = db.name;
        this.store = db.table("chat");
        Chat.authorize = true;
        this.sessionSnapshot = [];
    }

    createNewSession(sessionProps: Session): Session | null {
        if (!sessionProps.chatId || !sessionProps.name) return null;
        return {
            timestamp: Date.now(),
            unreadCount: 0,
            isMute: 0,
            isTop: 0,
            isShowName: 0,
            hide: false,
            ...sessionProps,
        };
    }

    /* query */
    @authorize
    getUserId(): string | undefined {
        return this.userId;
    }

    @sessionLastMessageDecode
    @authorize
    async getSessionList(filter: { (item: Session): boolean } = () => true): Promise<Session[]> {
        try {
            const sessionList = (await this.store?.filter(filter).toArray()) || [];
            this.sessionSnapshot = sessionList;
            return sessionList;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    @authorize
    getCurrentSessionSnapshot(): Session[] {
        return this.sessionSnapshot || [];
    }

    @authorize
    async getSessionById(chatId: string): Promise<Session | undefined> {
        return this.store?.where(":id").equals(chatId).first();
    }

    // @authorize
    // async getSessionByUserId(userId: string): Promise<Session | undefined> {
    //     return this.store?.where(":id").equals(userId).first();
    // }

    @authorize
    async getSessionByIds(chatIds: string[]): Promise<Session[]> {
        return (await this.store?.where(":id").anyOf(chatIds).toArray()) || [];
    }

    /**
     * update session unread count & update last message
     * @param chatIds
     */
    @authorize
    async bulkUpdateSessionInfo(chatIds: string[]) {
        // const sessions = await this.getSessionList();
        const sessions = (await this.store?.toArray()) || [];

        const sessionMap = arrayToMap(sessions, "chatId");

        // 获取未读数
        const prs = chatIds.map(async (chatId: string) => {
            const unreadCount = (await messageModal.getAllUnReadMsgById(chatId)) || 0;
            const { at } = (await messageModal.getMessageAt(chatId))[0] || 0;

            return {
                chatId,
                unreadCount,
                at,
            };
        });

        // 获取最后一条消息
        const newSessions = chatIds.map(async (chatId) => {
            let msg = await messageModal.getLastMessageOfSession(chatId);
            let newSession = sessionMap.get(chatId);

            if (msg) {
                // has last message
                if (newSession) {
                    // has session in old list
                    // update session last message
                    newSession.lastMessage = msg;
                    newSession.timestamp = msg.timestamp;
                    // todo: 消息跳动问题 plan b
                    // newSession.timestamp = msg?.local?.sessionLastActionTime ?? msg.timestamp;
                    // debugger;
                } else {
                    const info = await getBaseInfoByChatId(chatId);
                    newSession = this.createNewSession({
                        lastMessage: msg,
                        chatId,
                        name: info.name || "",
                        avatar: info.avatarPath,
                    }) as Session;
                }

                // new session to create
                return newSession;
            }

            // todo: no last message
            if (newSession) {
                newSession.timestamp = Date.now();
                return newSession;
            } else {
                const info = await getBaseInfoByChatId(chatId);
                return this.createNewSession({
                    chatId,
                    name: info.name,
                    avatar: info.avatarPath,
                }) as Session;
            }
        });
        const [updatedSession, unreadMap] = await Promise.all([
            Promise.all(newSessions),
            Promise.all(prs),
        ]);

        const updatedSessionMap = arrayToMap(updatedSession, "chatId");

        // 1. 合并更新
        const updateSessions = unreadMap.map((item) => {
            return {
                ...(updatedSessionMap.get(item.chatId) || sessionMap.get(item.chatId) || {}),
                ...item,
            };
        });
        await this.store?.bulkPut(updateSessions);
        this.handlePublish(updateSessions);
        reportUnread();
    }

    /* insert */
    @authorize
    addConversation(session: Session) {
        this.store
            ?.add(session)
            .then(() => {
                this.handlePublish([session]);
            })
            .catch((e) => {
                console.warn(e);
            });
    }

    /* update */
    @authorize
    async updateSessionById(sessionId: string, updateOps: any, conversation?: Session) {
        const session = await this.getSessionById(sessionId);

        // 不存在 存在 新会话
        if (!session && conversation) {
            const session = { ...updateOps } as Session;

            // init conversation info
            const info = await getBaseInfoByChatId(sessionId);
            Object.assign(session, {
                avatar: info.avatarPath,
                name: info.name,
                isTop: 0,
                isMute: 0,
            });
            Object.assign(session, conversation);
            await this.addConversation(session);
            return session;
        }

        //
        if (!session && !conversation) return;

        // 更新会话
        const newSession = { ...session, ...updateOps };
        this.store?.put(newSession).then(() => {
            nc.publish(EventType.ChatChange, newSession);
        });
    }

    @authorize
    async updateSessionByChatId(chatId: string, updateProps: Partial<Session>) {
        this.store?.update(chatId, updateProps).then(async () => {
            const session = await this.store?.get({ chatId });
            if (session) this.handlePublish([session]);
        });
    }

    @authorize
    async updateSessionBulkIfExist(updateList: any[]) {
        const ids = updateList.map((item) => item.chatId);

        const existList = await this.store?.where("chatId").anyOf(ids).toArray();
        const existMap = _.keyBy(existList, "chatId");

        const list = updateList
            .filter((item) => !!existMap[item.chatId])
            .map((item) => ({ ...existMap[item.chatId], ...item }));

        this.store?.bulkPut(list).then(() => {
            this.handlePublish(list);
        });
    }

    @authorize
    async bulkPutSession(putData: any[]) {
        const existSession = (await this.store?.toArray()) || [];
        const existMap = _.keyBy(existSession, "chatId");
        putData = putData.map((item) => {
            const oldSession = existMap[item.chatId];
            if (oldSession) return { ...oldSession, ...item };
            else return item;
        });

        this.store?.bulkPut(putData).then(
            () => {
                this.handlePublish(putData);
            },
            (e) => console.error(`bulkPutSession`, e)
        );
    }

    @authorize
    async updateUnread(chatId: string) {
        const count = (await messageModal.getAllUnReadMsgById(chatId)) || 0;

        let flag = !!count;

        console.log(`${flag} --------->>>`, chatId, count);
        this.store?.update(chatId, { unreadCount: count }).then(async () => {
            const session = await this.getSessionById(chatId);

            console.log(`${flag} --------->>>`, chatId, count, session);
            if (session) this.handlePublish([session]);
            await reportUnread();
        });
    }
    /*

    @authorize
    async hideSingleSessionByUid(uids: string[]) {
        const sessions = uids.map((id) => createSingleChatId(UserInfoModel._id, id));

        const sessionList = await this.store?.where("chatId").anyOf(sessions).toArray();

        if (sessionList && sessionList.length) {
            const updateList = sessionList.map((item: Session) => {
                item.hide = true;
                return item;
            });

            this.store?.bulkPut(updateList).then(
                () => {
                    this.handlePublish(updateList);
                },
                (e) => console.error(`bulkPutSession`, e)
            );
        }
    }
*/

    async hideSessionByChatId(chatId: string) {
        try {
            // await this.store?.update(chatId, { hide: true });
            // await this.store?.delete(chatId);
            const session = await this.getSessionById(chatId);
            if (session?.unreadCount) messageModal.markSingleSessionAsRead([], chatId, true);
            if (session) await this.handleHideSessionById(chatId, session);

            return true;
        } catch (e) {
            console.error(`error in hideSessionByChatId`, e);
            return false;
        }
    }

    async showSessionByChatId(chatId: string) {
        try {
            await this.store?.update(chatId, { hide: false });
            const session = await this.getSessionById(chatId);
            if (session) this.handlePublish([session]);

            return true;
        } catch (e) {
            console.error(`error in hideSessionByChatId`, e);
            return false;
        }
    }

    @authorize
    async handleHideSessionById(chatId: string, session: Session) {
        const messageTable = db?.table("message");
        const chatTable = this.store;
        if (!messageTable || !chatTable) return;
        try {
            await db?.transaction("rw", messageTable, chatTable, async () => {
                // mark as read
                // const list =
                //     (await messageTable
                //         .where("chatId")
                //         .equals(chatId)
                //         .filter((item) => item.status === MessageStatus.unread)
                //         .toArray()) || [];
                await messageModal.markSingleSessionAsRead([], chatId);
                // if (list)
                //     await messageTable.bulkPut(list.map((item) => item.status === MessageStatus.read));
                const { id, mid } = session.lastMessage || {};
                const { id: Index } = (await messageModal.getMessageByMid(mid as string)) || {};
                // delete chat session
                await chatTable
                    .where("chatId")
                    .equals(chatId)
                    .modify({
                        hideInfo: {
                            i: Index || session.timestamp || 0,
                        },
                    });
            });

            self.handlePublish(await self.getSessionByIds([chatId]));
            // http hide
            hideConversation(chatId);
        } catch (e) {
            // chatTable
            console.error(e);
            return false;
        }
        // this.handleDeletePub(chatId);
        return true;
    }

    @publishThrottle(22, "chatId")
    handlePublish(sessions: Session[]) {
        sessions.map((session) => {
            try {
                if (session.lastMessage?.content) {
                    session.lastMessage.content = decode(session.lastMessage.content);
                }
            } catch (e) {}
            return session;
        });
        nc.publish(EventType.ChatChange, sessions);
    }
    handleDeletePub(chatId: string) {
        nc.publish(EventType.ChatChange, [{ chatId }], true);
    }
}
const self = new Chat();
export default self;
