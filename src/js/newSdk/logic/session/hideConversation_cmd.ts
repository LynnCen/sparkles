import sync_setting_hide from "@newSdk/websocket_client/model/sync_setting_hide";
import chatModel from "@newSdk/model/Chat";
import messageModel from "@newSdk/model/Message";
import { arrayToMap } from "@newSdk/utils";

export const hideSessionSyncCmd = async (info: sync_setting_hide) => {
    const {
        content: { chatId, sequence },
    } = info.data;

    if (!chatId || !sequence) return false;

    const session = await chatModel.getSessionById(chatId);

    if (!session) return;
    const { hideInfo: { i = 0, seq = 0 } = {} } = session;

    const hideConfig = await compare({
        localSeq: seq,
        sequence,
        chatId: chatId,
    });
    // if (seq >= sequence) return;
    // const maxSeq = await messageModel.getMaxSequenceByChatId(chatId);
    // if (sequence < maxSeq) return;
    // const { id } = (await messageModel.getMessageBySequence(sequence)) || { id: 0 };

    if (!hideConfig?.hideInfo) return;
    await chatModel.updateSessionByChatId(chatId, { hideInfo: hideConfig.hideInfo });
    console.log(await chatModel.getSessionById(chatId));
    console.log("success");
    return;
};

export const hideSessionSyncInitConfig = async (
    hideInfoList: Array<{ chatId: string; sequence: number }>
) => {
    const chats = hideInfoList.map((item) => item.chatId);
    const seqMap = arrayToMap(hideInfoList, "chatId");

    const sessions = await chatModel.getSessionByIds(chats);

    const configs = await Promise.all(
        sessions.map(async (session) => {
            const { hideInfo: { i = 0, seq = 0 } = {}, chatId } = session;
            const sequence = seqMap.get(chatId);

            const hideConfig = await compare({
                localSeq: seq,
                sequence,
                chatId,
            });

            if (!hideConfig) return false;
            return {
                hideInfo: hideConfig.hideInfo,
                chatId,
            };
        })
    );

    return configs.filter(Boolean);
};

interface CompareProps {
    localSeq: number;
    sequence: number;
    chatId: string;
}
const compare = async (info: CompareProps) => {
    const { localSeq, sequence, chatId } = info;

    if (localSeq >= sequence) return;
    const maxSeq = await messageModel.getMaxSequenceByChatId(chatId);
    if (sequence < maxSeq) return;
    const { id } = (await messageModel.getMessageBySequence(sequence)) || { id: 0 };

    return {
        hideInfo: { seq: sequence, i: id || 0 },
        chatId,
    };
};
// export const handle

export default hideSessionSyncCmd;
