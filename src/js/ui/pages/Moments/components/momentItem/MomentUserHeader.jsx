/**
 * @Author Pull
 * @Date 2021-11-04 22:19
 * @project UserHeader
 */
import React, { Component, Fragment } from "react";
import Avatar from "components/Avatar";
import MomentFromNow from "components/MomentFromNow";
import { AuthType } from "@newSdk/model/moments/instance/MomentsNormalContent";
import { AuthIcon } from "../../constants/publishAuthOptions";
import MomentActions from "./actions/MomentActions";
import { inject } from "mobx-react";
import { ZHLangTy } from "../../../../../config";
import settings from "../../../../stores/settings";
import moment from "moment";
import classNames from "classnames/bind";
import styles from "./moments.module.less";
import { withRouter } from "react-router-dom";
import { HumanIcon } from "../../../../icons";
import localeFormat from "utils/localeFormat";
import { getNameWeight } from "utils/nameWeight";
const cx = classNames.bind(styles);
@inject(({ UserInfoProxy }) => ({
    proxyUserInfo: UserInfoProxy.proxyInfo,
}))
export class MomentUserHeader extends Component {
    formatTime = (timestamp) => {
        if (!timestamp) return "";
        // const CNFormat = "YYYY-MM-DD ah:mm";
        // const OFormat = "h:mm A YYYY/MM/DD";
        // if (ZHLangTy.includes(settings.locale)) {
        //     timeStr = moment(timestamp).format(CNFormat);
        //     timeStr = timeStr.replace("AM", "上午");
        //     timeStr = timeStr.replace("PM", "下午");
        // } else {
        //     timeStr = moment(timestamp).format(OFormat);
        // }

        const CNFormat = "YYYY-MM-DD HH:mm";
        const OFormat = "HH:mm YYYY/MM/DD";
        let timeStr = moment(timestamp).format(OFormat);
        return timeStr;
    };
    stopPropagation = (e) => e.stopPropagation();
    render() {
        const { momentInfo, fullTime, proxyUserInfo, history } = this.props;
        const { uid, id, sendTime, authType } = momentInfo;
        const userInfo = proxyUserInfo(uid) || {};
        return (
            <header className={cx("item-header")}>
                <article
                    className={cx("item-header-user")}
                    onClick={(e) => {
                        e.stopPropagation();
                        history.push(`/user/moments/${uid}/moments`);
                    }}
                >
                    <span onMouseDown={this.stopPropagation}>
                        <Avatar src={userInfo.avatarPath} size={24} />
                    </span>
                    <div className={cx("user-info")}>
                        <div className={cx("name-space")}>
                            <strong
                                className={cx("user-info-name", "dark-theme-color_lighter")}
                                onMouseDown={this.stopPropagation}
                            >
                                {getNameWeight({
                                    friendAlias: userInfo.friendAlias,
                                    alias: userInfo.alias,
                                    name: userInfo.name,
                                    uid: userInfo.uid,
                                    status: userInfo.status,
                                })}
                                {/* {userInfo.friendAlias || userInfo.name} */}
                            </strong>
                        </div>
                        <span
                            className={cx("user-info-time", "dark-theme-color_grey")}
                            onMouseDown={this.stopPropagation}
                        >
                            {fullTime ? (
                                this.formatTime(sendTime)
                            ) : (
                                <MomentFromNow timestamp={sendTime} />
                            )}
                            {authType !== AuthType.All && (
                                <Fragment>
                                    <span style={{ margin: "0 2px" }}>|</span>
                                    <span className={cx("user-non-public")}>
                                        {
                                            authType === AuthType.Private
                                                ? AuthIcon[authType]
                                                : AuthIcon[AuthType.Contacts]
                                            // <HumanIcon bodyStyle={{ marginRight: 6 }} />
                                        }
                                        {authType === AuthType.Private
                                            ? localeFormat({ id: "private" })
                                            : localeFormat({ id: "nonPublicise" })}
                                    </span>
                                </Fragment>
                            )}
                        </span>
                    </div>
                </article>
                <MomentActions momentInfo={momentInfo} />
            </header>
        );
    }
}

export default withRouter(MomentUserHeader);
