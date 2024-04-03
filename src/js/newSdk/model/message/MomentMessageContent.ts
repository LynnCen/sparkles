import Message from "./Message";
import MomentsType from "../moments/instance/MomentsType";
import { ImageContentProps } from "@newSdk/model/message/ImageMessageContent";
import MessageType from "@newSdk/model/MessageType";

interface IContentProps {
    uid: string;
    mid: string; // moments id
    type: MomentsType; // moments 类型
    contentType: number; // 判断是文字、图片、还是视频,如果是视频，要在图片上加一个播放按钮
    text?: string;
    image: ImageContentProps; // 如果是多张图就是第一张图；如果是视频就展示缩略图
}
export class MomentMessageContent extends Message {
    content: IContentProps;
    constructor(chatId: string, content: IContentProps) {
        super(MessageType.MomentShareMessage, chatId);
        this.content = content;
    }
}

export default MomentMessageContent;
