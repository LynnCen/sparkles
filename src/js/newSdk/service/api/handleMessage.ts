import MessageType, { MessageContent, MediaDownloadStatus } from "../../model/MessageType";
import { createMessageId } from "../../utils";
import MessageStatus from "../../model/MessageStatus";
import UserInfoModel from "../../model/UserInfo";
import { Session } from "../../model/Chat";
import { encode } from "../../utils/messageFormat";
import { sendMessage as send } from "./sendMessage";
import { Message } from "@newSdk/model/Message";
import nodePath from "path";
import uploadMediaSource from "./s3Client/upload";
import isExits from "./s3Client/isExist";
import { cacheRoot } from "utils/sn_utils";
import { sendMessageHooks } from "./sendMessage";
import getBasicBucketInfo from "@newSdk/logic/getBasicBucketInfo";
import chatModel from "../../model/Chat";
import messageModel from "../../model/Message";

interface ResendConfig {
    isReSend: boolean;
    reSendHooks: sendMessageHooks;
}

export type Content<T = string> = {
    chatId: string;
    type: number;
    mid?: string;
    extra?: Message["extra"];
    content: T;
};

export const sendDefaultMessage_ = async (message: Message, hooks?: sendMessageHooks) =>
    send(message, hooks);

export const sendMediaMessage_ = async (
    message: Message,
    hooks?: sendMessageHooks,
    handleProgress?: Function
) => {
    // upload file to aws
    // uploadMediaSource()
    let { content } = message as any;
    content = JSON.parse(content) as Message<MessageContent.MediaContent>;
    const { objectId, fileType, bucketId } = content;

    const localPath = nodePath.join(cacheRoot, `${objectId}.${fileType}`);
    // is exits
    const exits = await isExits(`${objectId}.${fileType}`);

    if (exits) return send(message, hooks);

    const success = await uploadMediaSource(
        localPath,
        `${objectId}.${fileType}`,
        (e: ProgressEvent) => handleProgress && handleProgress(message.mid, e)
    );
    if (success) {
        // when send success update the state
        handleProgress && handleProgress(message.mid, { loaded: 1, total: 1 });
        return send(message, hooks);
    }
    // send fail
    message.status = MessageStatus.awaitSend;
    // await chatModel.updateSessionById(message.chatId, {
    //     lastMessage: message,
    //     timestamp: message.timestamp,
    // });
    // await chatModel.updateLastMessage(message.chatId, message);
    return messageModel.updateItem(message);
};

async function insertToLocalDB(message: Content<any>): Promise<Message> {
    // TODO not ok
    const userId = UserInfoModel._id;
    let { type, mid, content, extra, chatId } = message;
    if (!mid) mid = createMessageId(userId);
    const status = MessageStatus.sending;

    const msg: any = {
        mid,
        chatId,
        sender: userId,
        type,
        status,
        content: encode(content),
        timestamp: Date.now(),
    };

    if (extra) msg.extra = encode(extra);

    // image message init status
    // if (msg.type === MessageType.ImgMessage)
    //     msg.extra = { mediaStatus: MediaDownloadStatus.cached };

    // set bucketId

    // legacy
    if (
        [
            MessageType.AttachmentMessage,
            MessageType.ImgMessage,
            MessageType.AudioMessage,
            MessageType.VideoMessage,
        ].includes(msg.type)
    ) {
        const newContent = { ...content };
        const { s3_bucket_id } = await getBasicBucketInfo();
        if (!newContent.bucketId) newContent.bucketId = s3_bucket_id;
        msg.content = encode(newContent);
    }

    await messageModel.insertItem(msg);

    // todo tem check new session,
    // await chatModel.updateLastMessage(chatId, msg, true);
    // await chatModel.updateSessionById(
    //     chatId,
    //     { lastMessage: msg, timestamp: msg.timestamp },
    //     { chatId } as any // effect to create
    // );

    return { ...msg };
}

async function HandleMessage(
    message: Message<any>,
    handleProgress?: Function,
    resendConfig?: ResendConfig
) {
    try {
        // insert local db
        if (!resendConfig) message = await insertToLocalDB(message);

        /**
         * TODO: Tips: add message action sync to logic/reSendMessage
         */
        switch (message.type) {
            case MessageType.ImgMessage:
            case MessageType.AttachmentMessage:
            case MessageType.VideoMessage: {
                await sendMediaMessage_(message, resendConfig?.reSendHooks || {}, handleProgress);
                break;
            }
            case MessageType.TextMessage:
            case MessageType.MomentShareMessage:
            default: {
                await sendDefaultMessage_(message, resendConfig?.reSendHooks);
                break;
            }
        }
    } catch (e) {
        console.log("send Message error", e);
    }
}

export default HandleMessage;
