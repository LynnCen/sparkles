import { isGroup } from "@newSdk/utils";
import { imAxios } from "@newSdk/service/apiCore";

const HIDE_GROUP = "/hideGroupChat";
const HIDE_P2P = "/hideSingleChat";
export const hideChat = async (chatId: string, seq: number) => {
    const fetchApi = isGroup(chatId) ? HIDE_GROUP : HIDE_P2P;

    // const get;
    await imAxios({
        url: fetchApi,
        method: "post",
        data: {
            chat_id: chatId,
            hide_sequence: seq,
        },
    });
};

export default hideChat;
