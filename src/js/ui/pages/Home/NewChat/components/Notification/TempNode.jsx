import { MessageErrorIcon } from "../../../../../icons";
import React, { Component, Fragment, useEffect, useState } from "react";
import UserCard from "components/UserInfo";
import { injectIntl } from "react-intl";
import memberModel from "@newSdk/model/Members";
import styles from "../../style.less";
import { inject } from "mobx-react";

/**
 * @Author Pull
 * @Date 2021-07-15 11:36
 * @project tempNode
 */

const TempNodeEnum = {
    error: "error",
    notFriends: "notFriends",
};

// export const TempNode = ({ message, intl }) => {
//     const [userInfo, setUserInfo] = useState(null);
//     const { extra = {} } = message;
//     const { type } = extra;
//
//     useEffect(() => {
//         console.log("-->", extra.uid);
//         type === TempNodeEnum.notFriends && memberModel.getMemberById(extra.uid).then(setUserInfo);
//     }, []);
//
//     if (type === TempNodeEnum.error) {
//         return (
//             <section className={styles.textNotification}>
//                 <MessageErrorIcon />
//                 {extra.message}
//             </section>
//         );
//     }
//
//     if (type === TempNodeEnum.notFriends && userInfo) {
//         const { messages } = intl;
//         const { notFriendsTip, sendFriendReq } = messages;
//         const strArr = notFriendsTip.split("{sendFriendReq}");
//
//         return (
//             <section className={styles.textNotification}>
//                 {strArr[0]} &nbsp;
//                 <UserCard noAvatar uid={extra.uid} placement="left" userInfo={userInfo}>
//                     <span style={{ color: "#0bcade", cursor: "pointer" }}>[{sendFriendReq}]</span>
//                 </UserCard>
//                 &nbsp; {strArr[1]}
//             </section>
//         );
//     }
//
//     return null;
// };

@inject((stores) => ({
    proxyUserBaseInfo: stores.UserProxyEntity.getUserInfo,
    getProxyUserInfo: stores.UserProxyEntity.getProxyUserBaseInfo,
}))
export class TempNode extends Component {
    componentDidMount() {}

    initFriends() {
        const { message, proxyUserBaseInfo } = this.props;
        const { extra = {} } = message;
        const { type } = extra;
        if (type === TempNodeEnum.notFriends) {
            proxyUserBaseInfo(extra.uid);
        }
    }

    render() {
        const { message, intl, getProxyUserInfo } = this.props;
        const { extra = {} } = message;
        const { type } = extra;

        if (type === TempNodeEnum.error) {
            return (
                <section className={styles.textNotification}>
                    <MessageErrorIcon />
                    {extra.message}
                </section>
            );
        }

        if (type === TempNodeEnum.notFriends) {
            const { messages } = intl;
            const { notFriendsTip, sendFriendReq } = messages;
            const strArr = notFriendsTip.split("{sendFriendReq}");
            const userInfo = getProxyUserInfo(extra.uid);

            return (
                <section className={styles.textNotification}>
                    {strArr[0]} &nbsp;
                    <UserCard noAvatar uid={extra.uid} placement="left" userInfo={userInfo}>
                        <span style={{ color: "#0bcade", cursor: "pointer" }}>
                            [{sendFriendReq}]
                        </span>
                    </UserCard>
                    &nbsp; {strArr[1]}
                </section>
            );
        }

        return null;
    }
}

export default injectIntl(TempNode);
