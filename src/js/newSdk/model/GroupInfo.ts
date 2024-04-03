import Dexie, { Table } from "dexie";
import { Avatar } from "./types";
import nc from "../notification";
import getObject from "../service/api/s3Client/getObject";
import chatModel from "./Chat";
import nodeFs from "fs";
import { writeOriginCache } from "utils/sn_utils";
import imgUtils from "@newSdk/utils/ImageSource";
import _, { assignWith } from "lodash";
import { publishThrottle } from "./descriptor";
import { decorateLink } from "@newSdk/utils/fs";

export type GroupInfo = {
    id: string;
    name: string;
    uid: string;
    avatar?: Avatar;
    avatarPath?: string;
    kicked?: boolean;
    memberCount?: number;
    notice?: string;
    isNewNotice?: boolean;
};

type UpdateGroupInfo = Partial<GroupInfo>;

export const nullGroup = {
    id: "",
    name: "",
    uid: "",
    avatar: {} as Avatar,
    avatarPath: "",
};

class Group {
    private db?: Dexie;
    private userId?: string;
    private store?: Table<GroupInfo, string>;

    private publishThrottle = {
        throttleTimer: null,
        throttleTimeout: 44,
        argsStack: [],
    };

    static authorize = false;
    Event = {
        groupChange: "groupChange",
    };

    init(db: Dexie) {
        this.db = db;
        this.userId = db.name;
        this.store = db.table("groupInfo");
        Group.authorize = true;
    }

    async bulkPut(groupList: GroupInfo[]) {
        this.store?.bulkPut(groupList).then(() => self.handlePublish(groupList));
    }

    async bulkPutGroups(groups: GroupInfo[]) {
        const exitsGroup = await this.store?.toArray();
        const existMap = _.keyBy(exitsGroup, "id");

        const list = groups.map((item) => {
            if (existMap[item.id]) return { ...existMap[item.id], ...item };
            return item;
        });
        this.store?.bulkPut(list).then(
            () => {
                this.handlePublish(list);
            },
            (e) => console.error(`bulkPutGroups`, e)
        );
    }

    async checkAvatarCache(id: string, avatar: Avatar) {
        const path = await imgUtils.downloadAvatar(avatar);
        if (path) this.updateGroupInfoById(id, { avatar, avatarPath: decorateLink(path) });
    }

    async getGroupInfo(gid: string) {
        try {
            let group = await this.store?.where(":id").equals(gid).first();
            return group || nullGroup;
        } catch (e) {
            console.error(e);
            return nullGroup;
        }
    }

    async getGroupInfoByIds(gid: string[]) {
        return (await this.store?.where(":id").anyOf(gid).toArray()) || [];
    }

    async getAllGroups() {
        return (await this.store?.toArray()) || [];
    }
    async queryByKeyWords(value: string, key: keyof GroupInfo) {
        try {
            return (
                (await this.store
                    ?.filter((item: GroupInfo) => {
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

    putGroup(group: GroupInfo) {
        this.store
            ?.put(group)
            .then(() => {
                return this.handlePublish([group]);
            })
            .catch(console.error);
    }

    async updateGroupInfoById(id: string, ops: UpdateGroupInfo) {
        await this.store?.update(id, ops).then(() =>
            this.store?.get(id).then((item) => {
                if (item) return this.handlePublish([item]);
            })
        );
    }

    notExistGroup(group: any) {
        return group === nullGroup;
    }

    @publishThrottle(44, "id")
    handlePublish(groups: GroupInfo[]) {
        nc.publish(self.Event.groupChange, groups);

        /* sync conversation info */
        // const sessionPutItems = groups.map((item) => ({
        //     chatId: item.id,
        //     name: item.name,
        //     avatar: item.avatarPath,
        // }));
        // return chatModel.updateSessionBulkIfExist(sessionPutItems);
    }
}

const self = new Group();
export default self;
