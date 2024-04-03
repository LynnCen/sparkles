import axios from "@newSdk/service/apiCore/tmmCore";
const delMessage_chatId = (chat_ids: string[], except_mids: string[]) => {
    return axios({ url: "/delMessageByChatIds", method: "post", data: { chat_ids, except_mids } });
};

export default delMessage_chatId;
