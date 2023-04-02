import path from "path";
import os from "os";

// 手动配置项
// const bit = 32;
const bit = 64;
const isTest = true;
// const isTest = false;

export const useNewSdk = true;

const config = {
    server: {
        port: process.env.PORT || 3000,
        host: "localhost",
    },

    client: {
        main: path.resolve(__dirname, "../src"),
        lightBox: path.resolve(__dirname, "../src/lightlyWindow/LightBox"),
    },
    assets: path.resolve(__dirname, "../src/assets"),
    dist: path.resolve(__dirname, "../dist"),
    root: path.resolve(__dirname, "../"),
};
/*
export const APP_CONFIG = {
    encrypt_key: isTest /!* || process.env.NODE_ENV === "development" *!/
        ? "zxcvbnmasdfghjkl"
        : os.platform() === "darwin"
        ? "7ChWsdj3S6M2HNgF"
        : "onUznqjw8SYRhLuH",
    app_server: isTest /!* || process.env.NODE_ENV === "development" *!/
        ? // ? "http://148.70.15.154:80/"
          "http://imdev.imtmm.com/"
        : "http://im.imtmm.com/",
    v_server: isTest /!* || process.env.NODE_ENV === "development" *!/
        ? "http://129.226.123.108:81/"
        : "https://api.tmmtmm.com.tr/",
    bit,
};*/
export default config;
