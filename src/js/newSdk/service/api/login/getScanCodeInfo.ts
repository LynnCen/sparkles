import axios from "@newSdk/service/apiCore/tmmNoTokenCore";
// import { aesAxios as axios } from "../../../../../app";
import WSClient from "@newSdk/websocket_client";
import { tmmBase } from "@newSdk/service/apiBase/tmmBase";
import Token from "@newSdk/model/Token";
import init from "@newSdk/model";
import allNets from "@newSdk/service/nets/Nets";
import { login as tmmSdkLogin } from "@newSdk/service/api";
import nc, { Event } from "@newSdk/notification";
import nodeOs from "os";
import APP_CONFIG from "@newSdk/config";
import allBase from "@newSdk/service/apiBase/allBase";
import tmmUserInfo from "@newSdk/model/UserInfo";

export const initAfterLogin = async ({
    userId,
    token,
    phone_prefix,
}: {
    userId: string;
    token: string;
    phone_prefix: string;
}) => {
    // init Db
    const isExist = await init(userId);

    // const res = await Token.setToken(tmmBase.baseUrl, token);
    // if (!res) return false;
    // allNets.getNetByBaseUrl(tmmBase.baseUrl).updateIs401(false);
    try {
        await Promise.all(
            allBase.map((api) => {
                Token.setToken(api, token);
            })
        );
        allBase.map((api) => {
            allNets.getNetByBaseUrl(api).updateIs401(false);
        });
    } catch (e) {
        return;
    }

    sessionStorage.setItem("userId", userId);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("phone_prefix", phone_prefix);

    // refresh me
    localStorage.setItem("me", userId);

    tmmUserInfo.setUserInfo({ _id: userId, phone_prefix });
    // init login process
    tmmSdkLogin({ _id: userId, phone_prefix } as any, !isExist);
    return true;
};

const login = (() => {
    let isRequest = false;

    return async (code: []) => {
        /*
        const uid = localStorage.getItem("me");
        // TODO: why uid
        if (uid && !isRequest) {
            // clean local token
            await Token.setToken(tmmBase.baseUrl, "");
            isRequest = true;
        }
        */
        try {
            const { data } = await axios({
                url: "/getScanQrCodeResV2",
                method: "post",
                headers: {
                    "device-name": nodeOs.hostname(),
                },
                data: {
                    code: code,
                },
            });
            if (data) {
                if (Number(data.status) !== 2) {
                    return data;
                }

                nc.publish(Event.LoginSuccess);

                const { token, id, phone_prefix } = data;
                // sessionStorage.setItem("refreshToken", refresh_token);
                isRequest = false;
                if (!token || !id) return { status: 0 };
                // init
                const res = await initAfterLogin({ userId: id, token, phone_prefix });
                if (!res) return { status: 0 };

                return { status: Number(data.status) };
            }
        } catch (e) {
            console.error(e);
            return { status: -1 };
        }
    };
})();

export default login;
