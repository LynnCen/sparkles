import messageModel from "@newSdk/model/Message";
import hideChat from "@newSdk/service/api/conversation/hideChat";

export const hideConversation = async (chatId: string) => {
    const seq = await messageModel.getMaxSequenceByChatIdWithUserMessage(chatId);

    return hideChat(chatId, seq);
};

export default hideConversation;
