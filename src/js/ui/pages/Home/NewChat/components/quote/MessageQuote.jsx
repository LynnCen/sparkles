import React, { Component, useLayoutEffect, useState } from "react";
import { FormatDigest } from "../../../index";
import styles from "./styles.less";
import { inject, observer } from "mobx-react";
import { isGroup } from "@newSdk/utils";
import { checkCompressCache, checkOriginCache } from "utils/sn_utils";
import { ipcRenderer } from "../../../../../../platform";
import MainProcessIPCType, { LightBoxIPCType } from "../../../../../../../MainProcessIPCType";
import userInfoModel from "@newSdk/model/UserInfo";
import { shell } from "electron";
import { ROUTE_PATH } from "../../../../../routes";
import { MomentsTabEnum } from "../../../../Moments/constants/tabs";
import { getAppInfo } from "@newSdk/service/api/openplatform";
import common from "../../../../../stores_new/common";
import MessageType from "@newSdk/model/MessageType";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import ThemePopover from "components/Tmm_Ant/ThemePopover";
import { getNameWeight } from "utils/nameWeight";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
/**
 * @typedef { Object } IProps
 *
 * @property { Object } quotedMessage
 * @property { boolean } isMe
 * @property { boolean } showBg
 */
/**
 * @extends {React.Component<IProps>}
 */
const contentRef = React.createRef();
@inject((stores) => ({
    proxyUserBaseInfo: stores.UserProxyEntity.getUserInfo,
    proxyUserInfoInGroup: stores.UserProxyEntity.getUserInfoInGroup,
    getProxyUserInfoInGroup: stores.UserProxyEntity.getProxyUserInGroupInfo,
    getCompressImage: stores.DownloadCenter.getCompressImage,
}))
@observer
class MessageQuote extends Component {
    debounceTime = null;
    state = {
        content: "",
        showMore: false,
    };
    constructor(props) {
        super(props);

        if (props.quotedMessage) this.initial();
    }
    componentDidMount() {
        if (contentRef && contentRef.current.clientWidth < contentRef.current.scrollWidth) {
            this.setState({
                showMore: true,
            });
        }
    }
    initial = () => {
        const { quotedMessage, proxyUserBaseInfo, proxyUserInfoInGroup, isMe } = this.props;
        const text = <FormatDigest message={quotedMessage} atStyles={true} isMe={isMe} />;
        this.state = { content: text };

        //
        const { sender, chatId } = quotedMessage;

        proxyUserBaseInfo(sender);
        if (isGroup(chatId)) proxyUserInfoInGroup(sender, chatId);
    };

    handleImageMessage = async () => {
        try {
            if (this.debounceTime !== null) return;

            const {
                quotedMessage: { mid, chatId, content },
                getCompressImage,
            } = this.props;

            const { objectId, fileType, width, height } = content;

            let path = await checkOriginCache(objectId, fileType);
            if (!path) {
                path = await checkCompressCache({ path: objectId, height, width, type: fileType });
            }
            const src = await getCompressImage(
                content
                // (percent) => console.log(`per, ${percent}`)
            );
            ipcRenderer.send(LightBoxIPCType.createLightBox, {
                chatId,
                mid,
                previewTempLink: path || src,
                userInfo: userInfoModel,
            });

            this.debounceTime = setTimeout(() => {
                this.debounceTime = null;
            }, 600);
        } catch (e) {
            console.error(e);
        }
    };

    handleMediaMessage = async () => {
        try {
            const {
                quotedMessage: {
                    content: { objectId, fileType },
                },
            } = this.props;
            const path = await checkOriginCache(objectId, fileType);
            if (path) shell.openItem(path);
        } catch (e) {
            console.log(e);
        }
    };

    handleFileMessage = async () => {
        try {
            const {
                quotedMessage: {
                    content: { objectId, fileType },
                },
            } = this.props;

            const path = await checkOriginCache(objectId, fileType);
            if (path) shell.showItemInFolder(path);
        } catch (e) {
            console.error(e);
        }
    };

    handleMomentShareMessage = () => {
        const { intl } = this.props;
        //  2022/7/1 hdie moments
        return MessagePrompt.warn(localFormat({ id: "viewInThePhone" }));
        try {
            const {
                quotedMessage: {
                    content: { mid },
                },
            } = this.props;
            const { history } = this.props;
            // history.replace(ROUTE_PATH.MOMENTS_LIST.replace(":type", MomentsTabEnum.Trending));
            history.push(ROUTE_PATH.MOMENT_DETAIL.replace(":id", mid));
        } catch (e) {
            console.error(e);
        }
    };

    handleAppletMessage = async () => {
        const { quotedMessage } = this.props;
        const {
            content: { aid },
        } = quotedMessage;
        const [appInfo] = await getAppInfo([aid]);
        if (!appInfo || !appInfo.link_url) return;
        ipcRenderer.send(MainProcessIPCType.AppletIPCType.ShowMiniProgram, {
            appInfo,
            theme: common.shouldUseDarkColors,
        });
    };

    handleMessageClick = () => {
        const { quotedMessage } = this.props;
        if (!quotedMessage) return;

        const { type } = quotedMessage;

        const handleMap = {
            [MessageType.ImgMessage]: this.handleImageMessage,
            [MessageType.AttachmentMessage]: this.handleFileMessage,
            [MessageType.VideoMessage]: this.handleMediaMessage,
            [MessageType.AudioMessage]: this.handleMediaMessage,
            [MessageType.MomentShareMessage]: this.handleMomentShareMessage,
            [MessageType.MiniProgramMessage]: this.handleAppletMessage,
        };

        const handler = handleMap[type];
        if (handler) handler();
    };

    render() {
        const { getProxyUserInfoInGroup, quotedMessage, isMe = false, showBg = false } = this.props;
        if (!quotedMessage) return null;
        const { content, showMore } = this.state;
        const { type } = quotedMessage;
        const userInfo = getProxyUserInfoInGroup(quotedMessage.chatId, quotedMessage.sender);
        const showPopover =
            [MessageType.TextMessage, MessageType.AtMessage].includes(type) && showMore;
        const renderQuote = (
            <section
                className={classNames(styles.quoteWrap, {
                    [styles.me]: isMe,
                    [styles.ignoreBg]: !showBg,
                })}
            >
                <aside className={styles.userName}>
                    {getNameWeight({
                        friendAlias: userInfo.friendAlias,
                        alias: userInfo.alias,
                        name: userInfo.name,
                        uid: userInfo.uid,
                        status: userInfo.status,
                    })}
                </aside>
                <article
                    className={styles.content}
                    onClick={this.handleMessageClick}
                    ref={contentRef}
                >
                    {/* {content} */}
                    {<FormatDigest message={quotedMessage} atStyles={true} isMe={isMe} />}
                </article>
            </section>
        );
        return showPopover ? (
            <ThemePopover
                trigger={"click"}
                placement="bottom"
                content={
                    <div className={styles.popover}>
                        {<FormatDigest message={quotedMessage} isMe={isMe} />}
                    </div>
                }
                title={null}
                mouseEnterDelay={0.6}
                overlayStyle={{ borderRadius: "4px" }}
            >
                {renderQuote}
            </ThemePopover>
        ) : (
            renderQuote
        );
    }
}

// export { MessageQuote };
export default withRouter(MessageQuote);
