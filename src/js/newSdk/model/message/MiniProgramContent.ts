import Message from "./Message";
import MessageType from "@newSdk/model/MessageType";
import { AppInfo } from "@newSdk/service/api/openplatform";
import { ImageMedia } from "@newSdk/typings";
import { transformMediaSource } from "@newSdk/utils/ImageSource";

interface IContentProps {
    aid: string;
    description: string;
    icon: ImageMedia;
    logo: ImageMedia;
    name: string;
    type: number;
}

class MiniProgramContent extends Message {
    content: IContentProps;

    constructor(chatId: string = "", content: IContentProps) {
        super(MessageType.MiniProgramMessage, chatId);
        this.content = content;
    }

    static transformAppletDetail(appletInfo: AppInfo) {
        const { aid, description, icon, logo, name, type } = appletInfo;

        return {
            aid,
            description,
            icon: transformMediaSource(icon),
            logo: transformMediaSource(logo),
            name,
            type,
        };
    }
}

export default MiniProgramContent;
