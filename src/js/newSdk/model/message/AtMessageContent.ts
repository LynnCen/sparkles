import MessageType from "@newSdk/model/MessageType";
import Message from "./Message";

interface IContentProps {
    items: [];
}
export const TYPE_AT_ME = 0x01;
export const TYPE_AT_ALL = 0x02;
export const AT_ALL = "@_all";
export const AT_CONTENT_U = "u";
export const AT_CONTENT_T = "t";
class AtMessageContent extends Message {
    content: IContentProps = {
        items: [],
    };

    constructor(chatId: string, content: []) {
        super(MessageType.AtMessage, chatId);
        this.content.items = content;
    }
}

export default AtMessageContent;
