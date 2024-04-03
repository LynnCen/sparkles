import { Message } from "@newSdk/model/Message";
import { db } from "@newSdk/model";
import messageModel from "@newSdk/model/Message";
import chatModel from "@newSdk/model/Chat";
import MessageStatus from "@newSdk/model/MessageStatus";
import MessageType from "@newSdk/model/MessageType";
import sendMessage from "@newSdk/service/api/handleMessage";

const resolveHandler = async (message: Message) => {
    if (message.status === MessageStatus.sent) {
        db?.transaction(
            "rw",
            db?.table("chat"),
            db?.table("message"),
            db?.table("memberInfos"),
            async () => {
                const { chatId } = message;

                const id = message.id as number;
                // 检测缓存 -- 当前id 后续列表
                // if (!cacheId || cacheId >= id) {
                //
                //   cacheMap.set(id, list);
                //   cacheId = id
                // }

                // 当前会话，大于当前 id 的消息。
                const currentSession = await messageModel.getMessagesAfterPrimaryKeyInSession(
                    message.id as number,
                    chatId
                );

                // .filter(
                //     (item: Message) => item.chatId === chatId && (item.id as number) >= id && item.status === MessageStatus.sent
                //   );

                // 是否有后续发送成功的消息
                const hasNewMsg =
                    currentSession &&
                    currentSession.length &&
                    currentSession.filter((item: Message) => item.status === MessageStatus.sent);
                // 有发送成功的消息
                const newMsg = { ...message };
                if (hasNewMsg && hasNewMsg.length) {
                    // 删除原有消息，插入当前会话新消息
                    await messageModel.deleteItemByPrimaryKey(id);
                    // 插入新消息
                    Reflect.deleteProperty(newMsg, "id");
                    await messageModel.insertItem(newMsg);
                    // await chatModel.updateLastMessage(chatId, newMsg);
                    // await chatModel.updateSessionById(chatId, {
                    //     lastMessage: newMsg,
                    //     timestamp: newMsg.timestamp,
                    // });

                    return;
                }

                // 后续，没有发送成功消息，更改状态
                await messageModel.updateItem(newMsg);
                const sortArr = currentSession.sort(
                    (a: Message, b: Message) => (a.id as number) - (b.id as number)
                );
                const lastMessage = sortArr[sortArr.length - 1];
                // 当前是最后一条消息
                // if (newMsg.id === lastMessage.id) await chatModel.updateLastMessage(chatId, newMsg);
                // await chatModel.updateSessionById(chatId, {
                //     lastMessage: newMsg,
                //     timestamp: newMsg.timestamp,
                // });
            }
        ).catch(console.error);
    }
};

const rejectHandler = async (message: Message) => {};

export default async (msg: Message) => {
    msg = { ...msg };
    if (typeof msg.content !== "string") {
        try {
            msg.content = JSON.stringify(msg.content);
        } catch (e) {}
    }
    const hooks = { resolveHandler, rejectHandler };

    await sendMessage(msg, () => {}, { isReSend: true, reSendHooks: hooks });
    // // 上传逻辑
    // if (
    //     [
    //         MessageType.ImgMessage,
    //         MessageType.AudioMessage,
    //         MessageType.AttachmentMessage,
    //         MessageType.VideoMessage,
    //     ].includes(msg.type)
    // ) {
    //     sendMediaMessage_(msg, hooks);
    //     return;
    // } else {
    //     /*if (msg.type === MessageType.TextMessage)*/ return await sendDefaultMessage_(msg, hooks);
    // }
};
