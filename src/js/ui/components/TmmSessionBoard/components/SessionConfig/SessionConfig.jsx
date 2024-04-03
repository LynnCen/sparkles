import React, { Component } from "react";
import styles from "./styles.less";
import {
    DiamondDoc,
    PolygonNotice,
    OutlinePin,
    OutlineMute,
    ContactsAdd,
    ManageGroup,
} from "../../../../icons";
import { injectIntl } from "react-intl";
import SwitchFields from "components/TmmSessionBoard/components/SessionConfig/SwitchFields";
import EditInput from "components/TmmSessionBoard/components/SessionInfo/EditInput";
import session from "../../../../stores_new/session";
import { getSingleChatTarget, isGroup } from "@newSdk/utils";
import updateGroupMyAlias from "@newSdk/service/api/group/updateGroupMyAlias";
import { inject, observer } from "mobx-react";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { pickerStore } from "components/TmmPickerBoard/pickerStore";
import createGroup from "utils/chatController/createGroup";
import setStickTop from "@newSdk/service/api/conversation/setStickTop";
import setMute from "@newSdk/service/api/conversation/setMute";
import { getNameWeight } from "utils/nameWeight";
import { sessionBoardStore, SessionTab } from "../../sessionBoardStore";
import localeFormat from "utils/localeFormat";
@inject((stores) => ({
    proxyUserInfoInGroup: stores.UserProxyEntity.getUserInfoInGroup,
    focusSessionId: stores.NewSession.focusSessionId,
    getProxyUserInfoInGroup: stores.UserProxyEntity.getProxyUserInGroupInfo,
}))
@observer
export class SessionConfig extends Component {
    createGroupCancelFn = null;
    componentDidMount() {
        const { proxyUserInfoInGroup, focusSessionId } = this.props;
        if (focusSessionId) proxyUserInfoInGroup(tmmUserInfo._id, focusSessionId);
    }

    handleChangeGroupAlias = (val) => {
        const { focusSessionId } = session;
        if (focusSessionId) {
            return updateGroupMyAlias(focusSessionId, val);
        }
    };

    handleCreateGroup = () => {
        const { focusSessionId } = session;
        const friendId = getSingleChatTarget(focusSessionId);
        const { Contacts } = pickerStore.TabEnum;
        const info = this.props.getProxyUserInfoInGroup(focusSessionId, friendId);
        pickerStore.open({
            initialTab: Contacts,
            title: "CreateGroupChat",
            supportTab: [
                {
                    type: Contacts,
                    title: "Contacts",
                },
            ],
            okText: "ok",
            dataDidInit: () => {
                const list = pickerStore.getTabList(pickerStore.tabs, Contacts);
                const defaultSelected = list.find((item) => item.id === friendId);
                pickerStore.updateSelect({
                    tabType: Contacts,
                    baseInfo: defaultSelected,
                    selectedInfo: {
                        avatar: info.avatarPath,
                        name: getNameWeight({
                            friendAlias: info.friendAlias,
                            alias: info.alias,
                            name: info.name,
                            uid: info.uid,
                            status: info.status,
                        }),
                        id: defaultSelected.id,
                        type: Contacts,
                    },
                });
            },
            resultHandler: async (selectedTabs) => {
                const list = pickerStore.getTabList(selectedTabs, Contacts);
                const ids = list.map((user) => user.id);
                if (ids.length < 2) return;
                const control = createGroup(ids);
                const { value: cancel } = await control.next();
                this.createGroupCancelFn = cancel;
                const { value: res } = await control.next();
                this.createGroupCancelFn = null;
                return res;
            },
            cancelHandler: () => {
                if (this.createGroupCancelFn) {
                    this.createGroupCancelFn();
                }
            },
        });
    };

    handleStick = async (flag) => {
        const { focusSessionId } = session;
        return setStickTop(focusSessionId, flag);
    };

    handleMute = (flag) => {
        const { focusSessionId } = session;
        return setMute(focusSessionId, flag);
    };
    handleManageGroup = () => {
        sessionBoardStore.viewAllMembers(SessionTab.Manage);
    };

    render() {
        const { intl, getProxyUserInfoInGroup } = this.props;
        const { focusSessionId, focusSessionInfo } = session;
        const group = isGroup(focusSessionId);
        const myGroupInfo = getProxyUserInfoInGroup(focusSessionId, tmmUserInfo._id);
        const myName = getNameWeight({
            alias: myGroupInfo.alias,
            name: myGroupInfo.name,
            uid: myGroupInfo.uid,
        });
        const { isOwner, uid } = sessionBoardStore.ownerInfo;
        return (
            <section className={styles.box}>
                {/* {group && (
                    <section className={styles.groupNotice}>
                        <div className={styles.head}>
                            <span className={styles.icon}>
                                <PolygonNotice />
                            </span>
                            <span className={styles.title}>
                                {intl.formatMessage({ id: "GroupNotice" })}
                            </span>
                        </div>

                        <div className={styles.noticeContent}>No group notice yet</div>
                    </section>
                )} */}

                {group && (
                    <section className={styles.groupAlias}>
                        <div className={styles.head}>
                            <span className={styles.icon}>
                                <DiamondDoc />
                            </span>
                            <span className={styles.title}>
                                {" "}
                                {localeFormat({ id: "group_name" })}
                            </span>
                        </div>

                        <div className={styles.editContent}>
                            <EditInput
                                value={myName}
                                className={styles.content}
                                onPressEnter={this.handleChangeGroupAlias}
                                isOwner={true}
                                emptyAble={true}
                            />
                        </div>
                    </section>
                )}

                {!group && (
                    <section className={styles.createGroupChat} onClick={this.handleCreateGroup}>
                        <span className={styles.icon}>
                            <ContactsAdd />
                        </span>
                        <span className={styles.title}>
                            {intl.formatMessage({ id: "CreateGroupChat" })}
                        </span>
                    </section>
                )}
                {[
                    // {
                    //     type: "disPlayName",
                    //     icon: <CircleEyes />,
                    //     title: "my alias",
                    //     handleChange: (val) => console.log(val),
                    // },
                    {
                        type: "sticky",
                        icon: <OutlinePin />,
                        title: "Stick",
                        value: !!focusSessionInfo.isTop,
                        handleChange: this.handleStick,
                    },
                    {
                        type: "mute",
                        icon: <OutlineMute />,
                        title: "Mute Noti",
                        value: !!focusSessionInfo.isMute,
                        handleChange: this.handleMute,
                    },
                ].map(({ type, icon, value, title, handleChange }) => (
                    <SwitchFields
                        key={type}
                        type={type}
                        icon={icon}
                        title={title}
                        value={value}
                        handleChange={handleChange}
                    />
                ))}
                {isOwner && uid === tmmUserInfo._id && group && (
                    <section className={styles.createGroupChat} onClick={this.handleManageGroup}>
                        <span className={styles.icon}>
                            <ManageGroup />
                        </span>
                        <span className={styles.title}>
                            {localeFormat({ id: "mp_group_ma_add" })}
                        </span>
                    </section>
                )}
            </section>
        );
    }
}
export default injectIntl(SessionConfig);
