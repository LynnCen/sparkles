import Message from "./Message";
import MessageType from "@newSdk/model/MessageType";

interface IContentProps {
    objectId: string;
    name: string;
    fileType: string;
    duration: number;
    bucketId: string;
    poster: {
        width: number;
        height: number;
        objectId: string;
        fileType: string;
        bucketId: string; //22 5/31 Compatible mobile terminal
    };
}

class VideoMessageContent extends Message {
    content: IContentProps;

    constructor(chatId: string, content: IContentProps) {
        super(MessageType.VideoMessage, chatId);
        this.content = content;
    }
}

export default VideoMessageContent;
