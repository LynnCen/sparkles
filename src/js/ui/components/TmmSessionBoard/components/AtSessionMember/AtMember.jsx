import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styles from "./styles.less";
import Avatar from "components/Avatar";
import { getNameWeight } from "utils/nameWeight";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { userStatus } from "@newSdk/consts/userStatus";
/**
 * @typedef { Object } IProps
 * @property { string } uid
 * @property { boolean } removeAble
 */
const refs = React.createRef();
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
    componentDidMount() {
        this.beforeGetInfo();
        if (refs.current) refs.current.addEventListener("click", this.handleClick);
    }

    beforeGetInfo = async () => {
        const { proxyUserInfoInGroup, focusSessionId } = this.props;
        if (focusSessionId) await proxyUserInfoInGroup(tmmUserInfo._id, focusSessionId);
    };
    getInfo = () => {
        const { getProxyUserInfoInGroup, focusSessionId, uid } = this.props;
        const info = getProxyUserInfoInGroup(focusSessionId, uid);
        const name = getNameWeight({
            friendAlias: info.friendAlias,
            alias: info.alias,
            name: info.name,
            uid: info.uid,
            status: info.status,
        });
        return {
            info,
            name,
        };
    };
    handleClick = () => {
        const { hanldeAtMember, uid } = this.props;
        const { name } = this.getInfo();
        hanldeAtMember(uid, name);
    };

    render() {
        const { info, name } = this.getInfo();
        return info.status == userStatus.Deleted ? null : (
            <div className={styles.atRow} ref={refs}>
                <div className={styles.avatar}>
                    <Avatar src={info.avatarPath} size={24} />
                </div>
                <span className={styles.name}>{name}</span>
            </div>
        );
    }
}

export default MemberItem;
