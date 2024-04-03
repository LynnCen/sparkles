import Message from "./Message";
import MessageType from "@newSdk/model/MessageType";

interface IContentProps {
    objectId: string;
    name: string;
    fileType: string;
    size: string;
    bucketId: string;
}

class AttachmentMessageContent extends Message {
    content: IContentProps;

    constructor(chatId: string, content: IContentProps) {
        super(MessageType.AttachmentMessage, chatId);
        this.content = content;
    }
}

export default AttachmentMessageContent;
