import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styles from "./styles.less";
import Avatar from "components/Avatar";
import { MinusCircleOutlined } from "@ant-design/icons";
import kickOutGroup from "@newSdk/service/api/group/kickOutGroup";
import ThemeModal from "components/Tmm_Ant/ThemeModal";
import delMessage from "@newSdk/service/api/message/delMessage";
import { message } from "antd";
import localeFormat from "utils/localeFormat";
import removeAdmainInGroup from "utils/chatController/removeAdmainInGroup";
import removeMemberInGroup from "utils/chatController/removeMemberInGroup";
import { getNameWeight } from "utils/nameWeight";
import { userStatus } from "@newSdk/consts/userStatus";
import { CameraIcon } from "../../../../icons";
import { sessionBoardStore, SessionTab } from "components/TmmSessionBoard/sessionBoardStore";
/**
 * @typedef { Object } IProps
 * @property { string } uid
 * @property { boolean } removeAble
 */

@inject((stores) => ({
    proxyUserBaseInfo: stores.UserProxyEntity.getUserInfo,
    proxyUserInfoInGroup: stores.UserProxyEntity.getUserInfoInGroup,
    getProxyUserInfoInGroup: stores.UserProxyEntity.getProxyUserInGroupInfo,
    focusSessionId: stores.NewSession.focusSessionId,
}))
/**
 * @extends {React.Component<IProps>}
 */
@observer
export class MemberItem extends Component {
    handleRemove = async () => {
        const { focusSessionId, getProxyUserInfoInGroup, uid } = this.props;
        const info = getProxyUserInfoInGroup(focusSessionId, uid);
        const name = getNameWeight({
            name: info.name,
            friendAlias: info.friendAlias,
            alias: info.alias,
            uid: info.uid,
            status: info.status,
        });
        if (sessionBoardStore.viewSubList === SessionTab.Manage) {
            const res = removeAdmainInGroup(focusSessionId, name, uid);
            return;
        }
        removeMemberInGroup(focusSessionId, name, uid);
    };

    render() {
        const {
            getProxyUserInfoInGroup,
            focusSessionId,
            uid,
            removeAble,
            searching = "",
            Icon,
        } = this.props;
        const info = getProxyUserInfoInGroup(focusSessionId, uid);
        const name = getNameWeight({
            friendAlias: info.friendAlias,
            alias: info.alias,
            name: info.name,
            uid: info.uid,
            status: info.status,
        });
        const wrapperstyle = {
            position: "relative",
            width: "100%",
            height: "100%",
        };

        /**
         *  kickOutGroup(self.groupId, selected)
         */
        const show = name.includes(searching);
        return !removeAble && info.status == userStatus.Deleted ? null : (
            <div className={styles.row} style={{ display: show ? "flex" : "none" }}>
                <div className={styles.avatar}>
                    <Avatar
                        wrapperstyle={wrapperstyle}
                        src={info.avatarPath}
                        size={36}
                        Icon={Icon}
                    />
                </div>
                <span className={styles.name}>{name}</span>

                {removeAble && (
                    <aside className={styles.removeMember} onClick={this.handleRemove}>
                        <MinusCircleOutlined />
                    </aside>
                )}
            </div>
        );
    }
}

export default MemberItem;
