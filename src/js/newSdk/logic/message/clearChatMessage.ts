import messageModel from "@newSdk/model/Message";
import chatModel from "@newSdk/model/Chat";
import { isSuccess } from "@newSdk/utils/server_util";
import delMessage_chatId from "@newSdk/service/api/message/delMessage_chatId";
import { getDisplayMessage } from "@newSdk/utils";
export const clearChatMessage = async (chatId: string) => {
    if (!chatId) return;

    const messages = (await messageModel.getAllMessageByChatId(chatId)) || [];
    let mids: string[] = messages.map((item) => item.mid);
    const except_mids: string[] = await messageModel.getWaitSendMessageByChatId(chatId);
    if (except_mids.length) {
        const s = new Set(except_mids);

        mids = mids.filter((item) => {
            console.log(s.has(item));
            return !s.has(item);
        });
    }

    const res = await delMessage_chatId([chatId], except_mids);

    if (isSuccess(res)) {
        const session = await chatModel.getSessionById(chatId);
        let displayTime;
        console.log(session);
        if (session?.lastMessage) {
            displayTime = getDisplayMessage(session.lastMessage);
        } else{
            displayTime = session?.timestamp;
        }

        await messageModel.bulkDeleteItemByMids(mids, { deleteFlag: 1 });

        const message = (await messageModel.getMessagesByMids(except_mids)) || [];

        await chatModel.updateSessionByChatId(chatId, {
            lastMessage: message[0] || undefined,
            timestamp: displayTime,
        });

        return true;
    }

    return false;
};

export default clearChatMessage;
