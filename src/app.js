/**
 * @Author Pull
 * @Date 2021-08-17 14:09
 * @project app
 */
import React, { Component } from "react";
import stores from "./js/ui/store";
import WSClient from "@newSdk/websocket_client";
import clearAwaitSendMessage from "@newSdk/logic/clearAwaitSendMessage";
import { ipcRenderer, remote } from "electron";
import { message, Modal } from "antd";
import { Provider } from "mobx-react";
import LanguageProvier from "components/LanguageProvier";
import { HashRouter } from "react-router-dom";
import getRoutes from "./js/ui/routes";
import CheckUpdateModal from "components/CheckUpdateModal";
import start from "@newSdk/service/api/start";
import { isDev } from "@newSdk/config";
// import "./global.css";
import nc, { Event } from "@newSdk/notification/index";
import "./assets/fonts/icomoon/style.css";
import localeFormat from "utils/localeFormat";
import "./global.theme.less";
import "./global.theme.css";
import { device } from "utils/tools";
import IPCType from "./MainProcessIPCType";
import initSessionConfig from "@newSdk/logic/initScript/initSessionConfig";
var sharedObj = remote.getGlobal("sharedObj");

export const Locales = sharedObj.Locales;

const UpdateStatus = {
    checking_update: 1,
    downloading: 2,
    download_success: 3,
    download_error: 4,
    latest_current: 5,
};

export default class App extends Component {
    state = {
        percent: 0,
        initCheck: false,
        show: true,
        options: {},
        forceUpdate: false,
        updateStatus: UpdateStatus.checking_update,
        labelUpdate: false,
    };

    componentWillMount() {
        this.willMountHandler();
    }

    async willMountHandler() {
        sessionStorage.removeItem("connected");
        if (window.navigator.onLine) {
            // 本地默认语言
            const settings = await stores.settings.init(sharedObj.localIntl);
            if (settings.locale !== sharedObj.localIntl) {
                ipcRenderer.send(IPCType.SettingIPCType.updateLocale, settings.locale);
            }
            sharedObj.localIntl = settings.locale;
        }
        // 监听网络连接断开
        window.addEventListener("online", async () => {
            console.log("online--------------------");
            WSClient.reconnection(); // need websocket reconnection
            clearAwaitSendMessage();
            // pull session
            await initSessionConfig();
        });

        window.addEventListener("offline", () => {
            console.log("offline");
        });
    }

    canisend() {
        return this.refs.navigator.history.location.pathname === "/" && stores.chat.user;
    }

    componentDidMount() {
        var navigator = this.refs.navigator;

        // When the system resume reconnet to WeChat
        ipcRenderer.on("os-resume", async () => console.log("os-resume" + new Date()));

        ipcRenderer.on("system-dialog-call", (event, args) => {
            Modal[args.type || "config"]({
                ...args,
                onOk: () => {
                    ipcRenderer.send(`system-dialog-call-ok-${args.cuName}`);
                },
                onCancel: () => {
                    ipcRenderer.send(`system-dialog-call-cancel-${args.cuName}`);
                },
            });
        });
        ipcRenderer.on("label-update", () => {
            this.setState({
                labelUpdate: true,
            });
        });
        ipcRenderer.on("download-progress", (e, progress) => {
            console.log("download-progress");
            const { show, options, percent, updateStatus } = this.state;
            if (percent > 0 && updateStatus === UpdateStatus.downloading) {
                return this.setState({
                    options: {
                        type: "downloading",
                        title: localeFormat({ id: "downloading" }),
                    },
                    percent: progress.percent,
                });
            }
            this.setState({
                show: true,
                options: {
                    type: "downloading",
                    title: localeFormat({ id: "downloading" }),
                },
                updateStatus: UpdateStatus.downloading,
                percent: progress.percent,
            });
        });

        ipcRenderer.on("update-download-error", (error, ...rest) => {
            console.log("update-download-error", error, rest);
            // const inited = this.state.initCheck;
            // this.setState({
            //     initCheck: true,
            //     updateStatus: UpdateStatus.download_error,
            // });
            // if (inited) message.error(localeFormat({ id: "networkError" }));
            this.setState({
                initCheck: true,
                show: true,
                options: {
                    type: "error",
                    title: localeFormat({ id: "pc_download_fail" }),
                },
                updateStatus: UpdateStatus.download_error,
                labelUpdate: false,
            });
        });

        ipcRenderer.on("check-update-begin", () => {
            console.log("check-update-begin");
            this.setState({
                updateStatus: UpdateStatus.checking_update,
                show: true,
                options: {
                    type: "loading",
                    title: localeFormat({ id: "checkUpdate" }),
                },
            });
        });

        ipcRenderer.on("update-not-available", (e, ...rest) => {
            console.log("update-not-available", rest);
            const inited = this.state.initCheck;
            // this.setState({
            //     initCheck: true,
            //     updateStatus: UpdateStatus.latest_current,
            //     show: false,
            // });
            this.setState({
                initCheck: true,
                show: true,
                options: {
                    type: "error",
                    title: localeFormat({ id: "pc_download_fail" }),
                },
                updateStatus: UpdateStatus.download_error,
                labelUpdate: false,
            });
            // if (inited) {
            //     Modal.info({
            //         content: localeFormat({ id: "alreadyLatest" }),
            //         maskClosable: true,
            //         okText: localeFormat({ id: "ConfirmTranslate" }),
            //     });
            // }
        });

        ipcRenderer.on("update-checking-done", () => {
            console.log("update-checking-done");
            if (this.state.show) {
                ipcRenderer.send("install");
            }
            this.setState({
                show: false,
                options: {},
                // forceUpdate: false,
                initCheck: true,
                updateStatus: UpdateStatus.download_success,
                labelUpdate: false,
            });
        });

        //proccess send
        nc.on("retry-update", () => {
            console.log("on------", "retry-update");
            this.initCheckingUpdate();
        });
        //main send
        ipcRenderer.on("update", () => {
            console.log("主进程发送检查更新");
            this.initCheckingUpdate();
        });
        this.initCheckingUpdate();
        document.body.setAttribute("data-device", process.platform);
    }

    async initCheckingUpdate() {
        // ready to checkForUpdate
        // encrypt_key !== "zxcvbnmasdfghjkl" &&
        this.setState({
            show: true,
            options: {
                type: "loading",
                title: localeFormat({ id: "checkUpdate" }),
            },
        });
        // if (!isDev) {
        await start().then((res) => {
            if (res.is_new_version === -1) {
                console.log("start-------", res);
                if (this.state.labelUpdate) message.info(localeFormat({ id: "alreadyLatest" }));
                // Modal.info({
                //     content: localeFormat({ id: "alreadyLatest" }),
                //     maskClosable: true,
                //     okText: localeFormat({ id: "ConfirmTranslate" }),
                // });
                return this.setState({
                    show: false,
                    initCheck: true,
                    updateStatus: UpdateStatus.latest_current,
                });
            } else if (res.is_new_version === 1) {
                this.setState({
                    show: true,
                    options: {
                        type: "version",
                        info: res,
                        // forceUpdate: ress.is_forced,
                        title: localeFormat({ id: "pc_new_version" }),
                    },
                    forceUpdate: res.is_forced,
                });
            } else {
                this.setState({
                    initCheck: true,
                    show: false,
                });
            }
            // let ress = {
            //     is_forced: 1,
            //     is_new_version: 1,
            //     logs: [
            //         { log: ["消息草稿", "会话置顶"], title: "七月" },
            //         { log: ["自动更新"], title: "八月" },
            //     ],
            //     upgrade_source: "http://129.226.123.108:8883/",
            //     version: "2.1.130",
            // };

            // show new version info
            // this.setState({
            //     show: true,
            //     options: {
            //         type: "version",
            //         info: res,
            //         // forceUpdate: ress.is_forced,
            //         title: localeFormat({ id: "pc_new_version" }),
            //     },
            //     forceUpdate: res.is_forced,
            // });
            // ipcRenderer.send("checkForUpdate", { upgrade_source });
            // timeout
            setTimeout(() => {
                const { updateStatus } = this.state;
                if (updateStatus === UpdateStatus.checking_update) {
                    this.setState({
                        initCheck: true,
                        updateStatus: UpdateStatus.download_error,
                    });
                }
            }, 15e3);
        });
        // } else {
        //     this.setState({ initCheck: true, updateStatus: UpdateStatus.latest_current });
        // }
    }
    handleCancle = () => {
        this.setState({
            show: false,
            initCheck: true,
        });
    };
    render() {
        // const local = settings.fixOldVersionIntlStr(sharedObj.localIntl)
        const { initCheck, updateStatus, percent, show, options, forceUpdate } = this.state;
        return (
            <Provider {...stores}>
                <LanguageProvier autoLocal={sharedObj.localIntl}>
                    {initCheck ? <HashRouter ref="navigator">{getRoutes()}</HashRouter> : null}
                    {/* {[UpdateStatus.checking_update, UpdateStatus.downloading].includes(
                        updateStatus
                    ) ? (
                        <CheckUpdateModal show={true} percent={this.state.percent} />
                    ) : null} */}
                    <CheckUpdateModal
                        show={show}
                        options={options}
                        percent={percent}
                        handleCancle={this.handleCancle}
                        forceUpdate={forceUpdate}
                    />
                </LanguageProvier>
            </Provider>
        );
    }
}
