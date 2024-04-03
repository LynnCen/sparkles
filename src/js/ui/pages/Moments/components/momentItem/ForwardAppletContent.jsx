/**
 * @Author Pull
 * @Date 2021-10-30 15:41
 * @project ForwardContent
 */
import React, { Component } from "react";
import styles from "./moments.module.less";
import classNames from "classnames/bind";
import { inject } from "mobx-react";
import Avatar from "components/Avatar";
import { MediaType } from "../../constants/media";
import { MiniProIcon } from "../../../../icons/index";
import localeFormat from "utils/localeFormat";
import ImageIcon, { supportEnumType } from "components/_N_ImageIcon/ImageIcon";
import { getAppInfo } from "@newSdk/service/api/openplatform";
import { ipcRenderer } from "electron";
import MessageType from "@newSdk/model/MessageType";
import common from "../../../../stores_new/common";
import tmmUserInfo from "@newSdk/model/UserInfo";
import MainProcessIPCType from "../../../../../../MainProcessIPCType";

const cx = classNames.bind(styles);
@inject(({ MediaDownloadProxy }) => ({
    proxyMediaSource: MediaDownloadProxy.addDownloadList,
    getProxyInfo: MediaDownloadProxy.getProxyInfo,
    tryFixDifferentFields: MediaDownloadProxy.tryFixDifferentFields,
}))
export class ForwardContent extends Component {
    componentDidMount() {
        const { appletInfo = {}, proxyMediaSource, tryFixDifferentFields } = this.props;
        const { icon, logo } = appletInfo;
        if (icon) proxyMediaSource(tryFixDifferentFields(icon, { mediaType: MediaType.Applet }));
        if (logo) proxyMediaSource(tryFixDifferentFields(logo, { mediaType: MediaType.Applet }));
    }

    renderMedia = (item) => {
        if (!item) return null;
        if (item.percent !== undefined)
            return (
                <ImageIcon
                    overlayStyle={{ width: 40, height: 40 }}
                    enumType={supportEnumType.DOWNLOADING}
                />
            );
        if (item.downloadFail)
            return (
                <ImageIcon
                    overlayStyle={{ width: 40, height: 40 }}
                    enumType={supportEnumType.DOWNLOAD_FAIL}
                />
            );

        if (item.localPath) return <img src={item.localPath} alt="" />;
        return null;
    };

    handleOpenApplet = async () => {
        const { appletInfo = {}, clickEffect = false } = this.props;

        const { aid } = appletInfo;

        const [appInfo] = await getAppInfo([aid]);

        // console.log(applet);
        ipcRenderer.send(MainProcessIPCType.AppletIPCType.ShowMiniProgram, {
            appInfo,
            theme: common.shouldUseDarkColors,
            // userInfo: tmmUserInfo,
        });
    };

    render() {
        const { appletInfo, getProxyInfo, tryFixDifferentFields, overlayStyle } = this.props;
        if (!appletInfo) return null;

        const { description, name, icon, logo } = appletInfo;

        const avatar = getProxyInfo(tryFixDifferentFields(logo, { mediaType: MediaType.Applet }));
        const poster = getProxyInfo(tryFixDifferentFields(icon, { mediaType: MediaType.Applet }));

        return (
            <section className={cx("forward-content", "applet", "dark-theme-bg_normal")}>
                <header className={cx("applet-header")}>
                    <Avatar src={avatar.localPath} size={16} />
                    <span className={cx("applet-name", "dark-theme-color_lighter")}>{name}</span>
                </header>

                <aside className={cx("applet-description", "dark-theme-color_grey")}>
                    {description}
                </aside>

                <article
                    className={cx("applet-poster")}
                    style={overlayStyle}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={this.handleOpenApplet}
                >
                    {this.renderMedia(poster)}
                </article>
                <footer className={cx("applet-footer")}>
                    <MiniProIcon />
                    <span className={cx("applet-title")}>
                        {localeFormat({ id: "string_im_miniPrograms" })}
                    </span>
                </footer>
            </section>
        );
    }
}

export default ForwardContent;
