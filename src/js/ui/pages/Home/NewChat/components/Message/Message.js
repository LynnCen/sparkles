/**
 * @Author Pull
 * @Date 2021-05-23 17:29
 * @project Message
 */

import React, { Component } from "react";
import className from "classnames";
import { Progress, Checkbox } from "antd";
import { inject, observer } from "mobx-react";
import moment from "moment";
import MessageContent from "./MessageContent";
import { renderMessageStatus } from "../../../index";
import { NotificationAgentId, OfficialServices } from "@newSdk/index";
import MessageType from "@newSdk/model/MessageType";
import MessageStatus from "@newSdk/model/MessageStatus";
import UserInfoComponent from "components/UserInfo";
import defaultAvatar from "images/user-fallback.png";
import { injectIntl } from "react-intl";
import Notification from "../Notification";
import { formatDateTime } from "utils/district_helper";
import MessageQuote from "./QuoteLayout";
import UserInfoModel from "@newSdk/model/UserInfo";
import styles from "./styles.less";
import { isGroup } from "@newSdk/utils";
import ServicesMessage from "../OfficialServices/ServicesMessage";
import { getNameWeight } from "utils/nameWeight";

@inject((store) => ({
    msgUploadingList: store.NewChat.msgUploadingList,
    locale: store.settings.locale,
    focusSessionId: store.NewSession.focusSessionId,
    updateMsgIdsWillDelete: store.NewChat.updateMsgIdsWillDelete,
    isShowSelect: store.NewChat.isShowSelect,
    msgIdsWillDelete: store.NewChat.msgIdsWillDelete,

    proxyUserBaseInfo: store.UserProxyEntity.getUserInfo,
    proxyUserInfoInGroup: store.UserProxyEntity.getUserInfoInGroup,
    getProxyUserInfoInGroup: store.UserProxyEntity.getProxyUserInGroupInfo,
    getProxyUserBaseInfo: store.UserProxyEntity.getProxyUserBaseInfo,
}))
@observer
class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: { avatar: defaultAvatar },
            member: {},
            uploadingRate: 0,
            alias: "",
        };
    }

    componentDidMount() {
        const {
            message: { sender, chatId },
            focusSessionId,

            proxyUserBaseInfo,
            proxyUserInfoInGroup,
        } = this.props;

        if (chatId && sender) {
            proxyUserBaseInfo(sender);
            if (isGroup(chatId)) proxyUserInfoInGroup(sender, focusSessionId);
        }
    }

    onCheckBoxChanged = (e) => {
        const {
            message: { mid },
            updateMsgIdsWillDelete,
        } = this.props;
        const { checked } = e.target;
        updateMsgIdsWillDelete(mid, checked);
    };

    onContextMenu = () => {
        const { message, handleContextMenu } = this.props;
        const isSendSuc = ![MessageStatus.sending].includes(message.status);
        isSendSuc && handleContextMenu(message);
    };

    getUserInfo(chatId, sender) {
        const { getProxyUserInfoInGroup, getProxyUserBaseInfo } = this.props;
        const basicInfo = getProxyUserBaseInfo(sender);
        if (isGroup(chatId)) {
            const groupInfo = getProxyUserInfoInGroup(chatId, sender);
            return { ...basicInfo, ...groupInfo };
        }
        return basicInfo;
    }

    render() {
        const { locale, message } = this.props;
        const { sender, timestamp, sendTime, deleteFlag } = message;

        if (deleteFlag) return null;

        const isMe = sender === UserInfoModel._id;
        moment.locale(locale);
        const timeToShow = isMe ? timestamp : sendTime;

        // official account
        if (OfficialServices.includes(sender)) {
            return <ServicesMessage message={message} timeToShow={timeToShow} />;
        }
        // transparent man
        if (sender === NotificationAgentId) {
            return <Notification message={message} />;
        }

        return this.renderContent();
    }

    renderContent() {
        const {
            locale,
            msgUploadingList,
            msgIdsWillDelete,
            isShowSelect,
            message,
            groupTime,
            isShowAvatar,
            marginTop,
            borderRadius,
            contentMarginLeft,
        } = this.props;
        const {
            sender,
            status,
            type,
            content,
            mid,
            timestamp,
            sendTime,
            extra,
            deleteFlag,
            chatId,
        } = message;
        if (deleteFlag) return null;
        // const { userInfo, alias } = this.state;
        const uploadingRate = msgUploadingList[mid];
        const isMe = sender === UserInfoModel._id;
        moment.locale(locale);
        const timeToShow = isMe ? timestamp : sendTime;
        const isSameDay = moment(timeToShow).isSame(groupTime, "day");
        const date_format = formatDateTime(locale, isSameDay);
        // no arrow Message
        // no background Message
        const ignoreBackground = [
            MessageType.ImgMessage,
            MessageType.AttachmentMessage,
            MessageType.VideoMessage,
            MessageType.MomentShareMessage,
        ].includes(type);

        const isSelected = msgIdsWillDelete.includes(mid);

        const userInfo = this.getUserInfo(chatId, sender);
        return (
            <div
                data-mid={mid}
                data-status={status}
                data-cid={chatId}
                className={className(styles.container, {
                    [styles.me]: isMe,
                })}
                style={{ marginTop }}
                // ref={(el) => !isMe && addObserve(el, chatId)}
            >
                {isShowSelect && (
                    <Checkbox
                        checked={isSelected}
                        className={className(styles.msgCheck)}
                        onChange={this.onCheckBoxChanged}
                    />
                )}
                <section className={className(styles.message)}>
                    {isShowAvatar && (
                        <div className={styles.head}>
                            <UserInfoComponent size={24} userInfo={userInfo} />
                            <span className={styles.name}>
                                {getNameWeight({
                                    friendAlias: userInfo.friendAlias,
                                    alias: userInfo.alias,
                                    name: userInfo.name,
                                    uid: userInfo.uid,
                                    status: userInfo.status,
                                })}
                            </span>
                        </div>
                    )}
                    <article
                        className={className(styles.msgContainer)}
                        style={{ marginLeft: contentMarginLeft }}
                        onContextMenu={this.onContextMenu}
                    >
                        <div
                            className={className(styles.content, {
                                [styles.ignoreBackground]: ignoreBackground,
                            })}
                            style={{ borderRadius, overflow: "hidden" }}
                        >
                            <MessageContent
                                type={type}
                                content={content}
                                extra={extra}
                                isMe={isMe}
                                mid={mid}
                                chatId={chatId}
                                timeToShow={moment(timeToShow).format(date_format)}
                                message={message}
                                uploadingRate={uploadingRate}
                            />
                        </div>
                    </article>
                </section>
            </div>
        );
    }
}

export default injectIntl(Message);
