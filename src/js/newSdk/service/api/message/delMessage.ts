import axios from "@newSdk/service/apiCore/tmmCore";
import Message from "@newSdk/model/Message";
import messageModel from "@newSdk/model/Message";
import chatModel from "@newSdk/model/Chat";

const delMessage = async (ids: string[]) => {
    try {
        const res = await axios({ url: "/delMessage", method: "post", data: { ids } });
        // const message = await messageModel.getLastMessageOfSession(conversationId);
        await Message.setMessageDeleteFlag(ids);

        // if (message && ids.includes(message.mid)) {
        //     const newLastMsg = await messageModel.getLastMessageOfSession(conversationId);
        //
        //     chatModel.updateSessionById(conversationId, {
        //         lastMessage: newLastMsg,
        //         timestamp: newLastMsg?.timestamp,
        //     });
        // }
        // return res;
    } catch (e) {
        throw e;
    }
};

export default delMessage;
