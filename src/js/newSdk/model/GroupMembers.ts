import Dexie, { Table } from "dexie";
import { Switch } from "./types";
import nc from "../notification/index";

import getGroupMemberInfoList from "@newSdk/service/api/group/getGroupMemberInfoList";

export type GroupMembers = {
    id?: number;
    gid: string;
    uid: string;
    alias: string;
    isOwner: Switch;
    isAdmin: Switch;
    deleted: boolean;
    createTime: number;
    adminTime?: number;
};

class GMembers {
    private db?: Dexie;
    private userId?: string;
    private store?: Table<GroupMembers, number>;

    static authorize = false;

    Event = {
        MemberInfoChanged: "memberInfoChanged",
    };

    Tag = {
        UPDATE: 1,
    };

    init(db: Dexie) {
        this.db = db;
        this.userId = db.name;
        this.store = db.table("groupMembers");
        GMembers.authorize = true;
    }

    async getAlias(groupId: string, uid: string) {
        const ls = await this.store?.get({ gid: groupId, uid });
        if (ls) return ls.alias;
        return "";
    }

    bulkPut(list: GroupMembers[], gid: string) {
        this.store?.bulkPut(list).then(() => {
            self.handlePublish(list, gid);
        });
    }

    modifyMemberInfo(
        gid: string,
        uid: string,
        changes: { [key in keyof GroupMembers]?: GroupMembers[key] }
    ) {
        this.store
            ?.where("gid")
            .equals(gid)
            .filter((item) => item.uid === uid)
            ?.modify(changes)
            .then(async () => {
                const item = await this.store?.get({ gid, uid });

                if (item) this.handlePublish([item], gid, this.Tag.UPDATE);
            });
    }

    async getGroupMembers(gid: string, isRefresh = false) {
        const item = await this.store
            ?.where("gid")
            .equals(gid)
            .filter((item) => !item.deleted)
            .toArray();
        if (isRefresh) {
            getGroupMemberInfoList(gid);
        }
        return item || [];
    }

    async getGroupMember(gid: string, uid: string) {
        const info = await this.store?.get({ gid, uid });
        return info || {};
    }

    async getBulkGroupMember(gid: string, uidList: string[]) {
        try {
            const list = await this.store
                ?.where("gid")
                .equals(gid)
                .filter((item) => uidList.includes(item.uid))
                .toArray();

            return list || [];
        } catch (e) {
            console.error(e);
        }
    }

    async getGroupMembersCount(gid: string) {
        const count = await this.store?.where("gid").equals(gid).count();
        return count || 0;
    }

    async getUnKickedGroup(id: string) {
        try {
            return (
                (await this.store
                    ?.where("uid")
                    .equals(id)
                    .filter((item) => item.deleted)
                    .toArray()) || []
            );
        } catch (e) {
            return [];
        }
    }
    async queryByKeyWords(value: string, key: keyof GroupMembers) {
        try {
            return (
                (await this.store
                    ?.filter((item: GroupMembers) => {
                        const regExp = new RegExp(`${value}`, "ig");
                        return regExp.test(item[key] as string);
                    })
                    .toArray()) || []
            );
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    handlePublish(groupMembers: GroupMembers[], gid: string, tag?: number) {
        nc.publish(this.Event.MemberInfoChanged, groupMembers, gid, tag);
    }
}

const self = new GMembers();
export default self;
