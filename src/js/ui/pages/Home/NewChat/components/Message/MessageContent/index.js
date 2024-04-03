/**
 * @Author Pull
 * @Date 2021-05-24 13:50
 * @project index
 */
import React, { Component, Fragment } from "react";
import MessageType from "@newSdk/model/MessageType";
import propTypes from "prop-types";
import { injectIntl } from "react-intl";
import { inject, observer } from "mobx-react";
import ImageContent from "./ImageContent/M_ImageContent";
import TextContent from "./TextContent/M_TextContent";
import AudioMessage from "./AudioContent/M_AudioMessage";
import FileMessage from "./FileContent/M_FileMessage";
import VideoMsg from "./M_VideoMessage";
import { mapObj } from "./UnSupportContent/M_UnSupportMessage";
import CalcSize from "@newSdk/utils/ImageSource";
import Thirdpart from "./ThirdPartContent/M_thirdpart";
import MomentShareContent from "./MomentContent/M_MomentShare";
import formatMeetingMessage from "./_handler/formatMeetingMessage";
import { OutlineVoiceCall, OutlineVideoCall } from "../../../../../../icons";
import { getNameWeight } from "utils/nameWeight";
import { isGroup } from "@newSdk/utils";
import { AT_ALL, AT_CONTENT_U, AT_CONTENT_T } from "@newSdk/model/message/AtMessageContent";
let lastPlayer = null;
@inject((store) => ({
    shouldUseDarkColors: store.Common.shouldUseDarkColors,
    getProxyUserInfoInGroup: store.UserProxyEntity.getProxyUserInGroupInfo,
    focusSessionId: store.NewSession.focusSessionId,
    getUserInfo: store.UserProxyEntity.getUserInfo,
    proxyUserInfoInGroup: store.UserProxyEntity.getUserInfoInGroup,
}))
@observer
class MessageContent extends Component {
    static propTypes = {
        type: propTypes.number,
        content: propTypes.any,
        extra: propTypes.any,
        isMe: propTypes.bool,
        mid: propTypes.string,
    };
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

    state = {};

    regPlayer(el) {
        if (lastPlayer) lastPlayer.reset && lastPlayer.reset();
        lastPlayer = el;
    }

    render() {
        const {
            type,
            content,
            extra,
            isMe,
            intl,
            mid,
            chatId,
            timeToShow,
            message,
            getProxyUserInfoInGroup,
            focusSessionId,
        } = this.props;
        const { formatMessage } = intl;
        switch (type) {
            case MessageType.TextMessage:
                return (
                    <TextContent
                        message={message}
                        timeToShow={timeToShow}
                        isMe={isMe}
                        text={message.content.text}
                    />
                );
            case MessageType.AtMessage:
                const items = Array.from(content.items, (item) => {
                    if (item.t == AT_CONTENT_U) {
                        return {
                            t: item.t,
                            v:
                                item.v == AT_ALL
                                    ? formatMessage({ id: "AtMentionAll" })
                                    : getNameWeight(
                                          getProxyUserInfoInGroup(focusSessionId, item.v)
                                      ),
                        };
                    } else {
                        return { ...item };
                    }
                });

                return (
                    <TextContent
                        message={message}
                        timeToShow={timeToShow}
                        isMe={isMe}
                        text={message.content.text}
                        items={items}
                    />
                );
            case MessageType.ImgMessage:
                const { width, height } = CalcSize.setThumb(content.width, content.height);
                const { width: preWidth, height: preHeight } = CalcSize.preViewSize(
                    content.width,
                    content.height
                );

                return (
                    <ImageContent
                        content={content}
                        calWidth={width}
                        calHeight={height}
                        preWidth={preWidth}
                        preHeight={preHeight}
                        extra={extra}
                        isMe={isMe}
                        mid={mid}
                        chatId={chatId}
                        {...this.props}
                    />
                );
            case MessageType.AttachmentMessage:
                return <FileMessage content={content} isMe={isMe} {...this.props} />;
            case MessageType.AudioMessage:
                const duration = parseInt(`${content.duration / 1000}`, 10) || 0;
                return (
                    <AudioMessage
                        // text="audio/75/750d_8bf8_8570_944cddfa29e0daa4972d8f3cfca937dd"
                        // duration={105}
                        // type="mp3"
                        {...this.props}
                        isMe={isMe}
                        content={{
                            ...content,
                            duration,
                        }}
                        regPlayer={this.regPlayer}
                    />
                );
            case MessageType.MomentShareMessage:
                return (
                    <MomentShareContent
                        message={message}
                        intl={intl}
                        content={content}
                        timeToShow={timeToShow}
                        isMe={isMe}
                    />
                );
            case MessageType.VideoMessage:
                return <VideoMsg {...content} {...this.props} />;
            case MessageType.MiniProgramMessage:
                return <Thirdpart {...content} {...this.props} />;
            case MessageType.MeetingMessage: {
                const { isShowDuration, str, duration, isCall } = formatMeetingMessage(
                    message.content,
                    intl
                );
                return (
                    <Fragment>
                        <TextContent
                            message={message}
                            timeToShow={timeToShow}
                            isMe={isMe}
                            text={`${str}${isShowDuration ? " " + duration : ""}`}
                            extraNode={isCall ? <OutlineVoiceCall /> : <OutlineVideoCall />}
                        />
                    </Fragment>
                );
            }
            case MessageType.RTCMessage:
            case MessageType.RedBonusMessage:
            case MessageType.CoinMessage:
            case MessageType.RedBonusResultMessage:
                return (
                    <Fragment>
                        <TextContent
                            message={message}
                            timeToShow={timeToShow}
                            isMe={isMe}
                            text={`[${intl.messages[mapObj[type]]}]`}
                        />
                    </Fragment>
                );
            case MessageType.MeetingMessage: {
                const { isShowDuration, str, duration, isCall } = handleMeetingMsg(
                    message.content,
                    intl
                );
                return (
                    <Fragment>
                        <TextContent
                            message={message}
                            timeToShow={timeToShow}
                            isMe={isMe}
                            text={`${str}${isShowDuration ? " " + duration : ""}`}
                            extraNode={isCall ? <OutlineVoiceCall /> : <OutlineVideoCall />}
                        />
                    </Fragment>
                );
            }

            default:
                return (
                    <Fragment>
                        <TextContent
                            message={message}
                            timeToShow={timeToShow}
                            isMe={isMe}
                            text={intl.messages.Unknown}
                        />
                    </Fragment>
                );
            // return <FormattedMessage id="Unknown" />;
        }
    }
}

export default injectIntl(MessageContent);
