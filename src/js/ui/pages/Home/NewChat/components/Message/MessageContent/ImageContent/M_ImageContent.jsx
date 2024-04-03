/**
 * @Author Pull
 * @Date 2021-06-04 19:35
 * @project M_ImageContent
 */
import React, { Component } from "react";
import styles from "./styles.less";
import stylesWithBg from "../M_VideoMessage/index.less";
import propTypes, { func } from "prop-types";
import { checkOriginCache } from "utils/sn_utils";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { renderMessageStatus } from "../../../../../index";
import { ipcRenderer } from "../../../../../../../../platform";
import userInfoModel from "@newSdk/model/UserInfo";
import { LightBoxIPCType } from "../../../../../../../../../MainProcessIPCType";
import ImageIcon, { supportEnumType } from "components/_N_ImageIcon/ImageIcon";

@inject((store) => ({
    messageList: store.NewChat.currentMessageList,
    getCompressImage: store.DownloadCenter.getCompressImage,
    getCacheKey: store.DownloadCenter.getCompressKey,
    downloadCenterCache: store.DownloadCenter.cacheCenter,

    forceSessionId: store.NewSession.focusSessionId,
    sessionStore: store.NewSession,
}))
@observer
class M_ImageContent extends Component {
    static propTypes = {
        // objectId: propTypes.string,
        // width: propTypes.number,
        // height: propTypes.number,
        // fileType: propTypes.string,
        extra: propTypes.any,
        isMe: propTypes.bool,
        mid: propTypes.string,
    };

    debounceTime = null;

    state = {
        src: "",
        width: "",
        height: "",
        visible: "",
        invalidSource: false,
    };

    componentDidMount() {
        this.setState({ downloading: true });
        this.initState();
    }

    initState = async () => {
        const { getCompressImage, content } = this.props;
        const path = await getCompressImage(
            content
            // (percent) => console.log(`per, ${percent}`)
        );
        this.setState({ downloading: false, src: path, invalidSource: !path });
    };

    previewImage = async (src) => {
        if (this.debounceTime !== null) return;
        const { content } = this.props;
        const { objectId, fileType } = content;
        const origin = await checkOriginCache(objectId, fileType);
        const { chatId, mid } = this.props;
        ipcRenderer.send(LightBoxIPCType.createLightBox, {
            chatId,
            mid,
            previewTempLink: origin || src,
            userInfo: userInfoModel,
        });

        this.debounceTime = setTimeout(() => {
            this.debounceTime = null;
        }, 600);
    };

    render() {
        const { src, invalidSource, downloading, initLoading } = this.state;
        const {
            preHeight,
            preWidth,
            isMe,
            extra,
            content,
            downloadCenterCache,
            getCacheKey,
            timeToShow,
            message,
            intl,
            status,
            shouldUseDarkColors,
        } = this.props;

        const key = getCacheKey(content);
        const cacheItem = downloadCenterCache.get(key);
        const displaySrc = (cacheItem && cacheItem.path) || src;
        const previewImg = {
            display: "inline-block",
            width: preWidth,
            height: preHeight,
        };
        return (
            <section
                className={classNames(styles.imgContainer, {
                    [styles.box]: invalidSource || downloading,
                    // [styles.loading]: downloading,
                    // [styles.error]: invalidSource,
                    // [styles.darkImageContainer]: shouldUseDarkColors,
                })}
                style={previewImg}
            >
                <div className={styles.wrap} onClick={() => this.previewImage(displaySrc)}>
                    {/* <ImageIcon enumType={supportEnumType.DOWNLOADING} overlayStyle={previewImg} /> */}

                    {downloading ? (
                        <ImageIcon
                            enumType={supportEnumType.DOWNLOADING}
                            overlayStyle={{
                                width: "48px ",
                                height: "48px ",
                                minWidth: "unset",
                                minHeight: "unset",
                            }}
                        />
                    ) : invalidSource ? (
                        <ImageIcon
                            enumType={supportEnumType.DOWNLOAD_FAIL}
                            overlayStyle={previewImg}
                        />
                    ) : (
                        <img
                            // draggable={false}
                            src={displaySrc}
                            alt=""
                            data-prew={preWidth}
                            data-preh={preHeight}
                            ref="img"
                            // onLoad={() => {
                            //     this.refs.img.style.height = "auto";
                            //     this.refs.img.style.width = "auto";
                            // }}
                            draggable="true"
                            style={previewImg}
                        />
                    )}
                    <div className={stylesWithBg.msgInfo}>
                        <div className={stylesWithBg.msgContent}>
                            <span className={stylesWithBg.msgLabel}>{timeToShow}</span>
                            {isMe && (
                                <span className={stylesWithBg.msgStatus} data-status={status}>
                                    {renderMessageStatus(message, intl.formatMessage)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default M_ImageContent;
