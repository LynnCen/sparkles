class Message {
    type: number;
    chatId: string;
    extra?: any;

    constructor(type: number, chatId: string) {
        this.type = type;
        this.chatId = chatId;
    }
}

export default Message;
