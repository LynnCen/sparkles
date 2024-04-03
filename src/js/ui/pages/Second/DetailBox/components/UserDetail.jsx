import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";

import Avatar from "components/Avatar";
import { Button, Input, message, Divider } from "antd";
import moment from "moment";
import { From_Type, isMyFriend, isFriend, mapFromObj } from "@newSdk/consts/friend_misc";
import { createSingleChatId } from "@newSdk/utils";
import UserInfo from "@newSdk/model/UserInfo";
import { withRouter } from "react-router-dom";
import { userStatus } from "@newSdk/consts/userStatus";
import styles from "./styles.less";
import { FemaleIcon, MaleIcon, MessageIcon, DelIcon, RightArrowBolder } from "../../../../icons";
import deleteFriend from "@newSdk/service/api/addFriends/deleteFriend";
import getRegionName from "utils/getRegionName";
import { checkOriginCache } from "utils/sn_utils";
import imgUtils from "@newSdk/utils/ImageSource";
import addApplyFriend from "@newSdk/service/api/addFriends/applyToBeFriend";
import classNames from "classnames";
import { ROUTE_PATH } from "../../../../routes";
import AliasInput from "./AliasInput/AliasInput";
import ThemeModal from "components/Tmm_Ant/ThemeModal";
import LoadingButton from "components/Tmm_Ant/LoadingButton";
import GroupDetail from "./GroupDetail";
import tmmUserInfo from "@newSdk/model/UserInfo";
import contactsStore from "../../stores";
import userProxy from "../../../../stores_new/userProxy";
import sessionInfoProxy from "../../../../stores_new/sessionInfoProxy";
import session from "../../../../stores_new/session";
import acceptFriend from "@newSdk/service/api/addFriends/acceptFriend";
import reportUnread from "@newSdk/logic/reportUnread";
import GroupAvatarMask from "../../../../components/TmmSessionBoard/components/SessionInfo/GroupAvatarMask";
import { getNameWeight } from "utils/nameWeight";
import { Duplicat } from "../../../../icons";
import { clipboard } from "electron";
import { localTextTransform } from "../../../Home/NewChat/components/MessageInput/editor";
@inject((store) => ({
    locale: store.settings.locale,
}))
@observer
class UserDetail extends React.Component {
    state = {
        loading: false,
        loadingOfAdd: false,
    };
    componentDidMount() {
        try {
            const {
                focusItemInfo: { type, info },
                TabEnum: { contacts, newFriend },
            } = contactsStore;
            const { id } = info;
            if ([contacts, newFriend].includes(type)) {
                userProxy.getUserInfo(id);
            } else {
                sessionInfoProxy.getSessionInfo(id);
            }
        } catch (error) {
            console.log(error);
        }
    }

    chatWithFriend = (chatId) => {
        if (!chatId) return;

        if (this.props.history.location.pathname !== "/") {
            this.props.history.push("/");
        }
        return session.selectSession(chatId);
    };

    handleDeleteFriend = () => {
        const {
            info: { id, name, friendAlias },
        } = contactsStore.focusItemInfo;
        if (!id) return false;

        const { formatMessage } = this.props.intl;
        ThemeModal.confirm({
            content: formatMessage({ id: "deleteTip" }, { name: friendAlias || name }),
            okText: formatMessage({ id: "Delete" }),
            cancelText: formatMessage({ id: "Cancel" }),
            icon: null,
            centered: true,
            onOk: async () => {
                const res = await deleteFriend(id);
                if (res) contactsStore.setFocusItem();
                reportUnread();
            },
        });
    };

    showAvatar = (src) => {
        return ThemeModal.confirm({
            title: null,
            icon: null,
            maskClosable: true,
            footer: null,
            width: 340,
            className: styles.avatarModal,
            content: (
                <Avatar
                    src={src}
                    style={{
                        borderRadius: "none !important",
                        width: 244,
                        height: "auto",
                        maxHeight: 600,
                    }}
                />
            ),
            centered: true,
        });
    };

    previewAvatar = async () => {
        const { avatar, avatarPath: src } = this.getDetails();
        const key = this.showAvatar(src);

        const updatePath = (originAvatar) => {
            key.update({
                content: (
                    <Avatar
                        src={originAvatar}
                        style={{
                            borderRadius: "none !important",
                            width: 244,
                            height: "auto",
                            maxHeight: 600,
                        }}
                    />
                ),
            });
        };

        if (!avatar) return;
        const originAvatar = await checkOriginCache(avatar.text, avatar.file_type);
        if (originAvatar) {
            return updatePath(originAvatar);
        } else {
            // download avatar
            const path = await imgUtils.downloadOriginImage(avatar);
            if (path) updatePath(path);
        }
    };

    onAcceptApply = async () => {
        const {
            focusItemInfo: { type, info },
            TabEnum: { newFriend },
        } = contactsStore;

        if (type !== newFriend) return;
        const { applyId, status, uid } = info;
        if (status === 1) return;
        await acceptFriend(uid, applyId).then((res) => {
            if (res) this.chatWithFriend(createSingleChatId(uid, tmmUserInfo._id));
        });
    };

    toAddFriends = async () => {
        const {
            focusItemInfo: { type, info },
            TabEnum: { newFriend },
        } = contactsStore;
        // if (type !== newFriend) return;
        const { intl } = this.props;
        const { applyId, status, uid, id } = info;
        if (!id || status === 0) return;
        try {
            // prev uid
            await addApplyFriend(id, -1);
            // if (res) message.success(intl.formatMessage({ id: "applySend" }));
        } catch (e) {
            console.log(e);
        }
    };

    renderNewFriendsState = () => {
        const {
            focusItemInfo: { info },
        } = contactsStore;
        const { intl } = this.props;
        const isExpired = moment.duration(moment().diff(moment(info.createTime))).asDays() >= 7;
        const status = info.status;
        let details = this.getDetails();
        if (isExpired) {
            return (
                <div
                    className={styles.button}
                    style={{
                        backgroundColor: "var(--bg-demmed)",
                        color: "var(--color-normal)",
                        border: "none",
                        cursor: "default",
                    }}
                >
                    {intl.formatMessage({ id: "Expired" })}
                </div>
            );
        }

        //|| !isFriend(details.isFriend)
        if (status === 1) {
            if (isFriend(details.isFriend)) {
                return (
                    <div
                        className={styles.button}
                        onClick={() =>
                            this.chatWithFriend(createSingleChatId(info.id, tmmUserInfo._id))
                        }
                    >
                        <MessageIcon />
                        <span className={styles.text}>
                            {intl.formatMessage({ id: "SendMessage" })}
                        </span>
                    </div>
                );
            } else {
                return (
                    <LoadingButton onClick={this.toAddFriends} className={styles.button}>
                        {intl.formatMessage({ id: "AddFriends" })}
                    </LoadingButton>
                );
            }
        }

        return (
            <LoadingButton onClick={this.onAcceptApply} className={styles.button}>
                {intl.formatMessage({ id: "Accept" })}
            </LoadingButton>
        );
    };

    getDetails = () => {
        try {
            const {
                focusItemInfo: { type, info },
                TabEnum: { groups },
            } = contactsStore;
            const isGroup = type === groups;
            let details = {};

            if (isGroup) {
                details = { ...info, ...sessionInfoProxy.sessionInfoProxy(info.id) };
            } else {
                details = userProxy.getProxyUserBaseInfo(info.id);
            }

            return details;
        } catch (error) {
            console.log("getDetails", error);
            return false;
        }
    };

    handleCopyToClipboard = ({ html, text }) => {
        if (!html && !text) return;
        if (!html) {
            html = localTextTransform(text);
        }
        // console.log/**/
        clipboard.write({
            html,
            text,
        });
        message.success("已复制");
    };
    render() {
        const { intl, history, locale } = this.props;
        const {
            focusItemInfo: { type, info },
            TabEnum: { newFriend, groups, contacts },
        } = contactsStore;

        const isNew = type === newFriend;
        const isGroup = type === groups;
        const isContacts = type === contacts;
        let details = this.getDetails();
        // console.log(details.isFriend);
        // const isFriend = isMyFriend(details.isFriend);
        const isMySingleFriend = isFriend(details.isFriend);
        // const name = details.friendAlias || details.name || details.tmm_id;
        const name = getNameWeight({
            friendAlias: details.friendAlias,
            alias: details.alias,
            name: details.name,
            uid: details.uid,
            status: details.status,
        });
        return (
            details && (
                <section className={styles.container}>
                    {details.status == userStatus.Deleted ? (
                        <React.Fragment>
                            <div className={styles.avatar}>
                                <div onClick={this.previewAvatar}>
                                    <Avatar src={details.avatarPath} size={100} />
                                </div>
                            </div>
                            <div className={styles.nameBox}>
                                <div className={styles.deleteAccount}>
                                    {intl.formatMessage({ id: "account_deleted" })}
                                </div>
                            </div>
                            <div>
                                <Divider className={styles.timeLine}>
                                    {intl.formatMessage({ id: "nothing" })}
                                </Divider>
                            </div>

                            {isMySingleFriend ? (
                                <div className={styles.infoBox}>
                                    <section
                                        className={classNames(styles.card, styles.act, styles.del)}
                                        onClick={this.handleDeleteFriend}
                                    >
                                        <div className={styles.item}>
                                            <DelIcon
                                                bodyStyle={{
                                                    color: "var(--danger)",
                                                    marginRight: 10,
                                                }}
                                            />
                                            {intl.formatMessage({ id: "Delete" })}
                                        </div>
                                    </section>
                                </div>
                            ) : null}
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className={styles.avatar}>
                                <div onClick={this.previewAvatar}>
                                    <Avatar src={details.avatarPath} size={100} />
                                </div>

                                {[1, 2].includes(details.gender) && (
                                    <div className={styles.gender}>
                                        {details.gender === 1 ? <MaleIcon /> : <FemaleIcon />}
                                    </div>
                                )}
                                {isGroup && details.editAble && (
                                    <div className={styles.gender}>
                                        <GroupAvatarMask
                                            gid={contactsStore.focusItemInfo.info.id}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={styles.nameBox}>
                                <AliasInput
                                    value={name}
                                    id={info.id}
                                    isGroup={isGroup}
                                    editAble={isMySingleFriend || (isGroup && details.editAble)}
                                />
                            </div>

                            {details.signature && (
                                <div className={styles.sigBox}>{details.signature}</div>
                            )}
                            {isGroup ? (
                                <div
                                    className={styles.button}
                                    onClick={() => this.chatWithFriend(info.id)}
                                >
                                    <MessageIcon />
                                    <span className={styles.text}>
                                        {intl.formatMessage({ id: "SendMessage" })}
                                    </span>
                                </div>
                            ) : null}
                            {isNew ? this.renderNewFriendsState() : null}
                            {isContacts ? (
                                isMySingleFriend ? (
                                    <div
                                        className={styles.button}
                                        onClick={() =>
                                            this.chatWithFriend(
                                                createSingleChatId(info.id, tmmUserInfo._id)
                                            )
                                        }
                                    >
                                        <MessageIcon />
                                        <span className={styles.text}>
                                            {intl.formatMessage({ id: "SendMessage" })}
                                        </span>
                                    </div>
                                ) : (
                                    <LoadingButton
                                        onClick={this.toAddFriends}
                                        className={styles.button}
                                    >
                                        {intl.formatMessage({ id: "AddFriends" })}
                                    </LoadingButton>
                                )
                            ) : null}
                            {/* {isNew && !isFriend ? (
                    this.renderNewFriendsState()
                ) : isFriend || isGroup ? (
                    <div
                        className={styles.button}
                        onClick={() =>
                            this.chatWithFriend(
                                isGroup ? info.id : createSingleChatId(info.id, tmmUserInfo._id)
                            )
                        }
                    >
                        <MessageIcon />
                        <span className={styles.text}>
                            {intl.formatMessage({ id: "SendMessage" })}
                        </span>
                    </div>
                ) : (
                    <LoadingButton onClick={this.toAddFriends} className={styles.button}>
                        {intl.formatMessage({ id: "AddFriends" })}
                    </LoadingButton>
                )} */}

                            {isGroup ? (
                                <GroupDetail gid={contactsStore.focusItemInfo.info.id} />
                            ) : (
                                <div className={styles.infoBox}>
                                    <section className={styles.card}>
                                        {[
                                            {
                                                visible: details.name && details.friendAlias,
                                                name: "name",
                                                val: details.name,
                                            },
                                            {
                                                visible: details.phone,
                                                name: "phone",
                                                val: details.phone,
                                            },
                                            {
                                                visible: details.regionId,
                                                name: "Region",
                                                val: getRegionName(locale, details.regionId),
                                            },
                                            {
                                                visible: details.tmm_id,
                                                name: "TmmTmmId",
                                                val: details.tmm_id,
                                            },
                                            {
                                                visible: details.fromWay,
                                                name: "From",
                                                val:
                                                    mapFromObj[details.fromWay] &&
                                                    intl.formatMessage({
                                                        id: mapFromObj[details.fromWay],
                                                    }),
                                            },
                                        ].map(({ visible, name, val }, index) =>
                                            !visible ? null : (
                                                <div
                                                    className={styles.item}
                                                    data-t={name}
                                                    key={index}
                                                >
                                                    <span>{intl.formatMessage({ id: name })}</span>
                                                    <span>
                                                        {val}
                                                        {name == "TmmTmmId" && (
                                                            <span
                                                                className={styles.icon}
                                                                //  onContextMenu={(ev) => showContextMenu(content)}
                                                                onClick={() =>
                                                                    this.handleCopyToClipboard({
                                                                        text: val,
                                                                    })
                                                                }
                                                            >
                                                                <Duplicat />
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </section>
                                    {/* 
                    2022/7/1 hdie moments
                    */}
                                    {/* <section className={classNames(styles.card, styles.act)}>
                                        <div
                                            className={styles.item}
                                            data-t={name}
                                            onClick={() => {
                                                history.push(
                                                    ROUTE_PATH.USER_MOMENTS_ALL.replace(
                                                        ":uid",
                                                        info.id
                                                    )
                                                );
                                            }}
                                        >
                                            <span>{intl.formatMessage({ id: "moments" })}</span>
                                            <RightArrowBolder
                                                bodyStyle={{ color: "var(--color-normal)" }}
                                            />
                                        </div>
                                    </section> */}

                                    {isMySingleFriend ? (
                                        <section
                                            className={classNames(
                                                styles.card,
                                                styles.act,
                                                styles.del
                                            )}
                                            onClick={this.handleDeleteFriend}
                                        >
                                            <div className={styles.item}>
                                                <DelIcon
                                                    bodyStyle={{
                                                        color: "var(--danger)",
                                                        marginRight: 10,
                                                    }}
                                                />
                                                {intl.formatMessage({ id: "Delete" })}
                                            </div>
                                        </section>
                                    ) : null}
                                </div>
                            )}
                        </React.Fragment>
                    )}
                </section>
            )
        );
    }
}
export default injectIntl(withRouter(UserDetail));
