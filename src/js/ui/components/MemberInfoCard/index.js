import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { inject, observer } from "mobx-react";
import { Button, message } from "antd";
import { withRouter } from "react-router-dom";
import UserInfoModel from "@newSdk/model/UserInfo";
import addApplyFriend from "@newSdk/service/api/addFriends/applyToBeFriend";
import { From_Type, isFriend } from "@newSdk/consts/friend_misc";
import { createSingleChatId } from "@newSdk/utils";
import { mapFromObj } from "@newSdk/consts/friend_misc";
import getRegionName from "utils/getRegionName";
import Avatar from "../Avatar";
import { popMenu } from "../../../platform";
import { clipboard } from "electron";
import { localTextTransform } from "../../pages/Home/NewChat/components/MessageInput/editor";
import { MaleIcon, FemaleIcon, MessageIcon, RightArrowBolder } from "../../icons";
import styles from "./styles.less";
import { ROUTE_PATH } from "../../routes";
import { MomentsTabEnum } from "../../pages/Moments/constants/tabs";
import { getNameWeight } from "utils/nameWeight";
import localeFormat from "utils/localeFormat";
import { Duplicat } from "../../icons";
@inject((stores) => ({
    // close: stores.Members.closeView,
    selectSession: stores.NewSession.selectSession,
    focusSessionId: stores.NewSession.focusSessionId,
    locale: stores.settings.locale,
    shouldUseDarkColors: stores.Common.shouldUseDarkColors,
}))
@observer
class MemberInfoCard extends Component {
    state = {
        loading: false,
    };
    toChat = () => {
        const { _id } = UserInfoModel;
        const { userInfo, close, selectSession, history } = this.props;
        const chatId = createSingleChatId(userInfo.uid, _id);
        selectSession(chatId);
        // close();
        if (history.location.pathname !== "/") {
            history.push("/");
        }
    };

    toAddFriends = async () => {
        const { userInfo, close, fromAway, intl } = this.props;
        if (!userInfo.uid) return;
        try {
            this.setState({ loading: true });
            await addApplyFriend(userInfo.uid, fromAway || From_Type.FROM_GROUP);
            // if (res) message.success(intl.formatMessage({ id: "applySend" }));
        } catch (e) {
            console.log(e);
        } finally {
            this.props.onClose();
            this.setState({ loading: false });
        }
    };

    render() {
        const {
            userInfo: info = {},
            focusSessionId,
            intl,
            groupName,
            locale,
            shouldUseDarkColors,
            history,
        } = this.props;
        const isMe = info.uid === UserInfoModel._id;

        if (!info.uid) return null;

        return (
            <section
                className={`${styles.container} fix ${
                    shouldUseDarkColors ? styles.dark : ""
                } electron_drag-disable`}
            >
                <header className={styles.header}>
                    <aside className={styles.avatar}>
                        <Avatar size={60} src={info.avatarPath || info.avatar} />
                        {!!info.gender && (
                            <span className={styles.gender}>
                                {info.gender === 1 ? (
                                    <MaleIcon bodyStyle={{ width: 10, height: 10 }} />
                                ) : (
                                    <FemaleIcon bodyStyle={{ width: 10, height: 10 }} />
                                )}
                            </span>
                        )}
                    </aside>
                    <aside className={styles.nameInfo}>
                        <p className={styles.name} title={info.name}>
                            {getNameWeight({
                                friendAlias: info.friendAlias,
                                alias: info.alias,
                                name: info.name,
                                uid: info.uid,
                                status: info.status,
                            })}
                        </p>
                    </aside>
                    {info.signature && <aside className={styles.tmmdesc}>{info.signature}</aside>}
                </header>

                {!isMe && (
                    <React.Fragment>
                        <ActionItem
                            label={intl.formatMessage({ id: "SendMessage" })}
                            icon={
                                <MessageIcon
                                    title={intl.formatMessage({ id: "SendMessage" })}
                                    styleObj={{ color: "var(--deep)" }}
                                />
                            }
                            action={
                                !!isFriend(info.isFriend) &&
                                !focusSessionId.startsWith("s_") &&
                                this.toChat
                            }
                        />
                        <ActionItem
                            label={intl.formatMessage({ id: "AddFriends" })}
                            loading={this.state.loading}
                            action={!isFriend(info.isFriend) && this.toAddFriends}
                        />
                    </React.Fragment>
                )}

                <div className={styles.detailInfo}>
                    <InfoItem
                        label={intl.formatMessage({ id: "Region" })}
                        content={info.regionId && getRegionName(locale, info.regionId)}
                    />
                    <InfoItem
                        label={intl.formatMessage({ id: "TmmTmmId" })}
                        content={info.tmm_id}
                        duplicat={true}
                    />
                    <InfoItem
                        label={intl.formatMessage({ id: "From" })}
                        content={
                            info.fromWay &&
                            mapFromObj[info.fromWay] &&
                            intl.formatMessage({ id: mapFromObj[info.fromWay] })
                        }
                    />
                    {/* 
                    2022/7/1 hdie moments
                    */}
                    {/* <InfoItem
                        label={intl.formatMessage({ id: "moments" })}
                        bodyStyle={{ cursor: "pointer" }}
                        onClick={() => {
                            this.props.onClose();
                            // history.push(
                            //     ROUTE_PATH.MOMENTS_LIST.replace(":type", MomentsTabEnum.Trending)
                            // );
                            history.push(ROUTE_PATH.USER_MOMENTS_ALL.replace(":uid", info.uid));
                        }}
                        content={<RightArrowBolder bodyStyle={{ color: "var(--color-normal)" }} />}
                    /> */}
                </div>
            </section>
        );
    }
}

const ActionItem = ({ label, icon, action, loading }) => {
    if (!action) return null;
    return (
        <footer className={styles.actions}>
            <Button
                icon={icon}
                loading={loading}
                delay={300}
                onClick={action}
                type={"primary"}
                shape={"round"}
            >
                {label}
            </Button>
        </footer>
    );
};

const InfoItem = ({ label, content, bodyStyle = {}, duplicat = false, ...attrs }) => {
    if (!content) return null;

    function handleCopyToClipboard({ html, text }) {
        if (!html && !text) return;
        if (!html) {
            html = localTextTransform(text);
        }
        // console.log/**/
        clipboard.write({
            html,
            text,
        });
        message.success(localeFormat({ id: "copied" }));
    }
    const showContextMenu = (content) => {
        let template = [
            {
                label: localeFormat({ id: "Copy" }),
                click: () => {
                    return handleCopyToClipboard({});
                },
                key: "Copy",
            },
        ];
        popMenu(template);
    };
    return (
        <div className={styles.detailItem} style={bodyStyle} {...attrs}>
            <div className={styles.detailLeft}>{label}</div>
            <div className={styles.detailRight}>{content}</div>

            {duplicat && (
                <div
                    className={styles.icon}
                    //  onContextMenu={(ev) => showContextMenu(content)}
                    onClick={() => handleCopyToClipboard({ text: content })}
                >
                    <Duplicat />
                </div>
            )}
        </div>
    );
};

export default injectIntl(withRouter(MemberInfoCard));
