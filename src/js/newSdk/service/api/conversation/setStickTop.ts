import axios from "@newSdk/service/apiCore/tmmCore";
import chatModel from "@newSdk/model/Chat";
import { isSuccess } from "@newSdk/utils/server_util";
const SING_TOP = "/updateSingleIsTop";
const GROUP_TOP = "/updateGroupIsTop";

export default async (chatId: string, isStick: number) => {
    const isGroup = chatId.startsWith("g_");
    await chatModel.updateSessionByChatId(chatId, {
        isTop: isStick,
        stickActionTime: Date.now(),
    });
    const response = await axios({
        url: isGroup ? GROUP_TOP : SING_TOP,
        method: "post",
        data: {
            chat_id: chatId,
            is_top: isStick ? 1 : 0,
        },
    }).catch((e) => {
        console.log("api method of conversation/setStickTop", e);
    });

    if (isSuccess(response as any)) {
        // await chatModel.updateSessionByChatId(chatId, {
        //     isTop: isStick,
        //     stickActionTime: Date.now(),
        // });
        return true;
    }

    return false;
};
