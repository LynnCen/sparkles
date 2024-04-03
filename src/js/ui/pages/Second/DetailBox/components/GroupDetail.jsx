import React, { Component } from "react";
import styles from "./styles.less";
import { observer } from "mobx-react";
import GroupMembers from "@newSdk/model/GroupMembers";
import contactsStore from "../../stores";
import nc from "@newSdk/notification";
import classNames from "classnames";
import { ContactsAdd, GroupAdmin, GroupOwner } from "../../../../icons";
import userProxy from "../../../../stores_new/userProxy";
import Avatar from "components/Avatar";
import addMemberInGroup from "utils/chatController/addMemberInGroup";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { MinusCircleOutlined } from "@ant-design/icons";
import removeMemberInGroup from "utils/chatController/removeMemberInGroup";
import { getNameWeight } from "utils/nameWeight";
import { userStatus } from "@newSdk/consts/userStatus";
@observer
export class GroupDetail extends Component {
    state = {
        groupMembers: [],
        removeAble: false,
    };

    componentDidMount() {
        this.fetchGroupMembers();
        nc.on(GroupMembers.Event.MemberInfoChanged, this.handleInfoChange);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.gid !== prevProps.gid) {
            this.fetchGroupMembers();
        }
    }

    componentWillUnmount() {
        nc.off(GroupMembers.Event.MemberInfoChanged, this.handleInfoChange);
    }

    fetchGroupMembers() {
        const { gid } = this.props;
        if (gid) {
            GroupMembers.getGroupMembers(gid, true).then((list) => {
                // const sortedList = this.sortedList(list);
                const sortedList = list.sort((a, b) => {
                    // owner first
                    if (a.isOwner) return -1;
                    if (b.isOwner) return 1;

                    // admin second
                    if (a.isAdmin && !b.isAdmin) return -1;
                    if (b.isAdmin && !a.isAdmin) return 1;
                    if (a.isAdmin && b.isAdmin) return a.adminTime - b.adminTime;
                    // sort by join time
                    return a.createTime - b.createTime;
                });
                this.proxyMemberInfo(sortedList);
                this.setState({ groupMembers: sortedList });
            });
        }
    }

    async proxyMemberInfo(list) {
        let removeAble = false;
        const { gid } = this.props;
        let uids = [];
        // const owner = list.find(({ isOwner }) => isOwner);
        // console.log(owner);
        list.forEach(({ uid, gid, isOwner, isAdmin }) => {
            // const isCurrentOwner = owner.uid ===uid;
            if (isOwner && uid === tmmUserInfo._id) removeAble = true;
            // if (isOwner) removeAble = false;
            if (isAdmin && uid === tmmUserInfo._id) removeAble = true;
            // // uids.push(uid);
        });

        // this.getGroupUserInfo(uids);

        this.setState({ removeAble });
    }
    removeAble = (currentUid) => {
        const { groupMembers } = this.state;
        if (!groupMembers) return false;
        const adminsInfo = groupMembers.filter(({ isAdmin }) => isAdmin) || [];
        const ownerInfo = groupMembers.find(({ isOwner }) => isOwner) || {};
        const isAdmin = adminsInfo.find(({ uid }) => uid === currentUid);
        const isOwner = ownerInfo.uid === tmmUserInfo._id;
        const isMe = currentUid === tmmUserInfo._id;
        const isCurrentOwner = currentUid === ownerInfo.uid;
        const isCurrentAdmin = adminsInfo.find(({ uid }) => uid === tmmUserInfo._id);
        if (isOwner && !isMe) return true;
        if (isCurrentAdmin && !isMe && !isCurrentOwner && !isAdmin) return true;
        return false;
    };
    getGroupUserInfo = async () => {
        const { gid } = this.props;
        const { groupMembers } = this.state;
        let uids = [];
        groupMembers.forEach(({ uid, gid, isOwner }) => {
            uids.push(uid);
        });
        await userProxy.getUserInfo(uids);
        await userProxy.getUserInfoInGroup(uids, gid);
    };
    handleInfoChange = (members, gid) => {
        const { gid: g } = this.props;
        const { groupMembers } = this.state;
        if (g === gid) {
            const _list = [];
            let cursor = 0;
            const groupBy = _.keyBy(members, "uid");
            groupMembers.forEach((item) => {
                const newProps = groupBy[item.uid];

                if (newProps) {
                    if (!newProps.deleted) {
                        _list[cursor++] = { ...item, ...newProps };
                    }

                    delete groupBy[item.uid];
                } else {
                    _list[cursor++] = item;
                }
            });

            Object.values(groupBy).forEach((item) => {
                if (!item.deleted) {
                    _list[cursor++] = item;
                }
            });
            const sortedList = this.sortGroupMembers(_list);
            this.setState({
                groupMembers: sortedList,
            });
        }
    };
    sortGroupMembers = (list) => {
        return list.sort((a, b) => {
            // owner first
            if (a.isOwner) return -1;
            if (b.isOwner) return 1;

            // admin second
            if (a.isAdmin && !b.isAdmin) return -1;
            if (b.isAdmin && !a.isAdmin) return 1;
            if (a.isAdmin && b.isAdmin) return a.adminTime - b.adminTime;
            // sort by join time
            return a.createTime - b.createTime;
        });
    };
    renderIcon = (member) => {
        if (member.isOwner) return <GroupOwner />;
        if (member.isAdmin) return <GroupAdmin />;
    };

    render() {
        const { groupMembers, removeAble } = this.state;
        const total = groupMembers.length;
        this.getGroupUserInfo();
        return (
            <section className={styles.groupCard}>
                <article className={styles.inner}>
                    <aside className={styles.title}>{`${total} Members`}</aside>
                    <aside className={styles.groupMembersWrraper}>
                        <aside
                            className={classNames(styles.row)}
                            onClick={() => addMemberInGroup(this.props.gid)}
                        >
                            <div className={styles.addIcon}>
                                <ContactsAdd />
                            </div>
                            Add Members
                        </aside>

                        {groupMembers.map((item) => {
                            const Icon = this.renderIcon(item);
                            return (
                                <RowItem
                                    key={item.id}
                                    uid={item.uid}
                                    gid={item.gid}
                                    removeAble={this.removeAble(item.uid)}
                                    Icon={Icon}
                                />
                            );
                        })}
                    </aside>
                </article>
            </section>
        );
    }
}

@observer
class RowItem extends Component {
    handleRemove = () => {
        const { uid, gid } = this.props;
        const info = userProxy.getProxyUserInGroupInfo(gid, uid);
        const name =
            getNameWeight({
                friendAlias: info.friendAlias,
                alias: info.alias,
                name: info.name,
                uid: info.uid,
                status: info.status,
            }) || info.tmm_id;
        removeMemberInGroup(gid, name, uid);
    };

    render() {
        const { uid, gid, removeAble, Icon } = this.props;
        const info = userProxy.getProxyUserInGroupInfo(gid, uid);
        return !removeAble && info.status == userStatus.Deleted ? null : (
            <section className={styles.row}>
                <div className={styles.avatar}>
                    <Avatar size={36} src={info.avatarPath} Icon={Icon} />
                </div>
                <span>
                    {getNameWeight({
                        friendAlias: info.friendAlias,
                        alias: info.alias,
                        name: info.name,
                        uid: info.uid,
                        status: info.status,
                    }) || info.tmm_id}
                </span>

                {removeAble && uid !== tmmUserInfo._id && (
                    <aside className={styles.removeMember} onClick={this.handleRemove}>
                        <MinusCircleOutlined />
                    </aside>
                )}
            </section>
        );
    }
}

export default GroupDetail;
