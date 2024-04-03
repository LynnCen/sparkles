import axios from "@newSdk/service/apiCore/tmmCore";
import chatModel from "@newSdk/model/Chat";
import { isSuccess } from "@newSdk/utils/server_util";

const SING_MUTE = "/updateSingleIsMuteNotify";
const GROUP_MUTE = "/updateGroupIsMuteNotify";

export default async (chatId: string, isMute: number) => {
    try {
        const isGroup = chatId.startsWith("g_");
        await chatModel.updateSessionByChatId(chatId, { isMute });
        chatModel.updateUnread(chatId);
        const response = await axios({
            url: isGroup ? GROUP_MUTE : SING_MUTE,
            method: "post",
            data: {
                chat_id: chatId,
                is_mute_notify: isMute ? 1 : 0,
            },
        }).catch((e) => {
            console.log("api method of conversation/setMute", e);
        });

        if (isSuccess(response as any)) {
            // await chatModel.updateSessionByChatId(chatId, { isMute });
            // chatModel.updateUnread(chatId);
            return true;
        }

        return false;
    } catch (error) {
        console.log("updateSingleIsMuteNotify", error);
    }
};
