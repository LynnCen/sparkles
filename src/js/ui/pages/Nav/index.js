import React, { Component } from "react";
import { Link } from "react-router-dom";
import clazz from "classnames";
import classes from "./style.less";
import { inject, observer } from "mobx-react";
import { ChatMsgIcon, ContractIcon, SettingIcon, MomentIcon } from "../../icons";
import { FormattedMessage } from "react-intl";
import UserInfoComponent from "../../components/UserInfo";
import defaultAvatar from "images/user-fallback.png";
import UserInfo from "@newSdk/model/UserInfo";
import nc, { Event } from "@newSdk/notification";
import memberModel from "@newSdk/model/Members";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
import Test from "./test";
import { Badge } from "antd";
import { DefaultMomentsEntry } from "../Moments/constants/tabs";
import {
    addNewNotification,
    getUnReadCount,
    removeNewNotification,
} from "@newSdk/logic/moments/notifications";
import { ipcRenderer, remote } from "electron";
import { UserProxyEntity } from "../../stores_new/userProxy";
import IPCType from "../../../../MainProcessIPCType";
import { pickerList } from "../../../config";
import Members from "@newSdk/model/Members";
import { createRoundAvatar } from "utils/canvas/createRoundAvatar";
import sessionInfoProxy from "../../stores_new/sessionInfoProxy";
import DraftModel from "@newSdk/model/draft";
@inject((stores) => ({
    isNewFriend: stores.Common.isNewFriend,
    counts: stores.Notification.counts,
    setCounts: stores.Notification.setCounts,
    getNewNotification: stores.Notification.getNewNotification,
    proxyUserInfo: stores.UserProxyEntity.getUserInfo,
    getProxyUserBaseInfo: stores.UserProxyEntity.getProxyUserBaseInfo,
    focusSessionId: stores.NewSession.focusSessionId,
    toggleSettingVisible: stores.settings.toggleSettingVisible,
}))
@observer
export default class Footer extends Component {
    syncSettingUserInfo = false; // 是否需要同步设置。

    constructor(props) {
        super(props);
        this.state = {
            userInfo: { avatar: defaultAvatar },
            unreadCount: undefined, // use undefined with initial value, use default value with UserInfo store
            playAudioFlag: false,
            closeAudioTimer: null,
        };
    }

    componentDidMount() {
        this.initUserInfo();

        this.subscribe();

        this.onNotification();
        this.props.getNewNotification();
        addNewNotification(this.onNotification);
    }

    componentWillUnmount() {
        removeNewNotification(this.onNotification);
        this.unSubscribe();
    }

    subscribe() {
        nc.on(Event.UnreadCountUpdate, this.handleUnreadUpdate);
        nc.on(Members.Event.MyInfoChange, this.handleMyInfoChange);
    }

    unSubscribe() {
        nc.off(Event.UnreadCountUpdate, this.handleUnreadUpdate);
        nc.on(Members.Event.MyInfoChange, this.handleMyInfoChange);
    }

    handleMyInfoChange = (me) => {
        if (this.syncSettingUserInfo) {
            ipcRenderer.send(IPCType.SettingIPCType.settingUserInfoUpdate, me);
        }
    };

    onNotification = () => {
        getUnReadCount().then((val) => {
            this.props.setCounts(val);
        });
    };

    async initUserInfo() {
        this.props.proxyUserInfo(UserInfo._id);
        // refresh cache
        return getUserListInfo([UserInfo._id]);
    }

    handleUnreadUpdate = async ({ unreadCount, msg }) => {
        UserInfo.syncBaseInfo({ unreadCount: unreadCount });

        let playAudioFlag = unreadCount > (this.state.unreadCount || 0);
        let { closeAudioTimer } = this.state;

        const isWinForce = remote.getCurrentWindow().webContents.isFocused();

        if (playAudioFlag && closeAudioTimer === null) {
            closeAudioTimer = setTimeout(() => {
                this.setState({ playAudioFlag: false, closeAudioTimer: null });
            }, 500);

            // flash
            if (!isWinForce) {
                const { chatId } = msg;
                const { avatar } = sessionInfoProxy.sessionInfoProxy(chatId);
                const localPath = await createRoundAvatar(avatar);
                ipcRenderer.send("receive-newMsg", { senderAvatar: localPath });
            }
        }

        const dock = unreadCount ? `${unreadCount}` : "";
        ipcRenderer.send("unreadMsg-change", dock);
        this.setState({
            unreadCount,
            playAudioFlag,
            closeAudioTimer,
        });
    };

    //
    handleShowSetting = () => {
        const { getProxyUserBaseInfo } = this.props;
        const userInfo = getProxyUserBaseInfo(UserInfo._id);
        const data = {
            pickerList,
            userInfo,
        };
        this.syncSettingUserInfo = true;
        ipcRenderer.send(IPCType.SettingIPCType.SettingsWinToggle, data);
    };

    render() {
        const pathname = this.props.location.pathname;
        const { isNewFriend, counts, getProxyUserBaseInfo } = this.props;
        const { playAudioFlag, unreadCount = UserInfo.unreadCount } = this.state;
        const userInfo = getProxyUserBaseInfo(UserInfo._id);
        return (
            <section className={clazz(classes.navContainer)}>
                <div className={classes.user}>
                    <UserInfoComponent
                        size={30}
                        userInfo={{
                            ...userInfo,
                            tmm_id: userInfo.tmm_id,
                        }}
                    />
                </div>
                {[
                    {
                        path: "/",
                        isActive: (path) => path === "/",
                        Icon: () => <ChatMsgIcon title={<FormattedMessage id="Chat" />} />,
                        badgeProps: {
                            count: unreadCount,
                        },
                    },
                    {
                        path: "/contacts",
                        isActive: (path) => path === "/contacts",
                        Icon: () => <ContractIcon title={<FormattedMessage id="Contacts" />} />,
                        badgeProps: {
                            dot: isNewFriend,
                        },
                        onClick: () => {
                            if (this.props.focusSessionId)
                                DraftModel.publishNC(this.props.focusSessionId);
                        },
                    },
                    // {
                    //     path: DefaultMomentsEntry.to,
                    //     isActive: (path) => path.match(/\/moment[s\/]/) || path.match(/topic/),
                    //     Icon: () => (
                    //         <MomentIcon title={<FormattedMessage id="string_im_moment" />} />
                    //     ),
                    //     badgeProps: {
                    //         count: counts,
                    //     },
                    // },
                ].map(({ Icon, path, isActive, badgeProps, onClick }) => (
                    <Link
                        key={path}
                        to={path}
                        className={clazz(classes.linkItem, {
                            [classes.active]: isActive(pathname),
                        })}
                        onClick={onClick}
                    >
                        <Badge {...badgeProps}>
                            <i>
                                <Icon />
                            </i>
                        </Badge>
                    </Link>
                ))}

                <span
                    onClick={this.handleShowSetting}
                    style={{ cursor: "pointer" }}
                    className={classes.linkItem}
                >
                    <i>
                        <SettingIcon title={<FormattedMessage id="Settings" />} />
                    </i>
                </span>
                {playAudioFlag ? (
                    <div
                        style={{
                            display: "none",
                        }}
                    >
                        <audio src={require("../../../../assets/sounds/dolu.wav")} autoPlay />
                    </div>
                ) : null}
            </section>
        );
    }
}
