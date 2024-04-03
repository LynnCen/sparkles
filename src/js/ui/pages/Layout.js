import React, { Component, Fragment } from "react";
import { observer, inject } from "mobx-react";
import { ipcRenderer, remote } from "../../platform";
import classes from "./Layout.less";
import LeftNav from "./Nav";
import Login from "./Login";
import clazz from "classnames";
import { createImageCache, createFileCache } from "utils/sn_utils";
import { pull } from "@newSdk/service/api/PullMessage";
import { message } from "antd";
import nc, { Event } from "@newSdk/notification";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import WSClient from "@newSdk/websocket_client";
import { initPublicDB } from "@newSdk/model/public";
import { tmmBase, tmmMoment, tmmOpenPlatform, tmmPayment } from "@newSdk/service/apiBase/tmmBase";
import userModel, { InitLoadingStatus } from "@newSdk/model/UserInfo";
import memberModel, { FriendsStatus } from "@newSdk/model/Members";
import groupChats from "@newSdk/utils/chat_with_group";
import getGroupMemberInfoList from "@newSdk/service/api/group/getGroupMemberInfoList";
import { setMuteUpdateUnread } from "@newSdk/logic/initScript/initAllChatsInfo";
import moment from "moment";
import { clearCache } from "../store";
import SyncOffLine from "@newSdk/websocket_client/model/SYNC_OFFLINE";
import AgreeAddFriend from "@newSdk/websocket_client/model/AGREE_ADD_FRIEND";
import { device } from "utils/tools";
import { isDev } from "@newSdk/config";
import { receiveFromWS } from "@newSdk/logic/moments/notifications";
import clearAwaitSendMessage from "@newSdk/logic/clearAwaitSendMessage";
import ForwardMoments from "./Moments/components/forwardMoments/ForwardItem";
import { getAppInfo } from "@newSdk/service/api/openplatform";
import InitLoadingModal from "components/_N_InitLoadingModal";
import IPCType from "../../../MainProcessIPCType";
import MiniProgramContent from "@newSdk/model/message/MiniProgramContent";
import "../../../global.css";
import session from "../stores_new/session";
import chat from "../stores_new/chat";
import ImageIcon, { supportEnumType } from "components/_N_ImageIcon/ImageIcon";
import Header from "./Header";
import TmmPickerBoard from "components/TmmPickerBoard/PickerBoard";
import sessionBoardStore from "components/TmmSessionBoard/sessionBoardStore";
import forwardMessage from "utils/chatController/forwardMessage";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
import MessageType, { IntlTemplateGroupInfo } from "@newSdk/model/MessageType";
import { isGroup } from "@newSdk/utils";
import getGroupInfos from "@newSdk/logic/group/getGroupInfos";
import { encryptSha1 } from "utils/sn_utils";
import getGroupNotice from "@newSdk/service/api/group/getGroupNotice";
import groupInfoModel from "@newSdk/model/GroupInfo";
import chatModel from "@newSdk/model/Chat";
import quitGroup from "@newSdk/service/api/group/quitGroup";
import clearChatMessage from "@newSdk/logic/message/clearChatMessage";
const { nativeTheme } = remote.require("electron");

const sameWeekFormat = function (now) {
    if (this.isSame(now, "week")) {
        return "ddd LL";
    }

    if (this.isSame(now, "year")) {
        return "LL";
    }

    return "LL";
};

moment.locale("en", {
    calendar: {
        lastDay: "[Yesterday]",
        sameDay: "[Today]",
        lastWeek: sameWeekFormat,
        sameElse: sameWeekFormat,
    },
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
    longDateFormat: {
        LL: "MM/DD",
    },
    relativeTime: function (number, withoutSuffix, key, isFuture) {
        return `${number}${key}`;
    },
});

const chineseCalendar = {
    lastDay: "[昨天]",
    sameDay: "[今天]",
    lastWeek: sameWeekFormat,
    sameElse: sameWeekFormat,
};

const chineseMeridiem = function (hour) {
    if (hour < 12) {
        return "上午";
    }
    return "下午";
};

const chineseWeekShort = "周日_周一_周二_周三_周四_周五_周六".split("_");
const chineseDateFormat = { LL: "MM月DD日" };
const chineseWeek = {
    dow: 1,
    doy: 4,
};
moment.locale("zh-CN", {
    calendar: chineseCalendar,
    meridiem: chineseMeridiem,
    weekdaysShort: chineseWeekShort,
    longDateFormat: chineseDateFormat,
    week: chineseWeek,
});
moment.locale("zh-TW", {
    calendar: chineseCalendar,
    meridiem: chineseMeridiem,
    weekdaysShort: chineseWeekShort,
    longDateFormat: chineseDateFormat,
    week: chineseWeek,
    relativeTime: function (number, withoutSuffix, key, isFuture) {
        return `${number}${key}`;
    },
});
moment.locale("tr", {
    calendar: {
        lastDay: "[Dün]",
        sameDay: "[Bugün]",
        lastWeek: sameWeekFormat,
        sameElse: sameWeekFormat,
    },
    weekdaysShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
    longDateFormat: {
        LL: "MM/DD",
    },
    relativeTime: function (number, withoutSuffix, key, isFuture) {
        return `${number}${key}`;
    },
});

const windowFocusPull = (() => {
    // 拉去消息
    let time = null;
    const debounce = 50;
    const handlePull = () => {
        // handle pull
        if (time) clearTimeout(time);
        time = setTimeout(() => pull(), debounce);
    };

    // 消息重发
    let reSendTime = null;
    const reSendDebounce = 1000 * 60;
    const handleReSend = () => {
        if (reSendTime) return;
        clearAwaitSendMessage();
        reSendTime = setTimeout(() => {
            reSendTime = null;
        }, reSendDebounce);
    };

    // 清除当前会话未读
    let sessionTimer = null;
    const throttleTimer = 1000 * 2;
    const handleClearUnread = () => {
        if (!sessionTimer) {
            // todo
            const sessionInfo = session.focusSessionInfo;
            if (sessionInfo.chatId && sessionInfo.unreadCount) {
                session.selectSession(sessionInfo.chatId);
                sessionTimer = setTimeout(() => {
                    sessionTimer = null;
                }, throttleTimer);
            }
        }
    };

    return () => {
        if (!userModel.logined) return;
        if (userModel.loading !== InitLoadingStatus.DONE) return;

        handlePull();
        handleClearUnread();
        handleReSend();
    };
})();

@inject((stores) => ({
    stores,
    updateApplyFriendMsgState: stores.Common.updateApplyFriendMsgState,
    updateShouldUseDarkColors: stores.Common.updateShouldUseDarkColors,
    shouldUseDarkColors: stores.Common.shouldUseDarkColors,
    setMomentShare: stores.ForwardMoments.shareApplet,
}))
@observer
class Layout extends Component {
    state = {
        offline: false,
        loading: false,
        connectionStatus: -1,
        loginFlag: false,
    };

    componentWillMount() {
        if (userModel.logined) this.setState({ loginFlag: true });
        const { updateShouldUseDarkColors } = this.props;
        ipcRenderer.on("themeUpdated", this.updateThemeColor);
        updateShouldUseDarkColors(nativeTheme.shouldUseDarkColors);
        console.log("lMount", nativeTheme.shouldUseDarkColors);
        message.config({
            prefixCls: nativeTheme.shouldUseDarkColors ? "dark-message ant-message" : "ant-message",
        });
    }

    updateThemeColor = (_, shouldUseDarkColors) => {
        const { updateShouldUseDarkColors } = this.props;
        updateShouldUseDarkColors(shouldUseDarkColors);
    };

    componentDidMount() {
        initPublicDB();
        this.initDragAction();
        // this.initLoginState();
        this.addObserver();
        // initPublicConfig();

        // setTimeout(() => this.handleForceOffline({ items: { content: "666" } }), 1e4);
    }

    addObserver() {
        ipcRenderer.on("compress-img", this.handleCompressImg);
        ipcRenderer.on(IPCType.MomentsIPCTypes.shareApplet, this.handleMomentShare);

        ipcRenderer.on(IPCType.ChatIPCType.forwardApplet, (event, content = {}) => {
            const msg = new MiniProgramContent(
                "",
                MiniProgramContent.transformAppletDetail(content)
            );
            forwardMessage(msg);
        });

        WSClient.eventCenter.on(SyncOffLine.cmd, this.handleForceOffline);
        WSClient.eventCenter.on(AgreeAddFriend.cmd, this.handleNewFriend);
        tmmBase.setDelegate(this.handleLogout.bind(this));
        tmmOpenPlatform.setDelegate(this.handleLogout.bind(this));
        tmmMoment.setDelegate(this.handleLogout.bind(this));
        tmmPayment.setDelegate(this.handleLogout.bind(this));

        ipcRenderer.on("currentWindow-focus", windowFocusPull);
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners("compress-img");
        ipcRenderer.removeAllListeners("compress-file");
        ipcRenderer.removeAllListeners("currentWindow-focus");
        ipcRenderer.removeAllListeners(IPCType.ChatIPCType.forwardApplet);
        ipcRenderer.removeListener(IPCType.MomentsIPCTypes.shareApplet, this.handleMomentShare);

        WSClient.eventCenter.off(SyncOffLine.cmd, this.handleForceOffline);
        WSClient.eventCenter.off(AgreeAddFriend.cmd, this.handleNewFriend);
        nc.removeAllListeners(Event.TmmInit);

        ipcRenderer.off("compress-img", this.handleCompressImg);
        ipcRenderer.off("currentWindow-focus", windowFocusPull);
        ipcRenderer.off("themeUpdated", this.updateThemeColor);
        ipcRenderer.off("mini_momentShare", this.handleMomentShare);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //
        const { loginFlag } = this.state;
        if (loginFlag !== prevState.loginFlag && loginFlag) {
            WSClient.eventCenter.on("new_msg", this.onMsgReceive);
            WSClient.eventCenter.on("apply_friend_msg", this.onFriendApply);
            WSClient.eventCenter.on("sync_setting_mute", this.onMuteUpdate);
            WSClient.eventCenter.on("sync_setting_top", this.onTopUpdate);
            WSClient.eventCenter.on("moments_msg", this.onReceiveMoments);
        }

        if (loginFlag !== prevState.loginFlag && !loginFlag) {
            WSClient.eventCenter.off("new_msg", this.onMsgReceive);
            WSClient.eventCenter.off("apply_friend_msg", this.onFriendApply);
            WSClient.eventCenter.off("sync_setting_mute", this.onMuteUpdate);
            WSClient.eventCenter.off("sync_setting_top", this.onTopUpdate);
            WSClient.eventCenter.off("moments_msg", this.onReceiveMoments);
        }

        if (prevProps.shouldUseDarkColors !== this.props.shouldUseDarkColors) {
            message.destroy();
            message.config({
                prefixCls: this.props.shouldUseDarkColors
                    ? "dark-message ant-message"
                    : "ant-message",
            });

            if (!device.isMac()) {
                if (this.props.shouldUseDarkColors) document.body.style.border = "none";
                else document.body.style.border = "2px solid #e0e0e0";
            }
        }

        this.handleThemeChange(prevProps);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.shouldUseDarkColors !== this.props.shouldUseDarkColors) {
            return false;
        }

        return true;
    }

    handleThemeChange(prevProps) {
        if (
            !prevProps.shouldUseDarkColors ||
            prevProps.shouldUseDarkColors !== this.props.shouldUseDarkColors
        ) {
            const key = Number(this.props.shouldUseDarkColors);
            const ThemeEnum = {
                0: "light",
                1: "dark",
            };

            document.body.setAttribute("data-theme", ThemeEnum[key]);
        }
    }

    handleMomentShare = async (e, info) => {
        const { setMomentShare } = this.props;
        const [item] = await getAppInfo([info.aid]);
        setMomentShare(item);
    };

    handleCompressImg = async (e, source, info, isPub) => {
        const data = await createImageCache(source, info);
        return isPub && ipcRenderer.sendTo(remote.getCurrentWebContents().id, "compress-end", data);
    };

    onReceiveMoments = async (data) => {
        const { content } = data;
        try {
            const { sequence } = JSON.parse(content);
            if (!sequence) return;
            receiveFromWS(sequence);
        } catch (e) {
            console.log(e);
            //
        }
    };

    handleLogout = () => {
        sessionStorage.clear();
        clearCache(); // clear
        ipcRenderer.send("do-login");
        ipcRenderer.send("lightBox_close");
        this.setState({
            loginFlag: false,
        });
    };

    handleForceOffline = (source) => {
        const {
            intl: { formatMessage },
            shouldUseDarkColors,
        } = this.props;

        const now = moment().format("hh:mm");

        try {
        } catch (e) {
            console.error(e);
        }
    };

    handleNewFriend = (source) => {
        try {
            const { data } = new AgreeAddFriend(source);
            let { operator, target = [] } = data.content;

            if (typeof target === "string") target = [target];

            if (operator !== userModel._id && target.includes(userModel._id)) {
                getUserListInfo([operator]);
                return memberModel.updateMemberInfo(operator, { isFriend: FriendsStatus.friends });
            }
            if (operator === userModel._id) {
                target.forEach((id) =>
                    memberModel.updateMemberInfo(id, { isFriend: FriendsStatus.friends })
                );
            }
        } catch (e) {
            console.error(e);
        }
    };

    initDragAction() {
        if (window.process && window.process.platform != "darwin") {
            document.body.classList.add("isWin");
        }
        window.ondragover = (e) => {
            // If not st as 'copy', electron will open the drop file
            e.dataTransfer.dropEffect = "copy";
            // e.preventDefault();
            e.preventDefault();
            return false;
        };
    }

    onMsgReceive = async (data) => {
        const { sequence, chat_id, type, content } = data;
        if (
            type === MessageType.IntlTemplateMessage &&
            IntlTemplateGroupInfo.includes(JSON.parse(content).temId) &&
            isGroup(chat_id)
        ) {
            getGroupInfos([chat_id]);
            if (IntlTemplateGroupInfo.find((item) => item === JSON.parse(content).temId)) {
                const groupInfo = await groupInfoModel.getGroupInfo(chat_id);
                const noticeId = encryptSha1(groupInfo.notice);
                getGroupNotice(chat_id, noticeId);
            }
        }
        if (type === MessageType.DeleteSession) {
            const chatid = JSON.parse(content).chatid;
            // await quitGroup(chatid, true);
            session.deleteSession(chatid);
            if (session.focusSessionId === chatid) sessionBoardStore.close();
            if (session.focusSessionId === chatid && !chat.alreadyKicked) chat.alreadyKicked = true;
            const res = await clearChatMessage(chatid);
            if (res) await chat.clearMessage(chatid);
        }
        if (sequence === undefined) return;
        await pull(sequence);
    };

    onFriendApply = () => {
        this.props.updateApplyFriendMsgState(true);
    };

    onMuteUpdate = (data) => {
        const { content } = data;
        try {
            const { chat_ids: chatIds } = JSON.parse(content);
            const { s, g } = groupChats(chatIds.map((id) => ({ chatId: id })));
            if (s && s.length) {
                setMuteUpdateUnread(s, false);
            }

            if (g && g.length) {
                setMuteUpdateUnread(g, true);
            }
        } catch (e) {
            console.log(e);
            //
        }
    };
    onTopUpdate = (data) => {
        const { content } = data;
        try {
            const { chat_id: chatId, is_top: isTop } = JSON.parse(content);
            chatModel.updateSessionByChatId(chatId, {
                isTop: isTop,
                stickActionTime: Date.now(),
            });
        } catch (error) {
            console.log(error);
        }
    };

    isMac() {
        return navigator.platform === "Win32" || navigator.platform === "Windows";
    }

    loginSuccess() {
        if (!isDev) this.props.history.replace("/");
        this.setState({
            loginFlag: true,
        });
        ipcRenderer.send("logined");
    }

    render() {
        const { location } = this.props;
        let { loginFlag } = this.state;
        return (
            <Fragment>
                {!loginFlag ? (
                    <Login onlogin={this.loginSuccess.bind(this)} />
                ) : (
                    <div>
                        <header className={classes.header}>
                            <Header />
                        </header>
                        <div className={clazz(classes.container)} ref="viewport">
                            <aside className={classes.nav}>
                                <LeftNav location={location} />
                            </aside>

                            <article className={classes.content}>{this.props.children}</article>
                        </div>

                        <ForwardMoments />
                        <TmmPickerBoard />
                    </div>
                )}

                <InitLoadingModal />
            </Fragment>
        );
    }
}

export default injectIntl(withRouter(Layout));
