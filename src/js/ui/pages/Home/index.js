import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import clazz from "classnames";
import { Popconfirm } from "antd";
import MessageStatus from "@newSdk/model/MessageStatus";
import NewSession from "./NewSession";
import NewChat from "./NewChat";
import tmmUserInfo from "@newSdk/model/UserInfo";
import {
    MessageErrorIcon,
    MessageReceivedIcon,
    MessageReadIcon,
    MessageSending,
} from "../../icons";
import { FormattedMessage } from "react-intl";
import classes from "./style.less";
import MessageType from "@newSdk/model/MessageType";
import UserInfo from "@newSdk/model/UserInfo";
import reSendMessage from "@newSdk/logic/reSendMessage";
import { parse_text } from "./NewChat/components/MessageInput/image_of_emoji/emoji_helper";
import { injectIntl } from "react-intl";
import { mapObj } from "./NewChat/components/Message/MessageContent/UnSupportContent/M_UnSupportMessage";
import tmmPayProxy from "./NewChat/components/OfficialServices/store/tmmPayProxy";
import getTransitionFormat from "./NewChat/components/OfficialServices/Transition+format";
import SpinWrap from "components/_N_SpinWrap/SpinWrap";
import TmmFileListModal from "components/TmmFileListModal/TmmFileListModal";
import ChatDragFile from "./ChatDragFile";
import TmmSessionBoard from "components/TmmSessionBoard/TmmSessionBoard";
import { isGroup } from "@newSdk/utils";
import formatMeetingMessage, {
    isVoiceCall,
} from "./NewChat/components/Message/MessageContent/_handler/formatMeetingMessage";
import { getNameWeight } from "utils/nameWeight";
import { AT_ALL, AT_CONTENT_U, AT_CONTENT_T } from "@newSdk/model/message/AtMessageContent";
@inject((stores) => ({
    showRedIcon: stores.settings.showRedIcon,
    unForceSession: stores.NewSession.unForceSession,
    loadSession: stores.NewSession.loadAllSession,
    initLastEmoji: stores.NewSession.initLastEmoji,
}))
@observer
class Home extends Component {
    state = {
        initStatus: false,
    };

    async componentDidMount() {
        // update Burn After Reading
        await this.props.loadSession();
        await this.props.initLastEmoji();
        // this.props.close();
        this.setState({
            initStatus: UserInfo.loading,
            dragging: false,
        });

        tmmPayProxy.addObservers();
    }

    componentWillUnmount() {
        tmmPayProxy.removeObserver();
    }

    render() {
        const {
            intl: { formatMessage },
        } = this.props;

        return (
            <Fragment>
                <div className={clazz(classes.container)}>
                    <div className={classes.left}>
                        <NewSession />
                    </div>
                    <div className={classes.right}>
                        <NewChat />
                        <ChatDragFile />
                    </div>
                </div>

                <TmmFileListModal />
                <TmmSessionBoard />
            </Fragment>
        );
    }
}

export const renderConversitionLogo = (message) => {
    const { status, type, chatId } = message;
    switch (status) {
        case MessageStatus.sending:
        case MessageStatus.awaitSend:
            return (
                <SpinWrap>
                    <MessageSending />
                </SpinWrap>
            );
        case MessageStatus.sendFail:
            return <MessageErrorIcon />;
    }
};

export const renderMessageStatus = (message = {}, formatMessage) => {
    const { status, type, chatId } = message;
    if (type === MessageType.IntlTemplateMessage) return "";
    switch (status) {
        case MessageStatus.sending:
        case MessageStatus.awaitSend:
            return (
                <SpinWrap>
                    <MessageSending />
                </SpinWrap>
            );
        case MessageStatus.read:
        case MessageStatus.sent:
            return <MessageReceivedIcon />;
        case MessageStatus.ACKRead:
            return chatId.startsWith("s_") ? <MessageReadIcon /> : <MessageReceivedIcon />;
        case MessageStatus.sendFail:
            return formatMessage ? (
                <Popconfirm
                    trigger={"hover"}
                    title={formatMessage({ id: "ReSend" })}
                    okText={formatMessage({ id: "ReSend" })}
                    placement={"leftBottom"}
                    onConfirm={(e) => {
                        e.stopPropagation();
                        reSendMessage(message);
                    }}
                    onCancel={(e) => {
                        e.stopPropagation();
                    }}
                    cancelText={formatMessage({ id: "Cancel" })}
                >
                    <span style={{ cursor: "pointer" }}>
                        <MessageErrorIcon />
                    </span>
                </Popconfirm>
            ) : (
                <MessageErrorIcon />
            );
        // case MessageStatus.read:
        //     return <MessageReadIcon />;
        default:
            return null;
    }
};
@inject((stores) => ({
    getProxyUserInfoInGroup: stores.UserProxyEntity.getProxyUserInGroupInfo,
    focusSessionId: stores.NewSession.focusSessionId,
    proxyUserInfoInGroup: stores.UserProxyEntity.getUserInfoInGroup,
    getUserInfo: stores.UserProxyEntity.getUserInfo,
}))
@observer
class FormatDigest_ extends Component {
    componentDidMount() {
        const { message, getUserInfo, proxyUserInfoInGroup } = this.props;
        const { type, content, chatId } = message;
        if (isGroup(chatId) && type == MessageType.AtMessage) {
            Array.from(content.items, (item) => {
                if (item.t == AT_CONTENT_U) {
                    getUserInfo(item.v);
                    proxyUserInfoInGroup(item.v, chatId);
                }
            });
        }
    }
    renderAtNode = () => {
        const {
            message,
            getProxyUserInfoInGroup,
            intl,
            atStyles,
            isMe,
            focusSessionId,
        } = this.props;

        const { content, chatId } = message;
        const { formatMessage } = intl;
        if (atStyles) {
            const atNode = Array.from(content.items, (item, index) => {
                let atValue = "";
                if (item.t == AT_CONTENT_U) {
                    atValue =
                        item.v == AT_ALL
                            ? formatMessage({ id: "AtMentionAll" })
                            : getNameWeight(getProxyUserInfoInGroup(focusSessionId, item.v));
                }
                return (
                    <span
                        style={{
                            margin: `${item.t == AT_CONTENT_U ? "0 1px" : "0"}`,
                            color: `${
                                item.t == AT_CONTENT_U ? `${isMe ? "#FFF" : "#00C6DB"}` : ""
                            }`,
                            opacity: `${item.t == AT_CONTENT_U ? `${isMe ? ".6" : ""}` : ""}`,
                        }}
                        ref="textContent"
                        key={index}
                    >
                        {item.t == AT_CONTENT_T ? parse_text(item.v || "") : ` @${atValue} `}
                    </span>
                );
            });
            return atNode;
        } else {
            let text = "";
            Array.from(content.items, (item) => {
                if (item.t == AT_CONTENT_U) {
                    text += ` @${
                        item.v == AT_ALL
                            ? formatMessage({ id: "AtMentionAll" })
                            : getNameWeight(getProxyUserInfoInGroup(chatId, item.v))
                    } `;
                } else {
                    text += item.v;
                }
            });
            return parse_text(text || "");
        }
    };

    render() {
        const {
            message,
            getProxyUserInfoInGroup,
            intl,
            atStyles,
            isMe,
            focusSessionId,
        } = this.props;

        const { type, content, chatId } = message;

        const { formatMessage } = intl;
        switch (type) {
            case MessageType.TextMessage:
                return parse_text(content.text || "");
            case MessageType.AtMessage:
                return this.renderAtNode();
            case MessageType.ImgMessage:
                return (
                    <Fragment>
                        [<FormattedMessage id="string_im_pic" />]
                    </Fragment>
                );
            case MessageType.AttachmentMessage:
                return (
                    <Fragment>
                        [<FormattedMessage id="string_im_file" />]
                    </Fragment>
                );
            case MessageType.VideoMessage:
                return (
                    <Fragment>
                        [<FormattedMessage id="string_im_video" />]
                    </Fragment>
                );
            case MessageType.AudioMessage:
                return (
                    <Fragment>
                        [<FormattedMessage id="string_im_voice" />]
                    </Fragment>
                );
            case MessageType.MiniProgramMessage:
                return (
                    <Fragment>
                        [<FormattedMessage id="string_im_miniPrograms" />] {content.name}
                    </Fragment>
                );
            case MessageType.MomentShareMessage:
                return (
                    <Fragment>
                        [<FormattedMessage id="from_moments" />] {content.name}
                    </Fragment>
                );
            case MessageType.TransactionMessage:
                const { cardBasicInfo = {} } = getTransitionFormat(message) || {};
                return `${cardBasicInfo.title || "TMMTMM Pay"}`;
            case MessageType.MeetingMessage: {
                const isCall = isVoiceCall(content);
                return isCall ? (
                    <FormattedMessage id="VoiceCallDigest" />
                ) : (
                    <FormattedMessage id="VideoCallDigest" />
                );
            }

            case MessageType.RTCMessage:
            case MessageType.RedBonusMessage:
            case MessageType.CoinMessage:
            case MessageType.RedBonusResultMessage:
                return (
                    mapObj[type] && (
                        <Fragment>
                            [<FormattedMessage id={mapObj[type]} />]
                        </Fragment>
                    )
                );
            // case MessageType.IntlTemplateMessage:
            // case MessageType.DeleteFlagMessage:
            //     return await formatIntlTemp(content, chatId);
            default:
                return (
                    <Fragment>
                        <FormattedMessage id="Unknown" />
                    </Fragment>
                );
        }
    }
}
export const FormatDigest = injectIntl(FormatDigest_);
export default injectIntl(Home);
