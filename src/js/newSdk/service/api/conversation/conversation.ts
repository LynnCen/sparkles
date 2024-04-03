import axios from "../../apiCore/tmmCore";
import { Switch } from "../../../model/types";

const SING_TOP = "/updateSingleIsTop";
const GROUP_TOP = "/updateGroupIsTop";
const SING_MUTE = "/updateSingleIsMuteNotify";
const GROUP_MUTE = "/updateGroupIsMuteNotify";

export const setGroupShowName = (chatId: string, isShow: Switch) =>
    axios({
        url: "/updateGroupIsShowName",
        method: "post",
        data: {
            chat_id: chatId,
            is_show_name: isShow,
        },
    });
