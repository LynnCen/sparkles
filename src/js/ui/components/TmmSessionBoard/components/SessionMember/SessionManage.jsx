import React, { Component } from "react";
import { observer } from "mobx-react";
import { sessionBoardStore } from "components/TmmSessionBoard/sessionBoardStore";
import styles from "./styles.less";
import { injectIntl } from "react-intl";
import MemberItem from "./Member";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { BackIcon2, RightArrowBolder, ContactsAdd } from "../../../../icons";
import classNames from "classnames";
import localeFormat from "utils/localeFormat";
import session from "../../../../stores_new/session";
import { isGroup } from "@newSdk/utils";
import addAdminInGroup from "utils/chatController/addAdminInGroup";
import { GroupAdmin, GroupOwner } from "../../../../icons";
@observer
export class SessionManage extends Component {
    renderFullHeader = () => {
        const { intl } = this.props;
        return (
            <section className={styles.fullHead}>
                <div className={styles.back}>
                    <span className={styles.backIcon} onClick={sessionBoardStore.closeAllMembers}>
                        <BackIcon2 />
                    </span>
                    <span className={styles.title}>{localeFormat({ id: "mp_group_ma" })}</span>
                </div>
            </section>
        );
    };
    renderIcon = (memberUid) => {
        const { uid: ownerUid } = sessionBoardStore.ownerInfo;
        if (memberUid === ownerUid) {
            return <GroupOwner />;
        } else {
            const admin = sessionBoardStore.adminsInfo.find(({ uid }) => memberUid === uid);
            if (admin) return <GroupAdmin />;
        }
        return;
    };

    render() {
        const { intl } = this.props;
        const { focusSessionId } = session;
        const group = isGroup(focusSessionId);
        if (!group) return null;
        return (
            <section
                className={classNames(styles.box, {
                    [styles.full]: sessionBoardStore.viewSubList,
                })}
            >
                {this.renderFullHeader()}

                <div
                    className={classNames(styles.row, styles.addMember)}
                    onClick={() => addAdminInGroup(session.focusSessionId)}
                >
                    <div className={styles.addIcon}>
                        <ContactsAdd />
                    </div>
                    <span className={styles.name}>
                        {intl.formatMessage({ id: "mp_group_ma_add" })}
                    </span>
                </div>
                {sessionBoardStore.sortManageList.map((uid) => {
                    const Icon = this.renderIcon(uid);
                    return (
                        <MemberItem
                            key={uid}
                            uid={uid}
                            removeAble={
                                sessionBoardStore.ownerInfo.uid === tmmUserInfo._id &&
                                uid !== tmmUserInfo._id
                            }
                            Icon={Icon}
                        />
                    );
                })}
            </section>
        );
    }
}

export default injectIntl(SessionManage);
