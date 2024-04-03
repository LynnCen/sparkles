class MessageStatus {
    /**
     * todo：
     */
    static deleted = -1; // unused

    static sending = 1;
    static sent = 2;
    static sendFail = 3;
    static awaitSend = 4;
    static unread = 5;
    static read = 6;
    static ACKRead = 7;
}

export default MessageStatus;
