import axios from "@newSdk/service/apiCore/tmmCore";
const revokeMessage_chatId = (chat_ids: string[], except_mids?: string[]) => {
    return axios({
        url: "/revokeMessageByChatIds",
        method: "post",
        data: { chat_ids, except_mids },
    });
};
export default revokeMessage_chatId;
