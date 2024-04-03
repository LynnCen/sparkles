import classNames from "classnames";
import styles from "./styles.less";
import Avatar from "components/Avatar";
import React, { Component } from "react";
import contactsStore from "../../../stores";
import { observer } from "mobx-react";
import userProxy from "../../../../../stores_new/userProxy";
import moment from "moment";
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from "react-intl";
import { getNameWeight } from "utils/nameWeight";
import { userStatus } from "@newSdk/consts/userStatus";
import getUserList from "@newSdk/service/api/getUserListInfo";
const AvatarSize = 32;

@observer
export class Item extends Component {
    componentDidMount() {
        const { type, id } = this.props;
        if (type === contactsStore.TabEnum.newFriend) {
            userProxy.getUserInfo(id);
        }
    }

    handleView = () => {
        const { type, id, createTime } = this.props;
        contactsStore.setFocusItem(type, id, createTime);
        if (type === contactsStore.TabEnum.contacts) {
            getUserList([id]);
        }
    };

    renderRowContent = () => {
        const { type, memberCount, id, name, createTime, status } = this.props;
        const userInfo = userProxy.getProxyUserBaseInfo(id);

        const fullName = getNameWeight({
            friendAlias: userInfo.friendAlias,
            name: userInfo.name ? userInfo.name : name,
            uid: userInfo.uid,
            status: userInfo.status,
        });
        if (type === contactsStore.TabEnum.newFriend) {
            let isExpired;
            isExpired = moment.duration(moment().diff(moment(createTime))).asDays() >= 7;
            // status =

            return (
                <div className={styles.friendReq} style={{ width: `calc(100% - ${AvatarSize}px)` }}>
                    <span className={styles.id}>
                        <span className={styles.name}>{fullName}</span>
                        <span className={styles.status}>
                            {userInfo.status == userStatus.Deleted ? null : isExpired ? (
                                <FormattedMessage id={"Expired"} />
                            ) : status === 1 ? (
                                <FormattedMessage id={"Added"} />
                            ) : (
                                ""
                            )}
                        </span>
                    </span>
                    <span className={styles.time}>
                        <FormattedDate value={createTime} />{" "}
                        <FormattedTime hour12={false} value={createTime} />
                    </span>
                </div>
            );
        }

        return (
            <div className={styles.infoWarp} style={{ width: `calc(100% - ${AvatarSize}px)` }}>
                <span className={styles.id}>{fullName}</span>
                {memberCount ? <span className={styles.count}>({memberCount})</span> : null}
            </div>
        );
    };

    render() {
        let { src = "", type = "", id } = this.props;

        const { newFriend } = contactsStore.TabEnum;
        if (type === newFriend) {
            const userInfo = userProxy.getProxyUserBaseInfo(id);
            src = userInfo.avatarPath;
        }

        return (
            <section
                className={classNames(styles.lineItem, styles.hover, {
                    // [styles.active]: active,
                })}
                onClick={this.handleView}
            >
                <Avatar src={src} size={AvatarSize} />
                {this.renderRowContent()}
            </section>
        );
    }
}

export default injectIntl(Item);
