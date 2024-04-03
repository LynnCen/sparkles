import Message from "./Message";
import MessageType from "@newSdk/model/MessageType";

interface IContentProps {
    mids: string[];
}

class ACKReadMessageContent extends Message {
    content: IContentProps = {
        mids: [],
    };

    constructor(chatId: string, content: IContentProps) {
        super(MessageType.ACKReadMessage, chatId);
        this.content = content;
    }
}

export default ACKReadMessageContent;
