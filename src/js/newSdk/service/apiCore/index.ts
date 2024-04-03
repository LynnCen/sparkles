import { tmmBase } from "@newSdk/service/apiBase/tmmBase";
import { Net } from "@newSdk/service/nets/Net";
import allNets from "@newSdk/service/nets/Nets";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { CANCEL_MESSAGE_FLAG, requestMan } from "./createCancelToken";
import { closeDb } from "@newSdk/model";
import { message } from "antd";
import localeFormat from "utils/localeFormat";
import WSClient from "@newSdk/websocket_client";
import APP_CONFIG from "@newSdk/config";
import { curry } from "lodash";
import { ResponseItems } from "@newSdk/model/types";

export const handle401 = (netInfo: Net) => {
    if (netInfo.is401) return;
    netInfo.updateIs401(true);
    WSClient.close();
    closeDb();
    typeof netInfo.delegate401 === "function" && netInfo.delegate401();
};

interface IAxiosResponse extends AxiosResponse {
    code: number;
}

const newRequest = async (baseUrl: string, config: AxiosRequestConfig): Promise<IAxiosResponse> => {
    const netInfo = allNets.getNetByBaseUrl(baseUrl);
    // is401
    if (netInfo.is401) {
        // true 异步返回错误
        return Promise.reject(false);
    }
    // is 401 false 拿取之前的token
    const token = await netInfo.getNetToken();

    // 如果token为空
    if (!token) {
        // 处理401， 异步返回错误
        handle401(netInfo);
        return Promise.reject(false);
    }

    // token 带入请求， 发起请求
    const headers = { ...tmmBase.getHeaderParams(), token };
    const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 1000 * 120,
        headers: headers,
    });

    axiosInstance.interceptors.request.use((config) => {
        // default token
        if (!config.cancelToken) {
            config.cancelToken = requestMan.getCancelToken();
        }
        return config;
    });

    axiosInstance.interceptors.response.use(async (response) => {
        const { code } = response.data;

        // TOKEN 失效
        if ([400002, 400003, 400005].includes(code)) {
            netInfo.updateIs401(false);
        }

        // 401 Unauthorized
        if (code !== 401) {
            // 清除401
            netInfo.updateIs401(false);
        }

        if (code === 401) {
            // 比较token
            const tokenNow = await netInfo.getNetToken();
            if (token !== tokenNow) {
                // 返回错误
                return Promise.reject(response.data);
            }

            // token相等, 处理401
            handle401(netInfo);
        }

        return response.data;
    });

    try {
        return (await axiosInstance(config)) as IAxiosResponse;
    } catch (e) {
        if (e?.message !== CANCEL_MESSAGE_FLAG) {
            intervalTip(localeFormat({ id: "networkError" }));
        }

        return Promise.reject(e);
    }
};

const intervalTip = (() => {
    const interval = 3e3;
    let flag = false;

    return (msg: string) => {
        if (flag) return;
        flag = true;
        message.error(msg);
        setTimeout(() => (flag = false), interval);
    };
})();

const { im_app, moment, miniApp, payment } = APP_CONFIG;

const createRequest = curry(newRequest);
const imClient = createRequest(im_app);
const momentClient = createRequest(moment);
const miniAppClient = createRequest(miniApp);
const paymentClient = createRequest(payment);

export async function imAxios<T = any>(
    params: AxiosRequestConfig
): Promise<AxiosResponse<ResponseItems<T>>> {
    return imClient(params);
}

export async function momentAxios(params: AxiosRequestConfig) {
    return momentClient(params);
}
export async function miniAppAxios(params: AxiosRequestConfig) {
    return miniAppClient(params);
}
export async function tmmPaymentAxios<T>(
    params: AxiosRequestConfig
): Promise<AxiosResponse<ResponseItems<T>>> {
    return paymentClient(params);
}
