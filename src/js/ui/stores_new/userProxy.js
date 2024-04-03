import { action, observable, computed } from "mobx";
import { decThrottle } from "utils/descriptor";
import membersModel from "@newSdk/model/Members";
import { getMemberInfoByIdWithThrottle } from "@newSdk/logic/session/getMemberInfoByIdWithThrottle";
import GroupMembers from "@newSdk/model/GroupMembers";
import fetchGroupMemberInfoBulk from "@newSdk/logic/contacts/fetchGroupMemberInfoBulk";
import nc from "@newSdk/notification";
import Members from "@newSdk/model/Members";
import { trimAndDropEmpty } from "@newSdk/utils";
const desGroupMemberThrottle = (timeout = 66) => {
    let pendingMap = {};
    let throttleTimer = null;

    return (target, _s, descriptor) => {
        const nativeCall = descriptor.value;

        descriptor.value = (ids, gid) => {
            if (!ids || !gid) return;
            if (typeof ids === "string") ids = [ids];
            if (!ids || !ids.length) return;
            if (throttleTimer) clearTimeout(throttleTimer);

            const groupSet = pendingMap[gid] || new Set();
            ids.forEach((uid) => groupSet.add(uid));
            pendingMap[gid] = groupSet;
            throttleTimer = setTimeout(() => {
                throttleTimer = null;
                nativeCall(pendingMap);
                pendingMap = {};
            }, timeout);
        };
    };
};

class UserProxy {
    @observable userInfo = {};
    @observable groupMemberInfo = {};

    constructor() {
        nc.on(Members.Event.MemberInfoChanged, this.setUserInfo);
        nc.on(GroupMembers.Event.MemberInfoChanged, this.setGroupMemberInfo);
    }

    userInfoTransform(dbUserModal) {
        if (!dbUserModal) return {};
        const {
            id,
            tmm_id,
            isSetTmmId,
            phone,
            // avatar,
            name,
            // firstName,
            // lastName,
            fromWay,
            isFriend,
            friendAlias,
            gender,
            regionId,
            signature,
            avatarPath,
            status,
        } = dbUserModal;
        return trimAndDropEmpty({
            uid: id,
            tmm_id,
            isSetTmmId,
            phone,
            name,
            gender,
            regionId,
            signature,
            avatarPath,
            fromWay,
            isFriend,
            friendAlias,
            status,
        });
    }

    userInGroupInfoTransform(dbUserModal, dbGroupMemberModal) {
        const user = self.userInfoTransform(dbUserModal);
        const { id, uid, gid, isAdmin, isOwner, alias, createTime, deleted } = dbGroupMemberModal;

        // 这里 groupMember 中的id会覆盖 user 中的id。
        // group 的 id 为，group的数据id，
        // user 的 id 为，用户id
        // group 的 uid === user，id
        return trimAndDropEmpty({
            ...user,
            id,
            uid,
            gid,
            isAdmin,
            isOwner,
            alias,
            createTime,
            deleted,
        });
    }

    @computed get getProxyUserBaseInfo() {
        const info = self.userInfo;

        return (uid) => info[uid] || {};
    }

    @computed get getProxyUserInGroupInfo() {
        const info = self.groupMemberInfo;
        const baseInfo = self.userInfo;
        return (gid, uid) => {
            const gKey = self.getGroupMemberKey(gid, uid);
            const groupInfo = info[gKey] || {};
            const base = baseInfo[uid] || {};
            const gInfo = self.userInGroupInfoTransform(base, groupInfo);
            return gInfo || {};
        };
    }

    @action setUserInfo(members) {
        const ob = {};
        members.forEach((item) => (ob[item.id] = self.userInfoTransform(item)));

        self.userInfo = {
            ...self.userInfo,
            ...ob,
        };
    }

    @action setGroupMemberInfo(groupMembers, gid) {
        groupMembers.forEach((m) => {
            const { uid } = m;

            const key = self.getGroupMemberKey(gid, uid);
            self.groupMemberInfo[key] = m;
        });
    }

    @decThrottle(66) // --> uids
    async getUserInfo(uids) {
        if (!uids || !uids.length) return;

        // 当前 store 中未存在的
        const ids = uids.filter((id) => !self.userInfo[id]);

        // 设置初始值
        ids.forEach((id) => (self.userInfo[id] = {}));

        const members = await membersModel.getMemberByIds(ids);

        // 服务端同步缺失数据
        if (members.length !== ids.length) {
            const existIds = members.map((item) => item.id);
            const unExistIds = uids.filter((uid) => !existIds.includes(uid));
            getMemberInfoByIdWithThrottle(unExistIds);
        }

        self.setUserInfo(members);
    }

    // -------------------------------------------------------------------------------->>>>

    getGroupMemberKey(gid, uid) {
        return `${gid}_${uid}`;
    }

    /**
     * @param uid
     * @param gid
     * @return {Promise<void>}
     */
    @desGroupMemberThrottle(66) // {key: set}
    async getUserInfoInGroup(groups) {
        Object.entries(groups).forEach(([gid, idSet]) => {
            self._handleGetGroupMemberInfo(gid, Array.from(idSet));
        });
    }

    async _handleGetGroupMemberInfo(gid, uids) {
        const list = uids.filter((id) => {
            const key = self.getGroupMemberKey(gid, id);

            // 已存在
            if (self.groupMemberInfo[key]) return false;
            else {
                self.groupMemberInfo[key] = {};
                return true;
            }
        });

        if (!list.length) return;

        const infos = await GroupMembers.getBulkGroupMember(gid, list);
        if (infos.length < list.length) {
            // fetch on remote;
            const existIds = infos.map((item) => item.uid);
            const unExistIds = list.filter((uid) => !existIds.includes(uid));
            fetchGroupMemberInfoBulk(gid, unExistIds);
        }

        self.setGroupMemberInfo(infos, gid);
    }

    // ----------------------------------------------------------->>>>
    @action
    clearCache() {
        self.userInfo = {};
        self.groupMemberInfo = {};
    }
}

const self = new UserProxy();

export const UserProxyEntity = self;
export default self;

//
