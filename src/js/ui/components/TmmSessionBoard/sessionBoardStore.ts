import { action, computed, observable } from "mobx";
import groupMemberModel, { GroupMembers } from "@newSdk/model/GroupMembers";
import session from "../../stores_new/session";
import nc from "@newSdk/notification";
import { isGroup } from "@newSdk/utils";
import userProxy from "../../stores_new/userProxy";
export enum SessionTab {
    Home,
    AllMember,
    Manage,
    Edit,
}
class SessionBoardStore {
    @observable groupMemberMap: { [uid: string]: GroupMembers } = {};
    @observable visible: boolean = false;
    @observable viewSubList: number = 0;
    @observable viewAtList: boolean = false;

    constructor() {
        nc.on(groupMemberModel.Event.MemberInfoChanged, (members, gid) => {
            if (self && self.visible && gid === session.focusSessionId) {
                let _map: { [uid: string]: GroupMembers } = {};
                const keys = Object.keys(self.groupMemberMap);
                let uids: string[] = [];
                members.forEach((item: GroupMembers) => {
                    const { uid, gid, deleted } = item;
                    // if (deleted) delete self.groupMemberMap[uid];
                    uids.push(uid);
                    // _map[uid] = item;
                    if (deleted) {
                        delete self.groupMemberMap[uid];
                    } else {
                        _map[uid] = item;
                    }
                    // if (!keys.includes(uid)) {
                    //     uids.push(uid);
                    //     // self.proxyInfo(uid, gid);
                    //     _map[uid] = item;
                    // } else if (deleted) {
                    //     delete self.groupMemberMap[uid];
                    // }
                });
                self.proxyInfo(uids, gid);
                self.groupMemberMap = { ...self.groupMemberMap, ..._map };
            }
        });
    }

    @computed get ownerInfo() {
        return Object.values(self.groupMemberMap).find((item) => item.isOwner) || {};
    }

    @computed get adminsInfo() {
        return Object.values(self.groupMemberMap).filter((item) => item.isAdmin);
    }
    @computed get sortManageList() {
        const map = self.groupMemberMap;

        const sortedUid = Object.values(map)
            .filter((item: GroupMembers) => item.isOwner || item.isAdmin)
            .sort((a: GroupMembers, b: GroupMembers) => {
                // owner first
                if (a.isOwner) return -1;
                if (b.isOwner) return 1;
                // sort by join time
                return (a.adminTime as number) - (b.adminTime as number);
            })
            .map((item) => item.uid);

        return sortedUid;
    }
    @computed get sortedList() {
        const map = self.groupMemberMap;
        const sortedUid = Object.values(map)
            .sort((a: GroupMembers, b: GroupMembers) => {
                // owner first
                if (a.isOwner) return -1;
                if (b.isOwner) return 1;

                // admin second
                if (a.isAdmin && !b.isAdmin) return -1;
                if (b.isAdmin && !a.isAdmin) return 1;

                if (a.isAdmin && b.isAdmin)
                    return (a.adminTime as number) - (b.adminTime as number);
                // sort by join time
                return a.createTime - b.createTime;
            })
            .map((item) => item.uid);

        return sortedUid;
    }

    @action async open() {
        const members = await groupMemberModel.getGroupMembers(session.focusSessionId, true);
        const _map: { [uid: string]: GroupMembers } = {};
        let uids: string[] = [];
        members.forEach((item) => {
            const { uid, gid } = item;
            uids.push(uid);
            // self.proxyInfo(uid, gid);
            _map[uid] = item;
            return uid;
        });
        self.proxyInfo(uids, session.focusSessionId);
        self.groupMemberMap = _map;
        self.visible = true;
    }
    @action async openAt() {
        if (!isGroup(session.focusSessionId)) return;
        const members = await groupMemberModel.getGroupMembers(session.focusSessionId, true);
        const _map: { [uid: string]: GroupMembers } = {};
        let uids: string[] = [];
        members.forEach((item) => {
            const { uid, gid } = item;
            uids.push(uid);
            // self.proxyInfo(uid, gid);
            _map[uid] = item;
            return uid;
        });
        await self.proxyInfo(uids, session.focusSessionId);
        self.groupMemberMap = _map;

        if (!self.viewAtList) self.viewAtList = true;
    }

    @action viewAllMembers(tab: number) {
        self.viewSubList = tab;
    }
    @action closeAllMembers() {
        self.viewSubList = SessionTab.Home;
    }

    @action close() {
        self.visible = false;
        self.viewSubList = SessionTab.Home;
    }
    @action closeAt() {
        self.viewAtList = false;
    }

    async proxyInfo(uids: string[], gid: string) {
        userProxy.getUserInfo(uids);
        // @ts-ignore
        userProxy.getUserInfoInGroup(uids, gid);
    }
}

const self = new SessionBoardStore();

export const sessionBoardStore = self;
export default self;
