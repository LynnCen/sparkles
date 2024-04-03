import chatModel, { EventType, Session } from "@newSdk/model/Chat";
import groupChats from "@newSdk/utils/chat_with_group";
import initAllChatsInfo from "@newSdk/logic/initScript/initAllChatsInfo";
import getChatSetting from "@newSdk/service/api/conversation/chatsInfo";
import { hideSessionSyncInitConfig } from "@newSdk/logic/session/hideConversation_cmd";
import { arrayToHashTable, mergeObArray } from "@newSdk/utils";
import nc from "@newSdk/notification";

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

export const initSessionConfig = async () => {
    try {
        const sessions = await chatModel.getSessionList();
        const { s, g } = groupChats(sessions);
        const [
            {
                data: { items: singleSessionConfig },
            },
            {
                data: { items: groupSessionConfig },
            },
        ] = await Promise.all([getChatSetting(s, false), getChatSetting(g, true)]);

        const sessionConfigs: Setting[] = singleSessionConfig.concat(groupSessionConfig);

        // const hideConfig = sessionConfigs
        //     .filter((item) => !!item.hide_sequence)
        //     .map((item) => ({ chatId: item.chat_id, sequence: item.hide_sequence }));

        // const sessionHideConfigs = await hideSessionSyncInitConfig(hideConfig);

        const sessionMap = arrayToHashTable(sessions, "chatId");
        const sessionOtherConfigs = sessionConfigs.map(
            ({
                chat_id: chatId,
                is_top: isTop,
                is_mute_notify: isMute,
                hide_sequence: sequence,
            }: Setting) => {
                const item = sessionMap[chatId];

                const params = {
                    chatId,
                    isMute,
                    isTop,
                    hideInfo: {
                        i: -1,
                        seq: -1,
                    },
                };
                params.hideInfo = item.hideInfo || {};
                params.hideInfo.seq = sequence;
                // if (item) {
                //     const { i = 0, seq = 0 } = item.hideInfo || {};

                //     if (!i && seq <= sequence) {
                //         params.hideInfo = item.hideInfo || {};
                //         // @ts-ignore
                //         params.hideInfo.seq = sequence;
                //     }
                // }
                return { ...(item || {}), ...params };
            }
        );
        console.log(sessionOtherConfigs, ",sessionOtherConfigs");

        await chatModel.bulkPutSession(sessionOtherConfigs);
        // nc.publish(chatModel.Event.ChatChange, sessionOtherConfigs);
        // const singleConfig = await initAllChatsInfo(s, false);
        // const groupConfig = await initAllChatsInfo(g, true);
        // const sessionConfigs = singleConfig.co;
    } catch (e) {
        console.error(`----->>>`, e);
    }
};

export default initSessionConfig;
