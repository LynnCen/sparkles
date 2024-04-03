import React, { Component } from "react";
import { Avatar } from "antd";
import classnames from "classnames";
import { ipcRenderer } from "../../../../../../../../platform";
import { MiniProIcon } from "../../../../../../../icons";
import { FormattedMessage } from "react-intl";
import { renderMessageStatus } from "../../../../../index";
import { getAppInfo } from "@newSdk/service/api/openplatform";
import { downloadToLocal } from "utils/downloadToLocal";

import styles from "./styles.less";
import { isExistFile } from "utils/fs_helper";
import MainProcessIPCType from "../../../../../../../../../MainProcessIPCType";
import common from "../../../../../../../stores_new/common";
import ImageIcon from "components/_N_ImageIcon/ImageIcon";

class Thirdpart extends Component {
    state = {
        code: "",
        expire: "",
        msg: {
            logoImg: "",
            cover: "",
            name: "",
            description: "",
        },
    };

    componentDidMount() {
        this.initMsg();
    }

    onClick = async () => {
        const { code, expire, msg } = this.state;

        let data = code;
        // if (!code || (expire && expire < Date.now())) {
        //     const { code: encryptCode, expire } = await getAesKey();
        //     data = encryptCode;
        //     this.setState({ code: encryptCode, expire });
        // }

        const { message } = this.props;
        const {
            content: { aid },
        } = message;
        const [appInfo] = await getAppInfo([aid]);
        if (!appInfo || !appInfo.link_url) return;
        ipcRenderer.send(MainProcessIPCType.AppletIPCType.ShowMiniProgram, {
            appInfo,
            theme: common.shouldUseDarkColors,
            // userInfo: UserInfo,
        });
    };

    initMsg = async () => {
        const { message } = this.props;
        const {
            content: { logo, icon },
        } = message;

        let logoImg, cover;

        try {
            logoImg = isExistFile(`${logo.objectId}.${logo.fileType}` || "");
            cover = isExistFile(`${icon.objectId}.${icon.fileType}` || "");
        } catch (e) {
            // console.log(e);
            [logoImg, cover] = await Promise.all([
                downloadToLocal(logo, "openplatform"),
                downloadToLocal(icon, "openplatform"),
            ]);
        }

        this.setState({ msg: { ...message.content, logoImg, cover } });
    };

    render() {
        const { isMe, timeToShow, message, intl } = this.props;
        const { logoImg, cover, name, description } = this.state.msg;
        return (
            <div className={classnames(styles.miniProContainer)} onClick={this.onClick}>
                <div className={styles.miniPro}>
                    <div className={styles.miniProHeader}>
                        <Avatar src={logoImg} />
                        <span className={styles.miniProHeader_name}>{name}</span>
                    </div>
                    <div className={styles.miniPro_desc}>{description}</div>
                    <div className={styles.miniProImg}>
                        {cover ? (
                            <img src={cover} />
                        ) : (
                            <ImageIcon enumType={ImageIcon.supportEnumType.TMMLogoIcon} />
                        )}
                    </div>
                </div>
                <div className={styles.miniPro_footer}>
                    <MiniProIcon />
                    <div>
                        <FormattedMessage id="string_im_miniPrograms" />
                    </div>
                    <div className={styles.miniPro_time}>{timeToShow}</div>
                    {isMe && (
                        <span className={styles.miniPro_time_status} data-status={status}>
                            {renderMessageStatus(message, intl.formatMessage)}
                        </span>
                    )}
                </div>
            </div>
        );
    }
}

export default Thirdpart;
