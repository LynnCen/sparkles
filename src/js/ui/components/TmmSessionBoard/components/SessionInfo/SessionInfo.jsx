import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styles from "./styles.less";
import Avatar from "components/Avatar";
import { isGroup, isMe } from "@newSdk/utils";
import EditInput from "components/TmmSessionBoard/components/SessionInfo/EditInput";
import updateGroupName from "@newSdk/service/api/group/updateGroupName";
import { chatNameLimitLen } from "utils/chatController/createGroup";
import { message } from "antd";
import localeFormat from "utils/localeFormat";
import GroupAvatarMask from "./GroupAvatarMask";
import { sessionBoardStore, SessionTab } from "../../sessionBoardStore";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { getNameWeight } from "utils/nameWeight";

@inject((stores) => ({
    getSessionInfo: stores.SessionInfoProxy.getSessionInfo,
    sessionInfoProxy: stores.SessionInfoProxy.sessionInfoProxy,
    focusSessionInfo: stores.NewSession.focusSessionInfo,
    focusSessionId: stores.NewSession.focusSessionId,
}))
@observer
export class SessionInfo extends Component {
    componentDidMount() {
        const { focusSessionInfo, getSessionInfo, focusSessionId } = this.props;
        getSessionInfo(focusSessionId);
    }

    handleUpdateGroupName = async (name) => {
        const { focusSessionInfo, focusSessionId } = this.props;
        if (name.length > chatNameLimitLen) name = name.slice(0, chatNameLimitLen - 2) + "...";
        const res = await updateGroupName(focusSessionId, name);

        if (res) message.success(localeFormat({ id: "EditSuccessful" }));
        else message.warn(localeFormat({ id: "EditFailed" }));

        return res;
    };
    editAble = () => {
        const { ownerInfo, adminsInfo } = sessionBoardStore;
        if (
            ownerInfo.uid === tmmUserInfo._id ||
            adminsInfo.find(({ uid }) => uid === tmmUserInfo._id)
        )
            return true;
        return false;
    };
    viewEdit = () => {
        const { focusSessionInfo, focusSessionId } = this.props;
        if (isGroup(focusSessionId)) sessionBoardStore.viewAllMembers(SessionTab.Edit);
    };
    render() {
        const { sessionInfoProxy, focusSessionInfo, focusSessionId } = this.props;
        const info = { ...focusSessionInfo, ...sessionInfoProxy(focusSessionId) };
        const group = isGroup(focusSessionId);
        const userName = getNameWeight({
            name: info.name,
            friendAlias: info.friendAlias,
            status: info.status,
        });

        return (
            <section className={styles.box}>
                <div className={styles.avatar} onClick={this.viewEdit}>
                    <Avatar src={info.avatar} size={64} />

                    {group && this.editAble() && (
                        <GroupAvatarMask gid={focusSessionId} editAble={false} />
                    )}
                </div>

                {group ? (
                    <div className={styles.name} onClick={this.viewEdit}>
                        <EditInput
                            value={info.name}
                            onPressEnter={this.handleUpdateGroupName}
                            isOwner={this.editAble()}
                        />
                    </div>
                ) : (
                    <p className={styles.name} title={userName} onClick={this.viewEdit}>
                        {userName}
                    </p>
                )}

                {info.signature && (
                    <p className={styles.sig} title={info.signature}>
                        {info.signature}
                    </p>
                )}
            </section>
        );
    }
}
export default SessionInfo;
