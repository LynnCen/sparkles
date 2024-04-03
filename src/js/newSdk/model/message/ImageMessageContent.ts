import MessageType from "@newSdk/model/MessageType";
import Message from "./Message";

export interface ImageContentProps {
    objectId: string;
    width: number;
    height: number;
    fileType: string;
    isOrigin?: number;
    size?: number;
    bucketId: string;
}

class ImageMessageContent extends Message {
    static supportType = [`png`, `jpg`, `jpeg`, "bmp", "gif", "webp"];
    static unSupportCompressType = ["bmp", "gif", "webp"];

    content: ImageContentProps;

    constructor(chatId: string, content: ImageContentProps) {
        super(MessageType.ImgMessage, chatId);
        this.content = content;
    }
}

export default ImageMessageContent;
