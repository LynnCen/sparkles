import Dexie, { Table } from "dexie";
import nc from "../notification/index";
import { authorize, messageContentDecode, publishThrottle } from "./descriptor";
import { sendMessage as send } from "../service/api/sendMessage";
import MessageStatus from "./MessageStatus";
import { decodeList } from "../utils/messageFormat";
import MessageType, { MediaDownloadStatus } from "./MessageType";
import chatModel from "./Chat";
import { NotificationAgentId } from "@newSdk/index";
import userInfoModel from "./UserInfo";
import sendACKReadMessage from "@newSdk/logic/sendACKReadMessage";
import { Spread } from "../service/api/PullMessage";
import { MsgTools } from "utils/tools";
import { each } from "lodash";
import { ResponseItemV2 } from "../service/api/message/translate";
export interface Message<T = string> {
    id?: number;
    mid: string;
    sequence?: number;
    chatId: string;
    sender: string;
    type: number;
    status: number;
    content: T;
    timestamp: number;
    displayTime?: number;
    sendTime?: number;
    extra?: {
        mids?: string[];
        // mediaStatus?: MediaDownloadStatus;
    };
    local?: {
        notFriends?: boolean;
        sessionLastActionTime?: number;
        translate?: {
            text?: string;
            items?: ResponseItemV2;
        };
    };
    deleteFlag?: number;
    at?: number;
}

// interface Spread {
//     sequence: number;
//     id: string;
// }

type UpdateTag = {
    reSend?: boolean;
};

export enum EventType {
    MessageChangeEvent = "Message_Change",
}

export const DeleteFlag = {
    Deleted: 1,
};

class MessageEntity {
    private db?: Dexie;
    private userId?: string;
    private store?: Table<Message, number>;

    Event = {
        MessageChangeEvent: "Message_Change",
    };
    static authorize = false;
    init(db: Dexie) {
        this.db = db;
        this.userId = db.name;
        this.store = db.table("message");
        MessageEntity.authorize = true;
    }

    // region Query

    // TODO need optimize search efficient
    @authorize
    async getAllUnReadMsgById(conversationId: string = "") {
        const count =
            (await this.store
                ?.where("chatId")
                .equals(conversationId)
                ?.filter(filterNeedAckMessage)
                .count()) || 0;

        return count;
    }

    // get all unread messages
    @authorize
    async getAllUnread(): Promise<number | undefined> {
        return this.store
            ?.where("status")
            .equals(MessageStatus.unread)
            .filter(filterNeedAckMessage)
            .count();
    }

    // 获取对应 mid[] 列表
    @messageContentDecode
    @authorize
    async getMessagesByMids(mids: string[]): Promise<Message[]> {
        const messages = await this.store?.where("mid").anyOf(mids).toArray();
        return messages || [];
    }

    @messageContentDecode
    @authorize
    async getMessageByPrimaryId(ids: number[]): Promise<Message[]> {
        return (await this.store?.where(":id").anyOf(ids).sortBy(":id")) || [];
    }

    @messageContentDecode
    @authorize
    async getMessageBySequence(seq: number): Promise<Message | undefined> {
        return this.store?.where("sequence").equals(seq).first();
    }

    // 获取当前数据库不存在的消息 mid[] => mid[]
    @messageContentDecode
    @authorize
    async getUnExistMsg(mids: Spread[]): Promise<Spread[]> {
        // mid 列表
        const ids = mids.map((item) => item.id);

        // 已存在消息列表
        const exist = await this.getMessagesByMids(ids);
        // 已存在 mid 列表
        const existIds = exist.map((item) => item.mid);

        return mids.filter((item) => !existIds.includes(item.id)) || [];
    }

    //
    @messageContentDecode
    @authorize
    async getMessageByMid(mid: string): Promise<Message | undefined> {
        return this.store?.where("mid").equals(mid).first();
    }

    @messageContentDecode
    @authorize
    async getImageMessagesOfSession(chatId: string): Promise<Message[]> {
        const list = await this.store
            ?.where("chatId")
            .equals(chatId)
            .filter((item) => item.type === MessageType.ImgMessage && !item.deleteFlag)
            .reverse()
            .toArray();

        return list || [];
    }

    @authorize
    async getWaitSendMessage(): Promise<Message[]> {
        return (
            (await this.store
                ?.where("status")
                .anyOf([MessageStatus.awaitSend, MessageStatus.sending])
                .toArray()) || []
        );
    }

    @authorize
    async getWaitSendMessageByChatId(chatId: string) {
        let sendingMids: string[] = [];
        await this.store
            ?.where("chatId")
            .equals(chatId)
            .filter((item) =>
                [MessageStatus.sending, MessageStatus.awaitSend].includes(item.status)
            )
            .each((item) => {
                sendingMids.push(item.mid);
            });
        return sendingMids;
    }

    @authorize
    async getMessagesAfterPrimaryKeyInSession(id: number, chatId: string): Promise<Message[]> {
        return (
            (await this.store
                ?.where(":id")
                .inAnyRange([[id, Infinity]])
                .filter((m) => m.chatId === chatId)
                .toArray()) || []
        );
    }
    @authorize
    async getMessageAt(chatId: string): Promise<Message[]> {
        let atArr: Array<Message> = [];
        await this.store
            ?.where("chatId")
            .equals(chatId)
            .each((m) => {
                if (m.at) {
                    if (m.at > 0 && m.status == MessageStatus.unread && m.deleteFlag == 0)
                        atArr.push(m);
                }
            });

        return atArr;
    }

    @messageContentDecode
    @authorize
    async getLastMessageOfSession(chatId: string) {
        return this.store
            ?.where("chatId")
            .equals(chatId)
            .filter((msg) => !msg.deleteFlag && isUserMessage(msg))
            .last();

        /* todo: 解决消息跳动问题， plan B
        // 首先获取
        const last = await this.store
            ?.where("chatId")
            .equals(chatId)
            .filter((msg) => isUserMessage(msg))
            .last();

        if (!last || !last.deleteFlag) return last;

        // 删除消息时 记录最后一条消息的时间
        if (last.deleteFlag) {
            let lastTimeStamp = last.timestamp;

            const displayLast = await this.store
                ?.where("chatId")
                .equals(chatId)
                .filter((msg) => !msg.deleteFlag && isUserMessage(msg))
                .last();
            if (displayLast) {
                if (!displayLast.local) displayLast.local = {};
                displayLast.local.sessionLastActionTime = lastTimeStamp;
            }

            return displayLast;
        }
        */
        // return this.store
        //     ?.where("chatId")
        //     .equals(chatId)
        //     .filter((msg) => !msg.deleteFlag && isUserMessage(msg))
        //     .last();
    }

    @authorize
    async getAllMessageByChatId(chatId: string) {
        return this.store
            ?.where("chatId")
            .equals(chatId)
            .filter((msg) => !msg.deleteFlag)
            .toArray();
    }

    @authorize
    async getAllMySendMessagesByChatId(chatId: string): Promise<string[]> {
        const mids: string[] = [];
        await this.store
            ?.where("chatId")
            .equals(chatId)
            .filter((item) => !item.deleteFlag && userInfoModel._id === item.sender)
            .each((item) => {
                mids.push(item.mid);
            });
        return mids;
    }

    @authorize
    async getAllRevokeMidsByChatId(chatId: string, operator: string) {
        const mids: string[] = [];
        await this.store
            ?.where("chatId")
            .equals(chatId)
            .filter((item) => !item.deleteFlag && operator === item.sender)
            .each((item) => {
                mids.push(item.mid);
            });
        return mids;
    }

    // @prevLoadMediaMessage
    @messageContentDecode
    @authorize
    async loadMessage(
        conversationId = "",
        count = 20,
        formIndex = 0,
        offset = 0
    ): Promise<Message[]> {
        if (!conversationId) return [];
        // TODO filter primary ID
        const messages = await this.store
            ?.where("chatId")
            .equals(conversationId)
            .reverse()
            .filter((item) => !item.deleteFlag && isUserMessage(item))
            .offset(offset)
            .limit(count)
            .toArray();
        // .reverse()
        // .toArray()
        // .sortBy(":id")
        return (messages || []).reverse();
        // const list = (messages || [])
        //
        // let endIndex = list.length - formIndex - offset
        // let startIndex = list.length - count - formIndex - offset
        // startIndex = startIndex < 0 ? 0 : startIndex
        // endIndex = endIndex < 0 ? 0 : endIndex
        // return [...list].slice(startIndex, endIndex)
    }

    @authorize
    async getSequence(offset: number = 0): Promise<number> {
        try {
            const seqItem = await this.store
                ?.where("sequence")
                .inAnyRange([[offset, Infinity]])
                .last();
            if (seqItem) return seqItem?.sequence || 0;
            else return 0;
        } catch (e) {
            return 0;
        }
    }

    @authorize
    async getMaxSequenceByChatId(chatId: string): Promise<number> {
        try {
            let max = 0;
            await this.store
                ?.where("chatId")
                .equals(chatId)
                .each((item) => {
                    max = Math.max(max, item.sequence || 0);
                });

            return max;
        } catch (e) {
            return 0;
        }
    }

    @authorize
    async getMaxSequenceByChatIdWithUserMessage(chatId: string): Promise<number> {
        try {
            let max = 0;
            await this.store
                ?.where("chatId")
                .equals(chatId)
                .filter((item) => !item.deleteFlag && isUserMessage(item))
                .each((item) => {
                    max = Math.max(max, item.sequence || 0);
                });

            return max;
        } catch (e) {
            return 0;
        }
    }

    // 获取 当前数据库Name = userId
    @authorize
    getUserId(): string | undefined {
        return this.userId;
    }

    // @messageContentDecode
    // @authorize
    // async getAllImagesMessage(): Promise<Message[]> {
    //     const list = await this.store?.where("type").equals(MessageType.ImgMessage).toArray();
    //     return list || [];
    // }

    // endregion Query

    // region insert
    // 插入单条消息
    @authorize
    async insertItem(item: Message): Promise<void> {
        await this.store
            ?.add(item)
            .then((key) => {
                this.handlePublish([item]);
            })
            .catch((e) => {
                console.warn(e);
            });
    }

    async bulkAddItems(items: Message[]): Promise<void> {
        this.store?.bulkAdd(items).catch(console.error);
    }

    // 插入多条消息， 插入完成自动广播 插入成功项
    @authorize
    async insertBulkItems(items: Message[]): Promise<void> {
        await this.store
            ?.bulkAdd(items, { allKeys: true })
            .then(async (res) => {
                const messages = await this.getMessageByPrimaryId(res);

                this.handlePublish(messages);
            })
            .catch((e) => console.log(e));
    }

    // endregion insert

    // region update
    @authorize
    async updateItem(item: Message, options?: UpdateTag): Promise<void> {
        await this.store
            ?.put(item)
            .then(() => {
                // const msg = { ...item }
                // msg.content = decode(msg.content)

                // nc.publish(EventType.MessageChangeEvent, [msg])

                this.handlePublish([item]);

                if (options?.reSend) {
                    // 消息重发
                    send(item);
                }
            })
            .catch((e) => {
                console.warn(e);
            });
    }

    /**
     * todo: 操作数据量可能较大，这里暂时不发通知，业务层清空消息列表
     */
    @authorize
    async bulkDeleteItemByMids(mids: string[], changes: Partial<Message>) {
        return this.store?.where("mid").anyOf(mids).modify(changes);
    }

    async markSingleSessionAsRead(messages: Message[], sessionId: string, force = false) {
        // async maskSingleSessionAsRead(sessionId: string) {
        this.store
            ?.where("chatId")
            .equals(sessionId)
            .filter(filterNeedAckMessage)
            .toArray()
            .then((res) => {
                if (!res.length) {
                    if (force) {
                        console.log("effect force clear");
                        chatModel.updateUnread(sessionId);
                    }
                    return;
                }

                const changeMid: string[] = [];
                const asRead = res.map((item) => {
                    changeMid.push(item.mid);
                    return { ...item, status: MessageStatus.read };
                });
                this.store
                    ?.bulkPut(asRead)
                    .then(() => {
                        // nc to already load message
                        const listAsRead = messages.map((item) => ({
                            ...item,
                            status: MessageStatus.read,
                        }));

                        chatModel.updateUnread(sessionId);
                        sendACKReadMessage(sessionId, changeMid);
                        listAsRead.length && this.handlePublish(listAsRead);
                    })
                    .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
    }

    async setMessageDeleteFlag(ids: string[]) {
        const delMsgs = await this.getMessagesByMids(ids);
        // update the flag of message existed
        const updateObj = delMsgs.map((msg) => ({ ...msg, deleteFlag: DeleteFlag.Deleted }));
        await this.store?.bulkPut(updateObj);
        this.handlePublish(updateObj);
    }

    async setMessageRevokeFlag(chat_id: string, needId: {}) {
        const { operator = "", except_mids = [] } = { ...needId };

        const delMids = await this.getAllRevokeMidsByChatId(chat_id, operator);
        if (!except_mids.length) {
            await this.setMessageDeleteFlag(delMids);
        } else {
            const delArrMids = delMids.filter((item) => {
                return except_mids.forEach((except) => item !== except);
            });
            await this.setMessageDeleteFlag(delArrMids);
        }
    }

    // mark ad readed()
    async updateAckRead(ids: string[]) {
        const list = await this.getMessagesByMids(ids);
        list.map((item) => (item.status = MessageStatus.ACKRead));
        await this.store?.bulkPut(list);
        this.handlePublish(list);
    }

    async updateTranslateV2({ mid, items }: { mid: string; items: ResponseItemV2 }) {
        const msg = await this.getMessageByMid(mid);

        if (msg && msg.id) {
            if (!msg.local) msg.local = {};
            msg.local.translate = {
                items,
            };

            await this.store?.update(msg.id, { local: msg.local }).then((res) => {
                // this.handlePublish([msg], false);
            });
        }
    }

    async updateTranslate({ mid, text }: { mid: string; text: string }) {
        const msg = await this.getMessageByMid(mid);

        if (msg && msg.id) {
            if (!msg.local) msg.local = {};
            msg.local.translate = {
                text,
            };

            await this.store?.update(msg.id, { local: msg.local }).then(() => {
                // this.handlePublish([msg], false);
            });
        }
    }

    // endregion update

    // region delete
    @authorize
    async deleteItemByPrimaryKey(id: number): Promise<void> {
        const delMsg = await this.getMessageByPrimaryId([id]);

        const msg = delMsg[0];
        await this.store
            ?.where(":id")
            .equals(id)
            .delete()
            .then(async () => {
                msg.deleteFlag = 1;
                this.handlePublish([msg]);
            })
            .catch((e) => {
                console.warn(e);
            });
    }

    @authorize
    deleteItemInertNewPosition(msg: Message<any>) {
        this.db?.transaction("rw", this.db?.table("message"), async () => {
            const { id, mid } = msg;

            let flag = "";
            let key: number | string;

            if (id) {
                flag = ":id";
                key = id;
            } else {
                flag = "mid";
                key = mid;
            }

            await this.store
                ?.where(flag)
                .equals(key)
                .delete()
                .then(() => {
                    Reflect.deleteProperty(msg, "id");
                    // todo
                    msg.timestamp = Date.now();
                    this.store?.add(msg).then(() => this.handlePublish([msg]));
                });
        });
    }
    // endregion delete

    /* Publish */
    async handlePublish(messages: Message[], syncSession = true) {
        const publishList: Message<any>[] = [];

        messages.forEach((item) => {
            if (isUserMessage(item)) {
                const formatItem = decodeList(item) as Message;
                publishList.push(formatItem);
            }
        });
        // const list = await handleMediaMessage(msg);

        if (publishList.length) {
            nc.publish(EventType.MessageChangeEvent, publishList);

            if (syncSession) this.handleSyncSessionUnread(publishList);
        }
    }

    @publishThrottle(2000, "chatId")
    handleSyncSessionUnread(messages: any) {
        const ids: string[] = Array.from(new Set(messages.map((item: Message) => item.chatId)));
        return chatModel.bulkUpdateSessionInfo(ids);
    }
}

export const isUserMessage = (message: Message) =>
    ![MessageType.ACKReadMessage].includes(message.type);

export const filterNeedAckMessage = (item: Message) =>
    item.status === MessageStatus.unread &&
    ![NotificationAgentId, userInfoModel._id].includes(item.sender) &&
    isUserMessage(item);

const self = new MessageEntity();
export default self;
