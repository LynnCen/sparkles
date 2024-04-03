import ACKReadMessageContent from "@newSdk/model/message/ACKReadMessageContent";
import sendMessage from "../service/api/handleMessage";

export default async function sendAckReadMessage(chatId: string, mid: string[]) {
    if (!chatId || !mid || !mid.length) return;
    // if (chatId.startsWith("s_")) {
    const message = new ACKReadMessageContent(chatId, { mids: mid }) as any;
    sendMessage(message);
    // }
}
