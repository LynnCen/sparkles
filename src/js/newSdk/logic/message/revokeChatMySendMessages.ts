import messageModel from "@newSdk/model/Message";
import revokeMessage_chatId from "@newSdk/service/api/message/revokeMessageByChatId";
import { isSuccess } from "@newSdk/utils/server_util";

const revokeChatMySendMessages = async (chatId: string):Promise<boolean | undefined> => {
    if (!chatId) return false;
    
    let revmids:string[] = (await messageModel.getAllMySendMessagesByChatId(chatId)) || [];
    const sendingMids = (await messageModel.getWaitSendMessageByChatId(chatId)) || [];
    
    if (sendingMids.length) {
        const s = new Set(sendingMids);
        revmids = revmids.filter((item) => !s.has(item));
    }

    const res = await revokeMessage_chatId([chatId], sendingMids);
    if (isSuccess(res)) {
        await messageModel.setMessageDeleteFlag(revmids);
        return true;
    }
};
export default revokeChatMySendMessages;
