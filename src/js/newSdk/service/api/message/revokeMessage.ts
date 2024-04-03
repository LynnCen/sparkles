import axios from "@newSdk/service/apiCore/tmmCore";
import Message from "@newSdk/model/Message";
import { isSuccess } from "@newSdk/utils/server_util";

const revokeMessage = async (ids: string[], chat_id: string) => {
    try {
        const res = await axios({ url: "/revokeMessage", method: "post", data: { ids, chat_id } });
        if (isSuccess(res)) Message.setMessageDeleteFlag(ids);
    } catch (e) {
        // throw e;
        console.log(`------> catch error`, e);
    }
};

export default revokeMessage;
