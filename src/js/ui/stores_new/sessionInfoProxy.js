import { observable, action, computed } from "mobx";
import { createSingleChatId, getSingleChatTarget, isGroup } from "@newSdk/utils";
import GroupInfo from "@newSdk/model/GroupInfo";
import { userStatus } from "@newSdk/consts/userStatus";
import { getGroupInfoByGidWithThrottle } from "@newSdk/logic/session/getGroupInfoByGidWithThrottle";
import nc from "@newSdk/notification";
import Members from "@newSdk/model/Members";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { getMemberInfoByIdWithThrottle } from "@newSdk/logic/session/getMemberInfoByIdWithThrottle";
import GroupMembers from "@newSdk/model/GroupMembers";
import localFormat from "utils/localeFormat";
import { getNameWeight } from "utils/nameWeight";
class SessionInfoProxy {
    @observable sessionMap = {};

    constructor() {
        nc.on(GroupInfo.Event.groupChange, (list) => {
            list.forEach(async (item) => await self.setGroupInfo(item));
        });

        nc.on(Members.Event.MemberInfoChanged, (list) => {
            list.forEach(self.setUserInfo);
        });
    }

    @computed get sessionInfoProxy() {
        const data = self.sessionMap;
        return (chatId) => {
            return data[chatId] || {};
        };
    }

    @action async setGroupInfo(group) {
        let editAble = false;
        const { id, name, avatar, avatarPath, memberCount, kicked, isNewNotice, notice } = group;
        //find the owner
        await GroupMembers.getGroupMembers(id).then((list) => {
            list.forEach(({ uid, isOwner, isAdmin }) => {
                if ((isOwner || isAdmin) && uid === tmmUserInfo._id) editAble = true;
                // if (isAdmin && uid === tmmUserInfo._id) editAble = true;
            });
        });
        // if (self.sessionMap[id])
        self.sessionMap = {
            ...self.sessionMap,
            [id]: {
                chatId: id,
                name,
                avatar: avatarPath,
                memberCount,
                kicked,
                editAble,
                notice,
                isNewNotice,
            },
        };
        // console.log(self.sessionMap[id]);
    }

    @action setUserInfo(user) {
        const {
            name,
            friendAlias,
            avatarPath,
            avatar,
            signature,
            id,
            status,
            isFriend,
            regionId,
            tmm_id,
        } = user;
        const chatId = createSingleChatId(tmmUserInfo._id, id);
        // judge user wheater deleted account --> status
        // const sessionName = getNameWeight({
        //     friendAlias: user.friendAlias,
        //     alias: user.alias,
        //     name: user.name,
        //     uid: user.uid,
        //     status: user.status,
        // });
        // const sessionName =
        //     status == userStatus.Deleted
        //         ? localFormat({ id: "account_deleted" })
        //         :
        //         friendAlias || name;
        if (self.sessionMap[chatId]) {
            self.sessionMap = {
                ...self.sessionMap,
                [chatId]: {
                    chatId,
                    name,
                    friendAlias,
                    status,
                    avatar: avatarPath,
                    signature,
                    isFriend,
                    regionId,
                    tmm_id,
                },
            };
        }
    }

    getSessionInfo(chatId) {
        if (!chatId) return;
        if (self.sessionMap[chatId]) return;

        // default
        self.sessionMap[chatId] = {};

        if (isGroup(chatId)) {
            return self.handleGroupSession(chatId);
        } else {
            return self.handleSingleSession(chatId);
        }
    }

    // 处理群组id
    async handleGroupSession(chatId) {
        const info = await GroupInfo.getGroupInfo(chatId);
        if (GroupInfo.notExistGroup(info)) return getGroupInfoByGidWithThrottle(chatId);

        if (info) return self.setGroupInfo(info);
    }

    // 处理
    async handleSingleSession(chatId) {
        try {
            const info = await Members.getMemberById(getSingleChatTarget(chatId));
            if (Members.noExistMember(info))
                return getMemberInfoByIdWithThrottle([getSingleChatTarget(chatId)]); // fetch

            if (info) return self.setUserInfo(info);
        } catch (e) {
            console.log("error");
        }
    }

    @action
    clearCache() {
        self.sessionMap = {};
    }
}

const self = new SessionInfoProxy();

export default self;
