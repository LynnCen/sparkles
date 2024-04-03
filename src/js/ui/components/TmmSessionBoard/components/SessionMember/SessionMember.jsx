import React, { Component } from "react";
import { observer } from "mobx-react";
import { sessionBoardStore, SessionTab } from "components/TmmSessionBoard/sessionBoardStore";
import styles from "./styles.less";
import { injectIntl } from "react-intl";
import MemberItem from "./Member";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { BackIcon2, RightArrowBolder, ContactsAdd } from "../../../../icons";
import classNames from "classnames";
import TmmSearch from "components/TmmSearch/TmmSearch";
import session from "../../../../stores_new/session";
import { isGroup } from "@newSdk/utils";
import addMemberInGroup from "utils/chatController/addMemberInGroup";
import { GroupAdmin, GroupOwner } from "../../../../icons";
import localeFormat from "utils/localeFormat";
@observer
export class SessionMember extends Component {
    timer = null;

    state = {
        search: "",
    };

    handleSearch = (val) => {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.setState({ search: val });
        }, 244);
    };
    removeAble = (currentUid) => {
        const { ownerInfo, adminsInfo } = sessionBoardStore;
        const isAdmin = adminsInfo.find(({ uid }) => uid === currentUid);
        const isOwner = ownerInfo.uid === tmmUserInfo._id;
        const isMe = currentUid === tmmUserInfo._id;
        const isCurrentOwner = currentUid === ownerInfo.uid;
        const isCurrentAdmin = adminsInfo.find(({ uid }) => uid === tmmUserInfo._id);
        if (isOwner && !isMe) return true;
        if (isCurrentAdmin && !isMe && !isCurrentOwner && !isAdmin) return true;
        // if (isAdmin && isMe && !isOwner) return false;
        return false;
    };
    renderSmallHead = () => {
        const { intl } = this.props;
        return (
            <div className={styles.head}>
                <strong className={styles.count}>
                    {sessionBoardStore.sortedList.length} {localeFormat({ id: "mp_member" })}
                </strong>
                {/*{sessionBoardStore.sortedList.length > 6 && (*/}
                <aside
                    className={styles.showMore}
                    onClick={() => sessionBoardStore.viewAllMembers(SessionTab.AllMember)}
                >
                    {intl.formatMessage({ id: "MoreMembers" })}

                    <span className={styles.arr}>
                        <RightArrowBolder />
                    </span>
                </aside>
                {/*)}*/}
            </div>
        );
    };

    renderFullHeader = () => {
        const { intl } = this.props;
        return (
            <section className={styles.fullHead}>
                <div className={styles.back}>
                    <span className={styles.backIcon} onClick={sessionBoardStore.closeAllMembers}>
                        <BackIcon2 />
                    </span>
                    <span className={styles.title}>{intl.formatMessage({ id: "mp_member" })}</span>
                </div>

                <div className={styles.search}>
                    <TmmSearch handleChange={this.handleSearch} />
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
        const { search } = this.state;
        const { focusSessionId } = session;
        const group = isGroup(focusSessionId);
        if (!group) return null;

        return (
            <section
                className={classNames(styles.box, {
                    [styles.full]: sessionBoardStore.viewSubList === SessionTab.AllMember,
                })}
            >
                {sessionBoardStore.viewSubList === SessionTab.AllMember
                    ? this.renderFullHeader()
                    : this.renderSmallHead()}

                <div
                    className={classNames(styles.row, styles.addMember)}
                    onClick={() => addMemberInGroup(session.focusSessionId)}
                >
                    <div className={styles.addIcon}>
                        <ContactsAdd />
                    </div>
                    <span className={styles.name}>{intl.formatMessage({ id: "addMember" })}</span>
                </div>
                {sessionBoardStore.sortedList.map((uid) => {
                    const Icon = this.renderIcon(uid);
                    return (
                        <MemberItem
                            key={uid}
                            uid={uid}
                            searching={search}
                            removeAble={
                                this.removeAble(uid)
                                // sessionBoardStore.ownerInfo.uid === tmmUserInfo._id &&
                                // uid !== tmmUserInfo._id
                            }
                            Icon={Icon}
                        />
                    );
                })}
            </section>
        );
    }
}

export default injectIntl(SessionMember);
