import MessageType from "@newSdk/model/MessageType";
import Message from "./Message";

interface IContentProps {
    text: string;
}

class TextMessageContent extends Message {
    content: IContentProps = {
        text: "",
    };

    constructor(chatId: string, content: IContentProps) {
        super(MessageType.TextMessage, chatId);
        this.content = content;
    }
}

export default TextMessageContent;
