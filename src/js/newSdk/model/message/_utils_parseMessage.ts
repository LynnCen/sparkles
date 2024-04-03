import { Message } from "../Message";
import MessageType from "@newSdk/model/MessageType";
import ACKReadMessageContent from "./ACKReadMessageContent";
import AttachmentMessageContent from "./AttachmentMessageContent";
import ImageMessageContent from "./ImageMessageContent";
import TextMessageContent from "./TextMessageContent";
import VideoMessageContent from "./VideoMessageContent";
import MiniProgramContent from "./MiniProgramContent";
import MomentMessageContent from "@newSdk/model/message/MomentMessageContent";

export default (message: Message<any>) => {
    const { type, chatId, content } = message;

    switch (type) {
        case MessageType.ACKReadMessage:
            return new ACKReadMessageContent(chatId, content);
        case MessageType.AttachmentMessage:
            return new AttachmentMessageContent(chatId, content);
        case MessageType.ImgMessage:
            return new ImageMessageContent(chatId, content);
        case MessageType.TextMessage:
            return new TextMessageContent(chatId, content);
        case MessageType.VideoMessage:
            return new VideoMessageContent(chatId, content);
        case MessageType.MiniProgramMessage:
            return new MiniProgramContent(chatId, content);
        case MessageType.MomentShareMessage:
            return new MomentMessageContent(chatId, content);
        default:
            return null;
    }
};
