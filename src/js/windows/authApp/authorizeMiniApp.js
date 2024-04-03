import React, { Component } from "react";
import { Avatar, Button } from "antd";
import classNames from "classnames";
import { ipcRenderer, remote } from "../../platform";
import successIcon from "images/icons/successIcon.png";

import cx from "./auth.less";

class AuthorizeMiniApp extends Component {
    componentDidMount() {}

    sendAuthReq = () => {
        ipcRenderer.send("authorityMiniProgram");
    };

    hideAuthReq = () => remote.getCurrentWindow().hide();

    render() {
        const {
            appInfo: {
                content: { logoImg, name, description },
            },
            theme,
        } = remote.getGlobal("miniProgram");

        const userInfo = remote.getGlobal("userInfo");

        console.log(theme);
        return (
            <div
                className={classNames(cx["tmmtmm_auth_miniapp"], {
                    [cx["tmmtmm_dark"]]: theme,
                })}
            >
                <div className={cx["tmmtmm_auth_app"]}>
                    <img src={logoImg} />
                    <span className={cx["tmmtmm_auth_appname"]}>{name}</span>
                    <span className={cx["tmmtmm_auth_appapply"]}>Apply</span>
                </div>

                <div className={cx["tmmtmm_auth_appdesc"]}>{description}</div>

                <div className={cx["tmmtmm_auth_appmain"]}>
                    <Avatar src={userInfo.avatarPath} size={"large"} />
                    <div className={cx["tmmtmm_auth_userinfo"]}>
                        <div className={cx["tmmtmm_auth_username"]}>{userInfo.name}</div>
                        <div className={cx["tmmtmm_auth_userdesc"]}>{userInfo.signature}</div>
                    </div>
                    <img src={successIcon} />
                </div>

                <div className={cx["tmmtmm_auth_footerwrapper"]}>
                    <div className={cx["tmmtmm_auth_footer"]}>
                        <Button
                            shape={"round"}
                            style={{ background: "#DADCE7" }}
                            onClick={this.hideAuthReq}
                        >
                            Cancel
                        </Button>
                        <Button type={"primary"} shape={"round"} onClick={this.sendAuthReq}>
                            OK
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AuthorizeMiniApp;
