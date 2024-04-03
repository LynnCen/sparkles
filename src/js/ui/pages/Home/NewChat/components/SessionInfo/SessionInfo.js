/**
 * @Author Pull
 * @Date 2021-05-23 16:43
 * @project SessionMember
 */
import React, { Component } from "react";
import styles from "./styles.less";
import { inject, observer } from "mobx-react";
import Avatar from "components/Avatar";
import classNames from "classnames";
import {
    MessageTelephoneIcon,
    MessageCameraIcon,
    MoreAction,
    MessageScreenshot,
} from "../../../../../icons";
import { ipcRenderer } from "electron";
import { sessionBoardStore } from "components/TmmSessionBoard/sessionBoardStore";
import { getNameWeight } from "utils/nameWeight";
import { getSingleChatTarget } from "@newSdk/utils";
import GroupInfo from "@newSdk/model/GroupInfo";
import updateUserInfo from "@newSdk/logic/updateFriendsInfo";
import getGroupMemberIds from "@newSdk/service/api/group/getGroupMemberIds";

@inject((store) => ({
    focusSessionId: store.NewSession.focusSessionId,
    focusSessionInfo: store.NewSession.focusSessionInfo,
    alreadyKicked: store.NewChat.alreadyKicked,
    isGroupAlive: store.NewChat.isGroupAlive,
    getSessionInfo: store.SessionInfoProxy.getSessionInfo,
    sessionInfoProxy: store.SessionInfoProxy.sessionInfoProxy,
    isReadonlySession: store.NewSession.isReadonlySession,
}))
@observer
class SessionInfo extends Component {
    componentDidMount() {
        const { focusSessionId, isGroupAlive, getSessionInfo } = this.props;
        const isGroup = focusSessionId && focusSessionId.startsWith("g_");
        getSessionInfo(focusSessionId);
        if (isGroup) {
            isGroupAlive(focusSessionId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { focusSessionId, isGroupAlive, getSessionInfo } = this.props;
        const isGroup = focusSessionId && focusSessionId.startsWith("g_");

        if (prevProps.focusSessionId !== focusSessionId) {
            if (isGroup) isGroupAlive(focusSessionId);
            getSessionInfo(focusSessionId);
        }
    }

    handleScreenShot = () => ipcRenderer.send("start-capture");

    showSessionConfig = async () => {
        const { focusSessionInfo, focusSessionId } = this.props;
        if (focusSessionInfo.chatId) {
            GroupInfo.updateGroupInfoById(focusSessionInfo.chatId, {
                isNewNotice: false,
            });
        }
        const isGroup = focusSessionId && focusSessionId.startsWith("g_");
        if (isGroup) {
            sessionBoardStore.open();
            // const uids = await getGroupMemberIds(focusSessionId);
            // updateUserInfo(uids, { isInit: false });
        } else {
            sessionBoardStore.visible = true;
            // const userId = getSingleChatTarget(focusSessionId);
            // updateUserInfo([userId], { isInit: false });
        }
    };
    render() {
        const {
            focusSessionInfo,
            sessionInfoProxy,
            alreadyKicked,
            focusSessionId,
            isReadonlySession,
        } = this.props;
        const isGroup = focusSessionId && focusSessionId.startsWith("g_");
        const session = Object.assign({}, focusSessionInfo, sessionInfoProxy(focusSessionId));
        const sessionName = getNameWeight({
            name: session.name,
            friendAlias: session.friendAlias,
            status: session.status,
        });
        return (
            <article className={styles.container}>
                <div>
                    <Avatar avatar={session.avatar} size={24} />
                    <span className={styles.sessionName}>
                        <span className="electron_drag-disable">
                            {`${sessionName || ""}${
                                session.memberCount && !alreadyKicked
                                    ? ` (${session.memberCount || 0})`
                                    : ""
                            }`}
                        </span>
                    </span>
                </div>

                <section className={styles.actions}>
                    {[
                        {
                            t: "screenshot",
                            Icon: MessageScreenshot,
                            handler: this.handleScreenShot,
                            visible: true,
                        },

                        {
                            t: "call",
                            Icon: MessageTelephoneIcon,
                            handler: () => {},
                            visible: false,
                        },
                        {
                            t: "video",
                            Icon: MessageCameraIcon,
                            handler: () => {},
                            visible: false,
                        },
                        {
                            t: "more",
                            Icon: MoreAction,
                            handler: this.showSessionConfig,
                            visible: (!alreadyKicked || !isGroup) && !isReadonlySession,
                        },
                    ]
                        .filter((item) => item.visible)
                        .map(({ Icon, handler }, index) => (
                            <span className={classNames(styles.item)} onClick={handler} key={index}>
                                <Icon />
                            </span>
                        ))}
                </section>
            </article>
        );
    }
}

export default SessionInfo;
