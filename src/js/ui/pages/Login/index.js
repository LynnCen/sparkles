import React, { Component, Fragment } from "react";
import { observer, inject } from "mobx-react";
import { message } from "antd";
import jrQRCode from "jr-qrcode";
import { Button, Progress, Spin } from "antd";
import { ipcRenderer } from "electron";
import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { injectIntl, FormattedMessage } from "react-intl";
import Avatar from "../../components/Avatar";
import getScanCodeInfo, { initAfterLogin } from "@newSdk/service/api/login/getScanCodeInfo";
import avatarUtils from "@newSdk/utils/ImageSource";
import classes from "./style.less";
import getScanLoginCode from "@newSdk/service/api/login/getScanLoginCode";
import defaultAvatar from "../../../../assets/images/user-fallback.png";
import nc, { Event } from "@newSdk/notification/index";
import { requestMan } from "@newSdk/service/apiCore/createCancelToken";
import { isDev } from "@newSdk/config";
import classnames from "classnames";
import WSClient from "@newSdk/websocket_client/index";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { device } from "utils/tools";
import { base64Encode } from "utils/base64encode";
import Header from "../Header";
import add from "../../../../assets/images/nav_icon_tianjia.png";
import scan from "../../../../assets/images/nav_icon_scan.png";
@inject((stores) => ({
    shouldUseDarkColors: stores.Common.shouldUseDarkColors,
}))
@observer
class Login extends Component {
    code = [];
    ExpireTime = 2 * 50 * 1e3;
    loginTimer; // login rec
    qrCodeTimer; // qrcode refresh
    // noAccessLoginTimeout = {
    //     timer: null,
    //     isShouldReset: false,
    //     delayToastTimer: null,
    // }; // reconnection
    state = {
        qrCode: "",
        desc: "",
        isScan: false,
        cost: 0,
        loading: false,
        qrCodeInvalid: false,
        codeRefreshing: false,
    };
    isRequest = true; // isRequest
    dev_Autologin = 0;

    componentWillMount() {}

    componentDidMount() {
        ipcRenderer.send("do-login");
        // clean blink
        ipcRenderer.send("message-unread", { unreadList: [] });
        tmmUserInfo.resetUserInfo();
        WSClient.close();
        nc.on(Event.LoginSuccess, this.handleLoginSuccess);

        this.init();
    }

    componentWillUnmount() {
        this.clearTimer();
        nc.off(Event.LoginSuccess, this.handleLoginSuccess);
    }

    handleLoginSuccess = () => {
        this.clearTimer();
        this.setState({ loading: true });
        message.destroy();
    };

    init = async () => {
        this.desc = this.props.intl.formatMessage({ id: "ScanCodeLogin" }) + "PC-CHAT";
        await this.getCode();
        this.keepLogin();
        this.refreshQrCode();
    };

    clearTimer() {
        if (this.loginTimer) {
            clearInterval(this.loginTimer);
            this.loginTimer = null;
        }
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
        }
        if (this.qrCodeTimer) {
            clearTimeout(this.qrCodeTimer);
            this.qrCodeTimer = null;
        }
    }

    /**
     * @description get QR code
     * @return void
     */
    async getCode() {
        // is requesting
        const data = await getScanLoginCode();

        // code get fail
        if (!data) {
            // sleep 3s
            await new Promise((resolve) => setTimeout(resolve, 1000 * 3));
            return this.getCode();
        }
        if (data) {
            const qrCode = jrQRCode.getQrBase64(data.url_pre + base64Encode(data.value));

            this.code = data.value;
            this.ExpireTime = data.expire - Date.now();

            this.setState({
                isScan: false,
                cost: 0,
                desc: this.props.intl.formatMessage({
                    id: "ScanCodeLogin",
                }),
                qrCodeInvalid: false,
                codeRefreshing: false,
                qrCode,
            });
        }
    }

    /**
     * @description login status get by rec
     * @return void
     */
    async keepLogin() {
        if (this.loginTimer) clearInterval(this.loginTimer);

        this.loginTimer = setInterval(() => {
            try {
                this.login();
            } catch (e) {
                console.error(e);
            }
        }, 500);
    }

    /**
     * @description QR code refresh
     * @return void
     */
    async refreshQrCode() {
        const {
            intl: { formatMessage },
        } = this.props;

        if (this.qrCodeTimer) clearTimeout(this.qrCodeTimer);
        this.qrCodeTimer = setTimeout(() => {
            const { isScan } = this.state;
            message.error(formatMessage({ id: "expireCode" }));
            // 如果是已扫码 状态则刷新
            if (isScan) {
                this.resetLoginStatus();
            } else {
                this.setState({
                    cost: 0,
                    qrCodeInvalid: true,
                });

                requestMan.cancelAll();
                this.clearTimer();
            }
        }, this.ExpireTime);

        // process of next refresh
        if (this.progressTimer) clearInterval(this.progressTimer);
        this.progressTimer = setInterval(() => {
            this.setState({
                cost: this.state.cost + 1,
            });
        }, 1000);
    }

    async getAvatar(avatar) {
        this.setState({
            qrCode: defaultAvatar,
        });
        const path = await avatarUtils.downloadAvatar(avatar);
        if (path && this.state.isScan)
            this.setState({
                qrCode: path,
            });
    }

    resetLoginStatus = async () => {
        requestMan.cancelAll();
        this.clearTimer();
        this.init();
    };

    /**
     * @description login
     *  0：waiting scan code，
     *  1：scan code，
     *  2：auth for login，
     */
    async login() {
        try {
            const {
                intl: { formatMessage },
            } = this.props;
            // make sure the queue order
            if (!this.isRequest) return false;
            this.isRequest = false;

            // for develop
            if (isDev && this.dev_Autologin <= 1) {
                const token = sessionStorage.getItem("token");
                const userId = sessionStorage.getItem("userId");
                const phone_prefix = sessionStorage.getItem("phone_prefix");
                if (token && userId) {
                    this.dev_Autologin += 1;
                    const res = await initAfterLogin({ userId, token, phone_prefix });
                    return res && this.props.onlogin();
                }
            }
            // clear session before request
            sessionStorage.clear();

            const response = await getScanCodeInfo(this.code).catch(this.getCode.bind(this));
            switch (response.status) {
                case 2: // 登录成功
                    this.props.onlogin();
                    // 清除定时器
                    this.clearTimer();
                    // this.isRequest = true;
                    return false;
                case 1: // 已扫码
                    if (this.qrCodeTimer) clearInterval(this.qrCodeTimer);
                    if (this.progressTimer) clearInterval(this.progressTimer);

                    const { avatar, f_name = "", l_name = "" } = response;

                    const desc =
                        `${(f_name + " " + l_name).trim()} ` + formatMessage({ id: "ScannedCode" });
                    // show user avatar
                    if (!this.state.isScan) this.getAvatar(avatar);
                    this.setState({
                        isScan: true,
                        loading: false,
                        desc,
                    });
                    break;
                case 0: // 未扫码
                    this.setState({
                        isScan: false,
                        loading: false,
                    });
                    break;
            }

            await new Promise((resolve) => setTimeout(resolve, 500));
            this.isRequest = true;
        } catch (e) {
            this.isRequest = true;
            console.error(e);
        }
    }

    /**
     * @description
     */
    renderCode = () => {
        const { qrCode, isScan, loading, cost, qrCodeInvalid, codeRefreshing } = this.state;
        return (
            <div className={classes.inner}>
                {qrCode &&
                    (isScan ? (
                        <Fragment>
                            <Avatar size={140} src={qrCode} />
                            {loading && (
                                <aside style={{ transform: "translateY(16px)" }}>
                                    Loading... <Spin indicator={<LoadingOutlined />} />
                                </aside>
                            )}
                        </Fragment>
                    ) : (
                        <div>
                            <img className="disabledDrag" src={qrCode} />

                            {qrCodeInvalid ? (
                                <aside className={classes.mask}>
                                    <div
                                        className={classes.icon}
                                        onClick={() => {
                                            if (codeRefreshing) return;
                                            this.init();
                                            this.setState({ codeRefreshing: true });
                                        }}
                                    >
                                        {codeRefreshing ? (
                                            <Spin
                                                indicator={
                                                    <LoadingOutlined
                                                        style={{ fontSize: 24 }}
                                                        spin
                                                    />
                                                }
                                            />
                                        ) : (
                                            <ReloadOutlined className={classes.iconBody} />
                                        )}
                                    </div>
                                </aside>
                            ) : null}
                        </div>
                    ))}

                {!qrCode && <LoadingOutlined style={{ fontSize: 30, color: "#1890ff" }} />}

                {!isScan && (
                    <div
                        style={{
                            padding: "0 8px",
                            position: "relative",
                            top: -14,
                        }}
                    >
                        <Progress
                            strokeWidth={4}
                            strokeColor="#a2a8c3"
                            showInfo={false}
                            percent={cost * (100 / (this.ExpireTime / 1000))}
                        />
                    </div>
                )}
            </div>
        );
    };

    render() {
        const { loading, isScan, desc } = this.state;
        const {
            shouldUseDarkColors,
            intl: { formatMessage },
        } = this.props;
        return (
            <React.Fragment>
                <header className={classes.header}>
                    <Header />
                </header>
                <div
                    className={classnames({
                        [classes.container]: true,
                        [classes.dark]: shouldUseDarkColors,
                    })}
                >
                    {/* <div className={classes.drag} />

                {!device.isMac() && (
                    <Button
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            borderRadius: 0,
                        }}
                        type="primary"
                        danger
                        icon={<i className="icon-ion-android-close" />}
                        onClick={() => ipcRenderer.send("exit")}
                    />
                )} */}
                    <div className={classes.title}>
                        {formatMessage({ id: "pc_tmmtmm_desktop" })}
                    </div>
                    <div className={classes.subTitle}>
                        {formatMessage({ id: "pc_tmmtmm_welcome" })}
                    </div>

                    <div className={classes.wrapper}>
                        <article className={classes.left}>
                            <div className={classes.scanTitle}>
                                {formatMessage({ id: "pc_scan" })}
                            </div>
                            <div className={classes.step}>
                                {formatMessage({ id: "pc_scan_tip1" })}
                            </div>
                            <div className={classes.step}>
                                {formatMessage({ id: "pc_scan_tip2" })}
                                <img src={add} />
                                <img src={scan} />
                                {formatMessage({ id: "pc_scan_tip22" })}
                            </div>
                            <div className={classes.step}>
                                {formatMessage({ id: "pc_scan_tip3" })}
                            </div>
                        </article>
                        <article className={classes.right}>
                            <div className={classes.login_area}>{this.renderCode()}</div>
                            <p
                                style={isScan ? { color: "#32C872" } : null}
                                className={classes.desc}
                            >
                                {desc}
                            </p>
                            {/* <p className={classes.tips}>
                                <FormattedMessage id="NeedsYourMobilePhone" />
                            </p> */}
                            {!loading && isScan ? (
                                <p className={classes.cancel} onClick={this.resetLoginStatus}>
                                    <FormattedMessage id="cancelLogin" />
                                </p>
                            ) : null}
                        </article>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default injectIntl(Login);
