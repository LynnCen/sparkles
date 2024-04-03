import React, { Component, Fragment } from "react";
import clazz from "classnames";
import { Badge } from "antd";
import Avatar from "components/Avatar";
import moment from "moment";
import { FormattedMessage, injectIntl } from "react-intl";
import { inject } from "mobx-react";
import MessageType from "@newSdk/model/MessageType";
import { renderMessageStatus, renderConversitionLogo } from "../index";
import defaultAvatar from "images/user-fallback.png";
import { popMenu } from "../../../../platform";
import muteImg from "images/icons/mute.png";
import atImg from "images/icons/at.png";
import { formatDateTime } from "utils/district_helper";
import { parse_text } from "../NewChat/components/MessageInput/image_of_emoji/emoji_helper";
import setStickTop from "@newSdk/service/api/conversation/setStickTop";
import setMute from "@newSdk/service/api/conversation/setMute";
import { FormatDigest } from "../index";
import chatModel from "@newSdk/model/Chat";
import UserInfoModel from "@newSdk/model/UserInfo";
import IntlTemplateComponent from "../NewChat/components/Notification/IntlTemplateFormat";
import classes from "./style.less";
import { isGroup, isMyFriend } from "@newSdk/utils";
import SessionInfoProxy from "../../../stores_new/sessionInfoProxy";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { NotificationAgentId } from "@newSdk/index";
import { sendMsgWithDrag } from "utils/file/sendDropFile";
import MessageStatus from "@newSdk/model/MessageStatus";
import { getNameWeight } from "utils/nameWeight";
import { TYPE_AT_ME, TYPE_AT_ALL } from "@newSdk/model/message/AtMessageContent";
import { fileModalStore } from "components/TmmFileListModal/fileModalStore";
@inject((stores) => ({
    locale: stores && stores.settings && stores.settings.locale,
    deleteSession: stores.NewSession.deleteSession,
    selectSession: stores.NewSession.selectSession,
    focusSessionId: stores.NewSession.focusSessionId,
    formatIntlTemp: stores.FormatIntlTemp.getIntlContent,
    formatAbleType: stores.FormatIntlTemp.formatAbleType,

    getSessionInfo: stores.SessionInfoProxy.getSessionInfo,
    sessionInfoProxy: stores.SessionInfoProxy.sessionInfoProxy,

    proxyUserBaseInfo: stores.UserProxyEntity.getUserInfo,
    proxyUserInfoInGroup: stores.UserProxyEntity.getUserInfoInGroup,
    getProxyUserInfoInGroup: stores.UserProxyEntity.getProxyUserInGroupInfo,
}))
class ConversationItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionInfo: { avatarPath: defaultAvatar },
            member: {},
            digest: "",
            dragForce: false,
        };
    }

    componentDidMount() {
        const {
            getSessionInfo,
            conversationInfo = {},
            proxyUserBaseInfo,
            proxyUserInfoInGroup,
        } = this.props;
        getSessionInfo(conversationInfo.chatId);

        const { lastMessage } = conversationInfo;
        if (this.isShowNamePrefix(lastMessage) && !this.isMySend()) {
            proxyUserBaseInfo(lastMessage.sender);

            if (isGroup(lastMessage.chatId))
                proxyUserInfoInGroup(lastMessage.sender, lastMessage.chatId);
        }
    }

    isShowNamePrefix(msg) {
        return (
            msg &&
            msg.chatId &&
            msg.sender &&
            isGroup(msg.chatId) &&
            ![NotificationAgentId].includes(msg.sender)
        );
    }

    isMySend(msg) {
        return msg && msg.sender && tmmUserInfo._id === msg.sender;
    }

    // componentDidMount() {
    //     this.getFormatDigest();
    // }
    //
    // getSnapshotBeforeUpdate(prevProps, prevState) {
    //     try {
    //         if (
    //             prevProps.conversationInfo.lastMessage !== this.props.conversationInfo.lastMessage
    //         ) {
    //             return { reset: true };
    //         } else return { reset: false };
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }
    //
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (snapshot.reset) {
    //         this.getFormatDigest();
    //     }
    // }
    //
    // async getFormatDigest() {
    //     const { conversationInfo = {} } = this.props;
    //     const { lastMessage } = conversationInfo;
    //     if (!lastMessage) return "";
    //     const digest = await formatDigest(lastMessage);
    //     this.setState({ digest });
    // }

    showContextMenu(conversationInfo, menuId) {
        const { formatMessage } = this.props.intl;
        const { isTop, isMute, chatId } = conversationInfo;
        let templates = [
            {
                label: formatMessage({ id: "Hide" }),
                click: async () => {
                    await this.props.deleteSession(chatId);
                },
                key: "Hide",
            },
            {
                label: isTop
                    ? formatMessage({ id: "Unsticky" })
                    : formatMessage({ id: "StickyOnTop" }),
                click: () => setStickTop(chatId, isTop ? 0 : 1),
                key: "sticky",
            },
            {
                label: isMute ? formatMessage({ id: "unMute" }) : formatMessage({ id: "Mute" }),
                click: () => setMute(chatId, isMute ? 0 : 1),
                key: "mute",
            },
        ];
        // if (isGroup(conversationInfo.chatId)) {
        //     templates.push({
        //         label: isMute ? formatMessage({ id: "unMute" }) : formatMessage({ id: "Mute" }),
        //         click: () => setMute(chatId, isMute ? 0 : 1),
        //         key: "mute",
        //     });
        // }
        /* const ReadAction = {
            label: formatMessage({ id: "MarkAsRead" }),
            click: () => {
                this.props.markedRead(conversationInfo);
            },
            key: "read",
        };*/
        return popMenu(templates, conversationInfo, menuId);
    }

    composeSessionInfo() {
        const { conversationInfo: sess = {}, sessionInfoProxy } = this.props;
        const info = sessionInfoProxy(sess.chatId);
        return { ...sess, ...info };
    }

    renderTime = () => {
        const { locale } = this.props;

        const conversationInfo = this.composeSessionInfo();
        const { lastMessage = {} } = conversationInfo;

        const isMe = lastMessage.sender === sessionStorage.getItem("userId");
        const timeToShow =
            conversationInfo.timestamp || (isMe ? lastMessage.timestamp : lastMessage.sendTime);
        const isSameDay = moment(timeToShow).isSame(moment.now(), "day");
        const isSameWeek = moment(timeToShow).isSame(moment.now(), "week");
        const lastDay = moment(timeToShow).isBetween(
            moment().subtract(1, "d").format("YYYY-MM-DD 00:00:00"),
            moment().subtract(1, "d").format("YYYY-MM-DD 23:59:59")
        );

        return isSameDay
            ? moment(timeToShow).format(formatDateTime(locale, true))
            : isSameWeek
            ? lastDay
                ? moment(timeToShow).calendar()
                : moment(timeToShow).format("ddd")
            : moment(timeToShow).format("LL");
    };
    isAtMes(at) {
        return at == TYPE_AT_ME || at == TYPE_AT_ALL || at == (TYPE_AT_ME | TYPE_AT_ALL);
    }
    renderIcon = (conversationInfo) => {
        const {
            lastMessage = {},
            isMute = false,
            isTop,
            unreadCount,
            chatId,
            at,
            isFriend,
        } = conversationInfo;
        const { status } = lastMessage;
        if (
            lastMessage.sender === UserInfoModel._id &&
            [MessageStatus.sending, MessageStatus.awaitSend, MessageStatus.sendFail].includes(
                status
            )
        ) {
            return renderConversitionLogo(lastMessage);
        } else if (unreadCount) {
            return (
                <Badge
                    count={unreadCount}
                    style={{ backgroundColor: `${isMute ? "#DADCE7" : "#FE4343"}` }}
                />
            );
        } else if (isMute) {
            return <img style={{ width: 14, height: 14, objectFit: "contain" }} src={muteImg} />;
        } else {
            return (
                <span className={classes.tips}>
                    {lastMessage.sender === UserInfoModel._id
                        ? renderMessageStatus(lastMessage)
                        : null}
                </span>
            );
        }
    };
    render() {
        const { focusSessionId, formatAbleType, getProxyUserInfoInGroup, intl } = this.props;
        const { dragForce } = this.state;

        const conversationInfo = this.composeSessionInfo();
        const {
            lastMessage = {},
            isMute = false,
            isTop,
            unreadCount,
            chatId,
            at,
            isFriend,
            draft,
        } = conversationInfo;

        const isMe = lastMessage.sender === sessionStorage.getItem("userId");

        const atType = this.isAtMes(at);
        const timeToShow =
            conversationInfo.timestamp || (isMe ? lastMessage.timestamp : lastMessage.sendTime);

        let namePrefix = "";
        if (this.isShowNamePrefix(lastMessage)) {
            if (this.isMySend(lastMessage)) {
                namePrefix += `${intl.formatMessage({ id: "string_your" })}: `;
            } else {
                const info = getProxyUserInfoInGroup(lastMessage.chatId, lastMessage.sender);
                const name = getNameWeight({
                    name: info.name,
                    friendAlias: info.friendAlias,
                    alias: info.alias,
                    uid: info.uid,
                    status: info.status,
                });

                if (name) namePrefix += `${name}: `;
            }
        }
        const name = getNameWeight({
            name: conversationInfo.name,
            friendAlias: conversationInfo.friendAlias,
            status: conversationInfo.status,
        });
        //Judge whether you are my friend
        return !isGroup(conversationInfo.chatId) && !isMyFriend(isFriend) ? null : (
            <div
                className={clazz(classes.item, {
                    [classes.sticky]: isTop,
                    [classes.active]: focusSessionId === conversationInfo.chatId,
                    [classes.dragover]: dragForce,
                })}
                data-avatarpath={conversationInfo.avatarPath}
                data-conversationkey={conversationInfo.chatId}
            >
                <div
                    // TODO key should be conversation
                    onContextMenu={(ev) => this.showContextMenu(conversationInfo)}
                    onDragEnter={(e) => {
                        this.setState({ dragForce: true });
                    }}
                    onDragLeaveCapture={() => {
                        this.setState({ dragForce: false });
                    }}
                    onDrop={(e) => {
                        sendMsgWithDrag({
                            chatId: conversationInfo.chatId,
                            files: e.dataTransfer.files,
                        });
                        this.setState({ dragForce: false });
                        this.props.selectSession(conversationInfo.chatId);
                    }}
                    onClick={(ev) => this.props.selectSession(conversationInfo.chatId)}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        zIndex: 10,
                        width: "100%",
                        height: "100%",
                    }}
                />
                <Avatar size={36} src={conversationInfo.avatar} />
                <div className={classes.info}>
                    <div style={{ transform: "translateY(2px)" }}>
                        <p className={classes.username}>{name}</p>
                        {timeToShow ? (
                            <span className={classes.times}>
                                {[MessageStatus.sending, MessageStatus.awaitSend].includes(
                                    lastMessage.status
                                )
                                    ? intl.formatMessage({ id: "Sending" })
                                    : this.renderTime()}
                            </span>
                        ) : null}
                    </div>
                    <div className={classes.bottom}>
                        <span className={classes.message}>
                            {draft ? (
                                <Fragment>
                                    <span className={classes.draft}>
                                        {intl.formatMessage({ id: "chat_draft" })}:
                                    </span>
                                    <FormatDigest message={draft} />
                                </Fragment>
                            ) : (
                                lastMessage.type && (
                                    <Fragment>
                                        <span className={classes.messageSender}>{namePrefix}</span>
                                        {formatAbleType.includes(lastMessage.type) ? (
                                            <IntlTemplateComponent message={lastMessage} />
                                        ) : (
                                            <FormatDigest message={lastMessage} />
                                        )}
                                    </Fragment>
                                )
                            )}
                        </span>
                        <span>
                            {/* at */}
                            {atType && unreadCount ? (
                                <img
                                    style={{
                                        width: 14,
                                        height: 14,
                                        objectFit: "contain",
                                        marginRight: 4,
                                    }}
                                    src={atImg}
                                />
                            ) : null}
                            {this.renderIcon(conversationInfo)}
                            {/* {isMute && !unreadCount ? (
                                <img
                                    style={{ width: 14, height: 14, objectFit: "contain" }}
                                    src={muteImg}
                                />
                            ) : unreadCount ? ( // ) : unreadCount && chatId !== focusSessionId ? (
                                <Badge
                                    count={unreadCount}
                                    style={{ backgroundColor: `${isMute ? "#DADCE7" : "#FE4343"}` }}
                                />
                            ) : (
                                <span className={classes.tips}>
                                    {lastMessage.sender === UserInfoModel._id
                                        ? renderMessageStatus(lastMessage)
                                        : null}
                                </span>
                            )} */}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default React.memo(injectIntl(ConversationItem));
