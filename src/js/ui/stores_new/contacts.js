/**
 * @Author Pull
 * @Date 2021-06-16 18:13
 * @project contacts
 */

import { observable, action, computed } from "mobx";
import { message } from "antd";
import memberModel, { FriendsStatus } from "@newSdk/model/Members";
import nc from "@newSdk/notification/index";
import FriendsReq from "@newSdk/logic/friendReq";
import _ from "lodash";
import getApplyList from "@newSdk/service/api/addFriends/getApplyList";
import acceptFriend from "@newSdk/service/api/addFriends/acceptFriend";
import groupModel from "@newSdk/model/GroupInfo";
import updateUserRemarkAlias from "@newSdk/service/api/addFriends/updateUserRemarkAlias";
import groupMemberModel from "@newSdk/model/GroupMembers";
// import getMyGroupList from "@newSdk/logic/group/getMyGroupList";
import chatModel from "@newSdk/model/Chat";
import { arrayToMap, isGroup, mergeObArray, mergeObArrayRight } from "@newSdk/utils";
import { getGroupMemberIdBulk } from "@newSdk/logic/contacts/getGroupMemberIdBulk";
import GroupInfo from "@newSdk/model/GroupInfo";
import { getMyGroups } from "@newSdk/logic/group/getMyGroups";
import { OfficialServices } from "@newSdk/index";

class Contacts {
    LineType = {
        newFriend: "NewFriends",
        group: "GroupChat",
        official: "OfficialAccount",
        friends: "Contacts",
    };

    @observable viewInfo = {
        type: "",
        data: {},
    };
    @observable newFriendsRequest = [];
    @observable listBox = [
        {
            id: self.LineType.newFriend,
            isOpen: false,
        },
        {
            id: self.LineType.group,
            isOpen: false,
            count: 0,
            list: [],
            memberCountMap: new Map(),
        },
        // { // TODO: no official account
        //     id: self.LineType.official,
        //     isOpen: false,
        //     count: 0,
        //     list: [],
        // },
        {
            id: self.LineType.friends,
            isOpen: true,
            count: 0,
            list: [],
        },
    ];
    @observable searchValue = "";
    @observable loading = false;

    constructor() {
        // nc.on(memberModel.Event.MemberInfoChanged, (members) => {
        //     self.friendsListListener(members);
        //     self.updateFriendApply(members);
        // });
    }

    addObservers() {
        nc.on(memberModel.Event.MemberInfoChanged, self.handleMemberChange);
        nc.on(GroupInfo.Event.groupChange, self.handleGroupInfoChange);
    }

    removeObservers() {
        nc.off(memberModel.Event.MemberInfoChanged, self.handleMemberChange);
        nc.off(GroupInfo.Event.groupChange, self.handleGroupInfoChange);
    }

    handleGroupInfoChange = (list) => {
        // console.log(`------------->>>> group`);
        // console.log(reset);
        const cur = self.getList(self.LineType.group);
        const updatedList = mergeObArrayRight(cur, list, "id");
        self.updateList(self.LineType.group, updatedList);
    };

    handleMemberChange = (members) => {
        // filter Official Members
        members = members.filter((item) => !OfficialServices.includes(item.id));
        self.friendsListListener(members);
        self.updateFriendApply(members);
    };

    friendsListListener(members) {
        const item = self.listBox.find((item) => item.id === self.LineType.friends);

        // current
        const currentList = item.list;
        const currentFriendMap = _.keyBy(currentList, "id");
        const currentKeys = Object.keys(currentFriendMap);

        // up info
        const upInfoMap = _.keyBy(members, "id");

        // update viewInfo data is exist
        const { id } = self.viewInfo.data;
        if (id && upInfoMap[id]) self.viewInfo.data = { ...self.viewInfo.data, ...upInfoMap[id] };

        // new friends request;
        const newFriends =
            _.keyBy(
                members.filter(
                    (item) =>
                        [FriendsStatus.friends, FriendsStatus.friendsForMe_strangerForYou].includes(
                            item.isFriend
                        ) && !currentKeys.includes(item.id)
                ),
                "id"
            ) || {};

        // update current userInfo update
        let list = Object.entries(currentFriendMap)
            .map(([k, v]) => {
                const update = upInfoMap[k];
                if (
                    update &&
                    [FriendsStatus.stranger, FriendsStatus.strangerForMe_friendsForYou].includes(
                        update.isFriend
                    )
                ) {
                    return null;
                }
                if (update) return { ...v, ...update };
                else return v;
            })
            .filter(Boolean);

        // add new friends is exist
        Object.entries(newFriends).forEach(([k, v]) => list.push(v));

        item.list = list;
        item.count = list.length;
    }

    @action initList() {
        self.viewInfo = {
            type: "",
            data: {},
        };
        self.getOfficialAccount();
        self.getFriends();
        self.getGroupInfo();
    }

    @action updateList = (lineTy, data) => {
        const item = self.listBox.filter((item) => item.id === lineTy)[0];
        item.list = data || [];
        item.count = (data && data.length) || 0;
    };

    getList = (lineTy) => {
        const item = self.listBox.find((item) => item.id === lineTy) || {};
        return item.list || [];
    };

    // get official Account list
    @action getOfficialAccount() {
        // aesAxios("/bizcustomerapp/mine.json").then((officials) => {
        //     const list = officials.data.data;
        //     self.updateList(self.LineType.official, list);
        // });
    }

    // get friends
    @action async getFriends() {
        const items = await memberModel.getAllMyFriends();
        const list = items.filter((item) => !item.is_star);
        self.updateList(self.LineType.friends, list);
        return list;
    }

    @action async getGroupInfo() {
        const res = await getMyGroups();
        self.updateList(self.LineType.group, res);
        return res;
    }

    @action setValue(val) {
        self.searchValue = val;
    }

    @action toggleLine(id) {
        const { listBox } = self;
        const item = listBox.filter((item) => item.id === id)[0];
        item.isOpen = !item.isOpen;
        // todo self.
    }

    @computed get filterList() {
        if (!self.searchValue) return self.listBox;

        const listBox = [...self.listBox];

        const filter = listBox.map((item) => {
            const copyItm = { ...item };
            const { list } = copyItm;

            if (list) {
                const l = list.filter((item) => {
                    return (item.friendAlias || item.name)
                        .toLocaleLowerCase()
                        .includes(self.searchValue.toLocaleLowerCase());
                });
                copyItm.list = l;
            }
            copyItm.count = list ? copyItm.list.length : null;
            return copyItm;
        });

        return filter;
    }

    @action
    async showInfo(type, data = {}) {
        const { newFriend, friends } = self.LineType;

        if (type === friends) {
            self.viewInfo.data = data;
        }

        self.viewInfo = {
            type,
            data,
        };
    }

    @action
    async setAlias(obj_uid, alias) {
        self.loading = true;
        return await updateUserRemarkAlias(obj_uid, alias).finally(() => {
            self.loading = false;
        });
    }

    @action
    async getNewFriendsReq() {
        self.loading = true;

        try {
            // todo: every friends request store, only belong to single user
            await getApplyList();
            self.newFriendsRequest = await FriendsReq.bulkGet();
        } catch (e) {
            console.error(e);
        } finally {
            self.loading = false;
        }
    }

    @action
    async acceptFriend(uid, applyId) {
        try {
            await acceptFriend(uid, applyId);
            self.updateFriendApplyStatus(uid);
        } catch (e) {
            console.log(e);
        }
    }

    updateFriendApplyStatus(uid) {
        const newList = self.newFriendsRequest.map((apply) => {
            if (uid === apply.user.id) {
                return { ...apply, status: 1 };
            }
            return { ...apply };
        });

        self.newFriendsRequest = newList;
    }

    updateFriendApply(members) {
        const updateDic = _.keyBy(members, "id");
        const updateList = members.map((item) => item.id);
        const newList = self.newFriendsRequest.map((apply) => {
            if (updateList.includes(apply.user.id)) {
                return { ...apply, user: { ...apply.user, ...updateDic[apply.user.id] } };
            }
            return { ...apply };
        });

        if (_.get(self.viewInfo, ["data", "user"])) {
            const { data } = self.viewInfo;
            self.viewInfo.data = {
                ...data,
                user: { ...data.user, ...updateDic[data.uid] },
            };
        }

        self.newFriendsRequest = newList;
    }

    // 页面卸载，恢复初始状态
    @action
    onContactsBlur() {
        self.listBox = self.listBox.map((item) => {
            let isOpen = false;
            if (item.id === self.LineType.friends) isOpen = true;

            return { ...item, isOpen };
        });

        self.clearCache();
    }

    @action clearCache() {
        self.viewInfo = {
            type: "",
            data: {},
        };
        self.newFriendsRequest = [];
        self.listBox = [
            {
                id: self.LineType.newFriend,
                isOpen: false,
            },
            {
                id: self.LineType.group,
                isOpen: false,
                count: 0,
                list: [],
            },
            // { // TODO: no official account
            //     id: self.LineType.official,
            //     isOpen: false,
            //     count: 0,
            //     list: [],
            // },
            {
                id: self.LineType.friends,
                isOpen: true,
                count: 0,
                list: [],
            },
        ];
        self.searchValue = "";
        self.loading = false;
    }
}

const self = new Contacts();
export default self;
