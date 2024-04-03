/*
 ** All chats info like is_stick_up is_mute
 */

import getChatSetting from "@newSdk/service/api/conversation/chatsInfo";
import chatModel from "@newSdk/model/Chat";
import messageModel from "../../model/Message";
import reportUnread from "@newSdk/logic/reportUnread";

type Setting = {
    id: string;
    chat_id: string;
    uid: string;
    is_top: number;
    is_mute_notify: number;
    mute_time: number;
    background: string;
    is_show_name: number;

    hide_sequence: number;
};

const init = async (ids: string[], isGroup: boolean) => {
    try {
        const {
            data: { items },
        } = await getChatSetting(ids, isGroup);
        let res = items.map(
            ({ chat_id: chatId, is_top: isTop, is_mute_notify: isMute }: Setting) => ({
                chatId,
                isMute,
                isTop,
            })
        );
        await chatModel.bulkPutSession(res);
        return res;
    } catch (e) {
        return [];
    }
};

export const setMuteUpdateUnread = async (ids: string[], isGroup: boolean) => {
    await init(ids, isGroup);
    await reportUnread();
};

export default init;
