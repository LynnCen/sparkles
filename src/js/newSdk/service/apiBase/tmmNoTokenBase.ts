import pkg from "../../../../../package.json";
import os from "os";
import APP_CONFIG from "@newSdk/config";

class TmmNoTokenBase {
    baseUrl: string;
    lang: string;
    defaultErrorData: {};
    headerParams: {};

    constructor() {
        this.baseUrl = APP_CONFIG.im_app;
        // this.baseUrl = "http://ndev.imtmm.com:7004/";

        this.lang = (() => {
            const set = localStorage.getItem("settings");
            if (!set) return "";

            const settings = JSON.parse(set);
            const { locale } = settings;
            if (["zh-TW", "zh-CN"].includes(locale)) return "cn";
            return settings.locale || "";
        })();
        this.defaultErrorData = {
            data: {
                data: null,
                msg: "Network Error",
                code: 600,
            },
        };
        this.headerParams = {
            version: pkg.version,
            os: process.platform === "darwin" ? "mac" : "win",
            over: os.release(),
            "Content-Type": "application/json; charset=utf8",
            lang: this.lang || "en",
        };
    }
}

const tmmNoTokenBase = new TmmNoTokenBase();

export { tmmNoTokenBase };
