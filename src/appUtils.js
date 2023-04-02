import React from "react";

// import axios from "axios";
// import { APP_CONFIG } from "../config";
// import Config from "./js/config";
// import qs from "querystring";
// import { log } from "./js/platform";
// const crypto = require("crypto");
// const encrypt_key = APP_CONFIG.encrypt_key;

// export const encrypt = function (data) {
//     let iv = crypto.randomBytes(16);
//     let cipher = crypto.createCipheriv("aes-128-cbc", encrypt_key, iv);
//     let crypted = cipher.update(data, "utf8", "binary");
//     crypted += cipher.final("binary");
//     let res = Buffer.concat([Buffer.from(iv, "binary"), Buffer.from(crypted, "binary")]);
//     return res.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
// };

// export const decrypt = function (str) {
//     str = str.replace(/-/g, "+").replace(/_/g, "/");
//     let len = str.length;
//     len = Math.ceil(len / 4) * 4; // the length after the padding
//     str = str.padEnd(len, "=");
//     let strBuff = Buffer.from(str, "base64");
//     let iv = strBuff.slice(0, 16);
//     let data = strBuff.slice(16);
//     let decipher = crypto.createDecipheriv("aes-128-cbc", encrypt_key, iv);
//     let decrypted = decipher.update(data);
//     decrypted += decipher.final("utf8");
//     return decrypted;
// };

// export const clearLoginSession = () => {
//     sessionStorage.clear();
// };

// export const aesAxios = axios.create({
//     baseURL: Config.V_SERVER,
//     timeout: 1e4,
//     reTry: 1,
// });
//
// // token 失效刷新标识
// let couldRefreshToken = false;
// // token 刷新请求中标识符
// let refreshing = false;
//
// aesAxios.interceptors.request.use(async (config) => {
//     if (!config.url.includes("login/token.json") && !refreshing) {
//         couldRefreshToken = true;
//     }
//     config.headers.os = Config.getWFCPlatform() === 4 ? "mac" : "win";
//     config.headers.version = "1";
//     config.headers.over = "1";
//     config.headers.lang = "en";
//
//     if (sessionStorage.getItem("apiToken")) {
//         config.headers.token = sessionStorage.getItem("apiToken");
//     } else {
//         // console.log(sessionStorage.getItem('apiToken'));
//     }
//     if (config.method.toUpperCase() === "GET") {
//         config.params = Object.assign(config.params || {}, { t: Date.now() });
//     }
//     if (config.method.toUpperCase() === "POST") {
//         try {
//             if (config.data) {
//                 if (process.env.NODE_ENV === "development") {
//                     console.log("postData : ", config);
//                 }
//
//                 const noEncrypt = config.data instanceof FormData;
//                 if (!noEncrypt) {
//                     config.data = qs.stringify({
//                         body: encrypt(qs.stringify(config.data)),
//                     });
//                 }
//             }
//         } catch (e) {
//             // console.error(e);
//         }
//     }
//
//     // token 刷新时，等待刷新完成
//     const pollingFinishRefresh = () =>
//         new Promise((resolve) => {
//             // const polling = (setInterval(() => {}, 25))
//             let timer = null;
//             void (function polling() {
//                 requestAnimationFrame(() => {
//                     console.log("poll refresh token did finish", refreshing);
//                     if (!refreshing) {
//                         cancelAnimationFrame(timer);
//                         resolve();
//                     } else polling();
//                 });
//             })();
//         });
//
//     // holding request, waiting fro token refreshed,
//     if (refreshing && !config.url.includes("login/token.json")) {
//         log("start：holding request, waiting fro token refreshed");
//         await pollingFinishRefresh();
//         log("end：holding request, waiting fro token refreshed");
//     }
//     return config;
// });
//
// aesAxios.interceptors.response.use(
//     async (res) => {
//         // 解密
//         try {
//             res.data = JSON.parse(decrypt(res.data));
//         } catch (e) {
//             console.error(e);
//         }
//
//         if (res.status !== 200) return Promise.reject(res);
//
//         const {
//             data: { code },
//             config,
//         } = res;
//
//         if (code === 200) return Promise.resolve(res);
//
//         // TOKEN 失效
//         if ([400002, 400003].includes(code) && couldRefreshToken) {
//             log("token invalid： to refresh");
//             couldRefreshToken = false;
//             // await refreshToken();
//         }
//
//         // 重连逻辑
//         config.__retryCount = config.__retryCount || 0;
//
//         // 连接失败 重试一次
//         if (config.__retryCount < config.reTry) {
//             config.__retryCount += 1;
//             const backoff = new Promise((resolve) => setTimeout(resolve, config.retryDelay || 1));
//             return backoff.then(() => aesAxios(config));
//         }
//
//         if (code === 400011) {
//             // token 失效
//             log("token invalid： no refresh token, conversation disconnected");
//             log(JSON.stringify(res));
//             clearLoginSession();
//             log("token invalid: token refreshing, lost response");
//         }
//
//         return res;
//
//         // throw new Error(msg);
//     },
//     (err) => {
//         if (process.env.NODE_ENV === "development") {
//             console.warn("retry request", err);
//         }
//         return Promise.reject(err);
//     }
// );
//
// // 扩展：： 终止请求操作
// aesAxios.getCancelToken = () => axios.CancelToken.source();
