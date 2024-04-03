import pkg from "../../../../../package.json";
import os from "os";
import allNets from "@newSdk/service/nets/Nets";
import APP_CONFIG from "@newSdk/config";
class TmmBase {
    baseUrl: string;
    lang: string;
    defaultErrorData: {};
    headerParams: {};

    constructor(url: string) {
        this.baseUrl = url;
        // this.baseUrl = "http://ndev.imtmm.com:7004/";
        this.defaultErrorData = {
            data: {
                data: null,
                msg: "Network Error",
                code: 600,
            },
        };
        this.lang = this.getLang();
        this.headerParams = {
            version: pkg.version,
            os: process.platform === "darwin" ? "mac" : "win",
            over: os.release(),
            "Content-Type": "application/json; charset=utf8",
            lang: this.lang || "en",
        };
    }

    getLang() {
        const set = localStorage.getItem("settings");
        if (!set) return "";

        const settings = JSON.parse(set);
        const { locale } = settings;
        if (["zh-TW", "zh-CN"].includes(locale)) return "cn";
        return settings.locale || "";
    }

    getHeaderParams() {
        const { headerParams } = this;
        return {
            ...headerParams,
            lang: this.getLang(),
        };
    }

    setDelegate(delegate401: Function) {
        const net = allNets.getNetByBaseUrl(this.baseUrl);
        net.setDelegate(delegate401);
    }
}

const tmmBase = new TmmBase(APP_CONFIG.im_app);
const tmmMoment = new TmmBase(APP_CONFIG.moment);
const tmmOpenPlatform = new TmmBase(APP_CONFIG.miniApp);
const tmmPayment = new TmmBase(APP_CONFIG.payment);

export { tmmBase, tmmMoment, tmmOpenPlatform, tmmPayment };
