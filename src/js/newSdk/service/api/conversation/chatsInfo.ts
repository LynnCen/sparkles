import axios from "../../apiCore/tmmCore";

const SINGLE_API = "/getSingleConvSettings";
const GROUP_API = "/getGroupConvSettings";
const getChatSetting = (ids: string[], isGroup: boolean) => {
    return axios({
        url: isGroup ? GROUP_API : SINGLE_API,
        method: "post",
        data: {
            chat_id: ids,
        },
    });
};

export default getChatSetting;
