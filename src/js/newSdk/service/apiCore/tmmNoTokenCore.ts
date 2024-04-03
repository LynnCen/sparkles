import axios from "axios";
import { tmmNoTokenBase } from "@newSdk/service/apiBase/tmmNoTokenBase";
import { requestMan } from "./createCancelToken";

const instance = axios.create({
    baseURL: tmmNoTokenBase.baseUrl,
    timeout: 1e4,
    headers: tmmNoTokenBase.headerParams,
});

instance.interceptors.request.use((config) => {
    // default token
    if (!config.cancelToken) {
        config.cancelToken = requestMan.getCancelToken();
    }
    return config;
});
instance.interceptors.response.use((response: any) => response.data);
export default instance;
