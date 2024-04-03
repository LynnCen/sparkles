/**
 * @Author Pull
 * @Date 2021-11-03 17:14
 * @project UserInfo
 */

import React, { Component } from "react";
import { BackIcon2, MessageIcon } from "../../../icons";
import MomentsNotification from "../components/momentsNotification/MomentsNotification";
import Avatar from "components/Avatar";
import { inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./styles.less";
import { FriendsStatus } from "@newSdk/model/Members";
import tmmUserInfo from "@newSdk/model/UserInfo";
import localeFormat from "utils/localeFormat";
import { getNameWeight } from "utils/nameWeight";
const cx = classNames.bind(styles);

@inject(({ UserInfoProxy }) => ({
    proxyUserInfo: UserInfoProxy.proxyInfo,
    getBaseInfo: UserInfoProxy.getBaseInfo,
}))
export class UserInfo extends Component {
    componentDidMount() {
        this.props.getBaseInfo(this.props.uid);
    }

    render() {
        const { proxyUserInfo, uid, history, sendReq, chatWith, addFriend } = this.props;
        const userInfo = proxyUserInfo(uid);

        const isFriends = [FriendsStatus.friends].includes(userInfo.isFriend);
        return (
            <div>
                <section className={cx("background")}>
                    <img
                        draggable={false}
                        // src="https://pic2.zhimg.com/v2-4741af4c09cfc6d851613b18a4a12691_r.jpg"
                        src={userInfo.avatarPath}
                        alt=""
                    />
                    <aside className={cx("user-action")}>
                        <span className={cx("back")} onClick={history.goBack}>
                            <BackIcon2 bodyStyle={{ color: "var(--color-lighter)" }} />
                        </span>
                        <span>
                            <MomentsNotification count={19} overlayStyle={{ color: "#fff" }} />
                        </span>
                    </aside>
                </section>
                <section className={cx("user-info")}>
                    <span className={cx("user-avatar")}>
                        <Avatar size={100} src={userInfo.avatarPath} />
                    </span>
                    <span className={cx("user-name", "dark-theme-color_lighter")}>
                        {/* {userInfo.friendAlias || userInfo.name} */}
                        {getNameWeight({
                            friendAlias: userInfo.friendAlias,
                            alias: userInfo.alias,
                            name: userInfo.name,
                            uid: userInfo.uid,
                            status: userInfo.status,
                        })}
                    </span>
                    {userInfo.tmm_id && <span className={cx("user-str")}>@{userInfo.tmm_id}</span>}

                    {userInfo.signature && (
                        <span className={cx("user-sig", "dark-theme-color_lighter")}>
                            {userInfo.signature}
                        </span>
                    )}
                    {uid !== tmmUserInfo._id && !isFriends && (
                        <aside className={cx("send-message")} data-disable={sendReq}>
                            <MessageIcon
                                styleObj={{
                                    width: 16,
                                    height: 16,
                                    marginRight: 8,
                                    color: "var(--deep)",
                                }}
                            />
                            <span
                                className="dark-theme-color_deppDark"
                                // onClick={isFriends ? chatWith : addFriend}
                                onClick={addFriend}
                            >
                                {/*{isFriends ? "send message" : "add Friends"}*/}
                                {localeFormat({ id: "AddFriends" })}
                            </span>
                        </aside>
                    )}
                </section>
            </div>
        );
    }
}

export default withRouter(UserInfo);
