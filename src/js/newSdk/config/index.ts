// 透明人ID
export const NotificationAgentId = "33b1hvbe9lxf";

const environment = process.env.env;
export const isDev = environment === "development";
export const isTestEnv = environment !== "production";
const APP_CONFIG = (() => {
    switch (environment) {
        //prev
        // case "development":
        //     return {
        //         im_app: "http://ndev.imtmm.com:7004/",
        //         ws_app: "ws://ndev.imtmm.com:7005/",
        //         serve_app: "http://ndev.tmmtmm.com.tr:71/",
        //         moment: "http://ndev.imtmm.com:7102/",
        //         miniApp: "http://129.226.123.108:7106",
        //         payment: "http://129.226.123.108:7300/",
        //     };
        //current
        case "development":
            return {
                im_app: "https://dev-im-api.tmmtmm.com.tr:7100",
                ws_app: "wss://dev-im-tcp.tmmtmm.com.tr:7101",
                serve_app: "http://ndev.tmmtmm.com.tr:71/",
                moment: "https://dev-moments.tmmtmm.com.tr:7102",
                miniApp: "http://129.226.123.108:7106",
                payment: " https://dev-pay-api.tmmtmm.com.tr:7300",
            };
        //prev
        // case "test":
        //     return {
        //         im_app: "http://ndev.imtmm.com:7004/",
        //         ws_app: "ws://ndev.imtmm.com:7005/",
        //         serve_app: "http://ndev.tmmtmm.com.tr:71/",
        //         moment: "http://ndev.imtmm.com:7102/",
        //         miniApp: "http://129.226.123.108:7106",
        //         payment: "http://129.226.123.108:7300/",
        //     };
        //current
        case "test":
            return {
                im_app: "https://dev-im-api.tmmtmm.com.tr:7100",
                ws_app: "wss://dev-im-tcp.tmmtmm.com.tr:7101",
                serve_app: "http://ndev.tmmtmm.com.tr:71/",
                moment: "https://dev-moments.tmmtmm.com.tr:7102",
                miniApp: "http://129.226.123.108:7106",
                payment: " https://dev-pay-api.tmmtmm.com.tr:7300",
            };
        // return {
        //     im_app: "http://ntest.imtmm.com:8101/",
        //     ws_app: "ws://ntest.imtmm.com:8102/",
        //     serve_app: "http://ntest.tmmtmm.com.tr:81/",
        // };
        //prev
        // case "beta":
        //     return {
        //         im_app: "https://pre.imtmm.com:7100",
        //         ws_app: "wss://pre.imtmm.com:7101",
        //         serve_app: "https://preapi.tmmtmm.com.tr/",
        //         moment: "https://momentspre.tmmtmm.com.tr:7102/",
        //         miniApp: "https://oplpre.tmmtmm.com.tr:7106/",
        //         payment: "",
        //     };
        //current
        case "beta":
            return {
                im_app: "https://pre-im.tmmtmm.com.tr:6100",
                ws_app: "wss://pre-m-t.tmmtmm.com.tr:6101",
                serve_app: "https://preapi.tmmtmm.com.tr/",
                moment: "https://pre-mo.tmmtmm.com.tr:6102",
                miniApp: "https://oplpre.tmmtmm.com.tr:7106/",
                payment: "https://pre-pa.tmmtmm.com.tr:6300",
            };
        //prev
        // case "production":
        //     return {
        //         im_app: "https://v2.imtmm.com:5100/",
        //         ws_app: "wss://v2.imtmm.com:5101/",
        //         moment: "https://m.tmmtmm.com.tr:5102/",
        //         miniApp: "https://opl.tmmtmm.com.tr:5106/",
        //         payment: "https://apiv2.tmmpay.com:5300/",
        //         // ...
        //     };
        //current
        case "production":
            return {
                im_app: "https://im.tmmtmm.com.tr:5100",
                ws_app: "wss://im-t.tmmtmm.com.tr:5101",
                moment: "https://mo.tmmtmm.com.tr:5102",
                miniApp: "https://opl.tmmtmm.com.tr:5106/",
                payment: "https://pa.tmmtmm.com.tr:5300",
                // ...
            };
        default:
            throw new Error("invalid environment");
    }
})();

export default APP_CONFIG;
