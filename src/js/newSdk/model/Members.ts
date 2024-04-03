import Dexie, { Table } from "dexie";
import { Avatar } from "./types";
import nc from "../notification";
import getObject from "../service/api/s3Client/getObject";
import Conversation from "./Chat";
import nodeFs from "fs";
import { checkOriginCache, writeOriginCache } from "utils/sn_utils";
import { createSingleChatId } from "@newSdk/utils";
import { authorize } from "./descriptor";
import mediaUtils from "../utils/ImageSource";
import UserInfo from "@newSdk/model/UserInfo";
import { publishThrottle } from "./descriptor";
import getUserListInfo, { UserInfoItem } from "../service/api/getUserListInfo";
import _ from "lodash";
import { OfficialServices } from "@newSdk/index";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { decorateLink, isAccess } from "@newSdk/utils/fs";
import getRegionName from "utils/getRegionName";
import Settings from "../../ui/stores/settings";
export const FriendsStatus = {
    stranger: 0,
    friends: 1,
    friendsForMe_strangerForYou: 2,
    strangerForMe_friendsForYou: 3,
};

export type IMember = {
    id: string;
    name?: string;
    tmm_id?: string;
    isSetTmmId?: number;
    avatar?: Avatar | undefined;
    avatarPath?: string;
    isFriend?: number;
    friendAlias?: string;
    isStar?: number;
    phone?: string;
    signature?: string;
    gender?: number;
    viewDetail?: number;
    firstName?: string;
    lastName?: string;
    status?: number;
    regionId?: string;
};

type UpdateMemberProps = Partial<IMember>;

const defaultUser = {
    id: "",
    name: "",
    tmm_id: "",
    avatar: {},
    avatarPath: "",
    isFriend: 0,
    friendAlias: "",
    isStar: 0,
};

class Member {
    private db?: Dexie;
    private userId?: string;
    private store?: Table<IMember, string>;

    static authorize = false;

    readonly Event = {
        MemberInfoChanged: "memberInfoChanged",
        MyInfoChange: "myInfoChange",
    };

    init(db: Dexie) {
        this.db = db;
        this.userId = db.name;
        this.store = db.table("memberInfos");
        Member.authorize = true;
    }

    @authorize
    filterExistByUid(uids: string[]) {
        return this.store?.where("id").anyOf(uids).toArray();
    }

    @authorize
    async getUnExistIdsByUid(uids: string[]) {
        try {
            const exist = await this.filterExistByUid(uids);
            if (!exist || !exist.length) return uids;

            const ids = exist.map((item) => item.id);
            return uids.filter((item) => !ids.includes(item));
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    @authorize
    bulkPutMemberInfo(member: IMember[]) {
        return this.store
            ?.bulkPut(member)
            .then(() => {
                this.handlePublish(member);
            })
            .catch((e) => console.error("bulkPutMemberInfo", e));
    }

    @authorize
    async checkAvatarCache(id: string, avatar: Avatar | undefined) {
        const { avatar: oldAvatarInfo, avatarPath = "" } =
            (await this.store?.where("id").equals(id).first()) || {};
        const path = await mediaUtils.downloadAvatar(avatar);
        const isExist =
            oldAvatarInfo &&
            _.isEqual(oldAvatarInfo, avatar) &&
            (await isAccess(avatarPath)) &&
            path == avatarPath;
        //add path == avatarPath; 2022/6/16

        if (isExist) return;
        // const path = await mediaUtils.downloadAvatar(avatar);
        if (path) {
            // const { avatarPath } = (await this.store?.where("id").equals(id).first()) || {};
            // if (avatarPath !== path)
            this.store
                ?.where("id")
                .equals(id)
                .modify({
                    avatarPath: path,
                    //  decorateLink(path)
                })
                .then(async () => {
                    const updated = await this.store?.where(":id").equals(id).first();
                    if (updated) this.handlePublish([updated]);
                });
        }
    }

    @authorize
    async modifyMemberInfo(id: string, modifyInfos: IMember) {
        const old = await this.store?.where(":id").equals(id).first();

        if (old)
            this.store
                ?.where(":id")
                .equals(id)
                .modify({ ...old, ...modifyInfos, id })
                .then(() => this.handlePublish([{ ...old, ...modifyInfos, id }]))
                .catch(console.error);
        else
            this.store
                ?.put({ ...modifyInfos, id })
                .then((res) => this.handlePublish([{ ...modifyInfos, id }]))
                .catch(console.error);
    }

    @authorize
    async updateMemberInfo(id: string, updateInfo: UpdateMemberProps) {
        try {
            await this.store?.update(id, updateInfo);
            const newItem = await this.store?.where(":id").equals(id).first();
            if (newItem) this.handlePublish([newItem]);
        } catch (e) {}
    }

    @authorize
    async getMemberById(id: string, isSync = false): Promise<any> {
        const dUser = Object.assign(defaultUser, { id });
        if (!id) return dUser;
        try {
            const user =
                (await this.store
                    ?.where(":id")
                    .equals(id)
                    .first()
                    .catch((e) => console.error(e, id))) || null;
            // exist
            if (user) {
                // check avatar
                const { avatarPath, avatar } = user;
                // exist
                if (avatarPath && nodeFs.existsSync(avatarPath)) return user;

                // not exits
                if (!user.avatarPath) {
                    mediaUtils.downloadAvatar(avatar).then((path) => {
                        if (path) {
                            user.avatarPath = path;
                            this.updateMemberInfo(user.id, user);
                        }
                    });
                }
                return user;
            }

            if (isSync && !user) {
                const [userInfo] = (await getUserListInfo([id])) || [{}];
                // await this.bulkPutMemberInfo(userInfo);
                return userInfo;
            }
            return dUser;
        } catch (e) {
            console.error(e);
            return dUser;
        }
    }

    @authorize
    async getMemberByIds(ids: string[]) {
        return (await this.store?.where(":id").anyOf(ids).toArray()) || [];
    }

    @authorize
    async getAllMyFriends() {
        try {
            return (
                (await this.store
                    ?.where("isFriend")
                    .anyOf([FriendsStatus.friends, FriendsStatus.friendsForMe_strangerForYou])
                    .filter((item) => !OfficialServices.includes(item.id))
                    // .filter((item) => item.id !== UserInfo._id)
                    .toArray()) || []
            );
        } catch (e) {
            console.error(e);
            return [];
        }
    }
    @authorize
    async queryByKeyWords(value: string, key: keyof IMember) {
        try {
            return (
                (await this.store
                    ?.where("isFriend")
                    .anyOf([FriendsStatus.friends, FriendsStatus.friendsForMe_strangerForYou])
                    .filter((item: IMember) => {
                        const regExp = new RegExp(`${value}`, "ig");
                        if (key === "regionId") {
                            const regionName = getRegionName(Settings.locale, item.regionId);
                            if (regionName.includes(value)) return regionName.includes(value);
                        }
                        return (
                            regExp.test(item[key] as string) && !OfficialServices.includes(item.id)
                        );
                    })
                    .toArray()) || []
            );
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    @authorize
    async queryByName(value: string) {
        try {
            return (await this.store?.where("name").belowOrEqual(value))?.toArray() || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    isStrangeRelation(user: IMember) {
        return [FriendsStatus.stranger, FriendsStatus.strangerForMe_friendsForYou].includes(
            user.isFriend ?? FriendsStatus.stranger
        );
    }

    isOfficialAccount(item: IMember) {
        return OfficialServices.includes(item.id);
    }

    assetsSessionHide(item: IMember) {
        return this.isStrangeRelation(item) && !this.isOfficialAccount(item);
    }

    noExistMember(member: any) {
        return member === defaultUser;
    }

    @publishThrottle(1000, "id")
    handlePublish(members: IMember[]) {
        nc.publish(this.Event.MemberInfoChanged, members);
        const me = members.find((item) => item.id === tmmUserInfo._id);
        if (me) nc.publish(this.Event.MyInfoChange, me);
        /* sync conversation info */
        const updateOps = members.map((item) => {
            const chatId = createSingleChatId(item.id, UserInfo._id);

            const hide = this.assetsSessionHide(item);
            return {
                chatId,
                // avatar: item.avatarPath,
                // name: item.friendAlias || item.name,
                hide,
            };
        });
        return Conversation.updateSessionBulkIfExist(updateOps);
    }

    @authorize
    addMemberInto(dataItem: UserInfoItem) {
        const info = this.friendInfoTransfer(dataItem);
        const { id, avatar } = info;
        this.checkAvatarCache(id, avatar);
        this.modifyMemberInfo(id, info);
    }

    friendInfoTransfer = (items: UserInfoItem): IMember => {
        const {
            id,
            tmm_id,
            isset_tmm_id,
            avatar,
            f_name,
            l_name,
            gender,
            phone,
            region_id,
            signature,
            status,
        } = items;

        return {
            id,
            tmm_id,
            isSetTmmId: isset_tmm_id,
            phone,
            avatar,
            name: `${f_name} ${l_name}`,
            firstName: f_name,
            lastName: l_name,
            gender,
            regionId: region_id,
            signature,
            status,
        };
    };
}

// export const transformFriendsDataToLocalData = (member: any = {}, isFriend = 0) => ({
//     id: member.obj_uid,
//     name: member.u_name,
//     tmm_id: member.u_tmm_id,
//     avatar: member.u_avatar,
//     isFriend,
//     friendAlias: member.alias,
//     isStar: member.is_star,
// });

const model = new Member();

export default model;
