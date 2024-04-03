import UserInfoModel, { UserInfoProps, InitLoadingStatus } from "../../model/UserInfo";
import chatModel from "@newSdk/model/Chat";
import initFriendsCache from "../../logic/initScript/initFriendsCache";
import initAllChatsInfo from "../../logic/initScript/initAllChatsInfo";
import { dbVersion } from "@newSdk/model/config";
import { pull } from "@newSdk/service/api/PullMessage";
import groupChats from "@newSdk/utils/chat_with_group";
import clearAwaitSendMessage from "@newSdk/logic/clearAwaitSendMessage";
import nc, { Event } from "@newSdk/notification";
import getApplyList from "@newSdk/service/api/addFriends/getApplyList";
import initGroupCache from "@newSdk/logic/initScript/initGroupCache";
import messageModel from "@newSdk/model/Message";
import WSClient from "@newSdk/websocket_client";
import reportUnread from "@newSdk/logic/reportUnread";
import initPublicConfig from "@newSdk/logic/initScript/initPublicConfig";
import initOfficialAccount from "@newSdk/logic/initScript/initOfficialAccount";
import initCoinConfig from "@newSdk/logic/initScript/initCoinConfig";
import tmmUserInfo from "../../model/UserInfo";
import { initPercentChange } from "@newSdk/logic/initScript/firstInitLoadingPercent";
import { requestMan } from "@newSdk/service/apiCore/createCancelToken";
import initSessionConfig from "@newSdk/logic/initScript/initSessionConfig";
import { initSessionUnreadCount } from "@newSdk/logic/initScript/initConversations";

export default {};

export const getInitSequence = async () => {
    const getDBSeq = async () => await messageModel.getSequence();
    const seq: any = localStorage.getItem("cacheSequence");

    try {
        const info = JSON.parse(seq);
        const cacheSeq = info[tmmUserInfo._id];
        if (cacheSeq) return cacheSeq;
        else throw new Error("empty sequence, effect to catch");
    } catch (e) {
        const seq = await getDBSeq();
        localStorage.setItem("cacheSequence", JSON.stringify({ [tmmUserInfo._id]: seq }));
        return seq;
    }
};

const pubInitStatus = (status: number) => {
    UserInfoModel.loading = status;
    nc.publish(Event.TmmInit, status);
};

export const login = async (userInfo: UserInfoProps, isInit: boolean) => {
    try {
        // 第一次初始化数据库
        try {
            if (isInit) {
                pubInitStatus(InitLoadingStatus.LOADING);
                initPercentChange.resetStatus();
            }
            const p1 = initFriendsCache({ isInit: true, isSyncCurrent: true });
            const p2 = initPublicConfig().then(() => {
                if (isInit) {
                    initPercentChange.percentChange(initPercentChange.PercentRatioEnum.Intl);
                }
            });
            await Promise.all([p1, p2]);

            if (isInit) pubInitStatus(InitLoadingStatus.LOADED);
        } catch (e) {
            if (isInit) {
                requestMan.cancelAll();
                pubInitStatus(InitLoadingStatus.LOADING_FAIL);
                return false;
            }
        }

        try {
            initOfficialAccount();
            initCoinConfig();
        } catch (e) {
            console.error("-------------->>> pub fetch coin, official", e);
        }

        // sync remote message
        const sequence = await getInitSequence();

        await pull(sequence, true);
        await initSessionConfig();
        // const res = await pull(sequence, true);
        // // 拉取失败
        // if (!res) return;

        // init websocket
        const token = sessionStorage.getItem("token");
        if (token) WSClient.updateToken(token);

        // message resend
        clearAwaitSendMessage();

        // friendRequest
        getApplyList();

        // init session && init friends info
        // initFriendsCache();

        // refresh session cache
        initGroupCache();

        // init session config
        // const sessions = await chatModel.getSessionList();
        //
        // const { s, g } = groupChats(sessions);
        // if (s && s.length) {
        //     initAllChatsInfo(s, false);
        // }
        //
        // if (g && g.length) {
        //     await initAllChatsInfo(g, true);
        // }

        // await initSessionUnreadCount()

        // 初始化统计未读数
        reportUnread();
        pubInitStatus(InitLoadingStatus.DONE);
    } catch (e) {
        console.log("----->> init pro", e);
    }
    console.groupCollapsed("TmmTmm init info");
    console.info("dbVersion: ", dbVersion);
    console.info("initMember: ", userInfo._id);
    console.info(`
     ___
    (   )
     | |_      ___ .-. .-.    ___ .-. .-.
    (   __)   (   )   '   \\  (   )   '   \\
     | |       |  .-.  .-. ;  |  .-.  .-. ;
     | | ___   | |  | |  | |  | |  | |  | |
     | |(   )  | |  | |  | |  | |  | |  | |
     | | | |   | |  | |  | |  | |  | |  | |
     | ' | |   | |  | |  | |  | |  | |  | |
     ' \`-' ;   | |  | |  | |  | |  | |  | |
      \`.__.   (___)(___)(___)(___)(___)(___)

`);
    console.groupEnd();
};
