import parseMessage from "@newSdk/model/message/_utils_parseMessage";
import chatStore from "../../stores_new/chat";
import { Message } from "@newSdk/model/Message";
import { pickerStore } from "components/TmmPickerBoard/pickerStore";

export const forwardMessage = async (message: Message<any>) => {
    try {
        const { TabEnum } = pickerStore;
        const { Contacts, Recent, Groups } = TabEnum;

        pickerStore.open({
            initialTab: Recent,
            title: "ForwardMessage",
            supportTab: [
                {
                    type: Contacts,
                    title: "select_contact",
                },
                {
                    type: Recent,
                    title: "recent_chats",
                },
                {
                    type: Groups,
                    title: "select_group",
                },
            ],
            okText: "ok",
            resultHandler: async (_, chatIds = []) => {
                chatIds.forEach((chatId) => {
                    const _msg = parseMessage(message);
                    if (_msg && chatId) {
                        _msg.chatId = chatId;
                        chatStore.sendMessage(_msg);
                    }
                });
                return true;
            },
            forward: true,
        });
    } catch (e) {
        console.error(``, e);
    }
};

export default forwardMessage;
