import { action, computed, observable } from "mobx";
import Members, { IMember } from "@newSdk/model/Members";
import { getMyGroups } from "@newSdk/logic/group/getMyGroups";
import userProxy from "../../stores_new/userProxy";
import { splitFstName } from "utils/sn_utils";
import nc from "@newSdk/notification";
import GroupInfoModel, { GroupInfo } from "@newSdk/model/GroupInfo";
import { OfficialServices } from "@newSdk/index";
import _ from "lodash";
import { isMyFriend } from "@newSdk/utils";
import FriendsReq from "@newSdk/logic/friendReq";
import getApplyList from "@newSdk/service/api/addFriends/getApplyList";
import commonStore from "../../stores_new/common";
import refreshOwnGroupList from "@newSdk/logic/group/refreshOwnGroupList";
type LineType = {
    newFriend: "newFriend";
    groups: "groups";
    contacts: "contacts";
};

type TabType = LineType[keyof LineType];
type TabProps = {
    title: string;
    list: any[];
    isOpen: boolean;
};
type TabMap = {
    [propsName in TabType]?: { type: LineType[propsName] } & TabProps;
};

type FocusItemProps = {
    type?: TabType;
    id?: string;
    createTime?: number;
};

class ContactsStore {
    TabEnum: LineType = {
        newFriend: "newFriend",
        groups: "groups",
        contacts: "contacts",
    };

    @observable tabMap: TabMap = {};
    @observable search = "";
    @observable focusItem: FocusItemProps = {};
    @observable requestVisible = false;

    @computed get renderList() {
        const { newFriend, contacts, groups } = self.tabMap;
        const renderList = [];
        const { search } = self;
        if (newFriend) renderList.push(newFriend);

        // 处理搜索
        if (groups) {
            const { list } = groups;
            let _list = list;
            if (search) {
                _list = list.filter((item) => item.name.includes(search));
            }
            renderList.push({ ...groups, list: _list });
        }

        // 处理搜索
        if (contacts) {
            const { list } = contacts;
            let _list = list;

            if (search) {
                _list = list.filter((item) => `${item.friendAlias}${item.name}`.includes(search));
            }
            renderList.push({ ...contacts, list: _list });
        }
        return renderList;
    }

    @computed get focusItemInfo(): { type?: TabType; info?: any } {
        const { type, id, createTime } = self.focusItem;
        if (type && id) {
            const list = self.tabMap[type]?.list || [];
            const info = list.find((item) => item.id === id && item.createTime === createTime);

            return {
                type,
                info,
            };
        }

        return {};
    }

    @computed get renderGroup() {
        const {
            TabEnum: { contacts },
            tabMap,
        } = self;
        if (tabMap.contacts?.isOpen) {
            const list = tabMap[contacts]?.list || [];

            const space = {};
            list.forEach((item) => {
                const info = userProxy.getProxyUserBaseInfo(item.id);
                const name = (info.friendAlias || info.name || "")[0];
                splitFstName(space, item, name);
            });
            const keys: string[] = Object.keys(space).sort();
            if (keys[0] === "#") keys.push(keys.shift() as string);

            return space;
        }

        return {};
    }

    @action async init() {
        const [friends, groups, friendsRequest] = await Promise.all([
            Members.getAllMyFriends(),
            getMyGroups(),
            FriendsReq.getApplyWithinOneMonth(),
        ]);
        const { newFriend, contacts, groups: groupType } = self.TabEnum;
        self.syncUserInfo(friends);
        self.tabMap = {
            [newFriend]: {
                title: "NewFriends",
                type: newFriend,
                list: friendsRequest.map((item) => ({ ...item, id: item.uid })),
                isOpen: false,
            },
            [groupType]: {
                title: "GroupChat",
                type: groupType,
                list: groups,
                isOpen: false,
            },
            [contacts]: {
                title: "Contacts",
                type: contacts,
                list: friends,
                isOpen: true,
            },
        };
        self.subscribe();
    }

    @action searching(text: string) {
        self.search = text;
    }
    @action setFocusItem(type?: TabType, id?: string, createTime?: number) {
        self.focusItem = {
            type,
            id,
            createTime,
        };
    }
    @action updateTabProps(type: LineType[TabType], props: Partial<TabProps>) {
        const tab = Object.assign(self.tabMap[type], props);
        self.tabMap = { ...self.tabMap, [type]: tab };
    }
    @action clear() {
        self.tabMap = {};
        self.search = "";
        self.focusItem = {};
        self.unSubscribe();
    }

    @action handleToggleVisible() {
        self.init();
        self.requestVisible = !self.requestVisible;
    }
    async handleToggle(type: LineType[TabType]) {
        const nextState = !self.tabMap[type]?.isOpen;
        self.updateTabProps(type, { isOpen: nextState });

        if (type === self.TabEnum.newFriend && nextState) {
            await getApplyList();
            commonStore.updateApplyFriendMsgState(false);
            const friendsRequest = await FriendsReq.getApplyWithinOneMonth();
            self.updateTabProps(type, {
                list: friendsRequest.map((item) => ({ ...item, id: item.uid })),
            });
        } else if (type === self.TabEnum.groups && nextState) {
            refreshOwnGroupList();
        }
    }
    syncUserInfo(users: IMember[]) {
        const uids = users.map(({ id }) => id);

        // 获取本地数据
        userProxy.getUserInfo(uids);
    }

    // 用户信息更新
    handleMemberInfoChange = (members: IMember[]) => {
        members = members.filter((item) => !OfficialServices.includes(item.id));

        const { tabMap, TabEnum } = self;
        const contacts = tabMap[TabEnum.contacts];
        if (contacts) {
            const { list = [] } = contacts;

            const groupById = _.keyBy(members, "id");
            const _list: IMember[] = [];
            let cursor = 0;

            list.forEach((item) => {
                const newUserInfo = groupById[item.id];
                if (newUserInfo) {
                    // 不是好友 从当前列表移除
                    if (!isMyFriend(newUserInfo.isFriend)) return;

                    const _item = { ...item, ...newUserInfo };
                    delete groupById[item.id];
                    return (_list[cursor++] = _item);
                }
                return (_list[cursor++] = item);
            });

            Object.values(groupById).forEach((item) => {
                if (isMyFriend(item.isFriend)) {
                    _list[cursor++] = item;
                }
            });

            contacts.list = _list;
            tabMap[TabEnum.contacts] = contacts;
        }
    };

    // 群组信息更新
    handleGroupInfoChange = (groupsList: GroupInfo[]) => {
        const { tabMap, TabEnum } = self;
        const groups = tabMap[TabEnum.groups];

        if (groups) {
            const { list } = groups;
            const groupById = _.keyBy(groupsList, "id");

            const _list: GroupInfo[] = [];
            let cursor = 0;

            list.forEach((item: GroupInfo) => {
                const newProps = groupById[item.id];

                if (newProps) {
                    if (!newProps.kicked) {
                        _list[cursor++] = { ...item, ...newProps };
                        delete groupById[item.id];
                    }
                } else {
                    _list[cursor++] = item;
                }
            });

            Object.values(groupById).forEach((item: GroupInfo) => {
                if (!item.kicked) _list[cursor++] = item;
            });

            tabMap[TabEnum.groups] = { ...groups, list: _list };
        }
    };
    subscribe() {
        nc.on(Members.Event.MemberInfoChanged, self.handleMemberInfoChange);
        nc.on(GroupInfoModel.Event.groupChange, self.handleGroupInfoChange);
    }
    unSubscribe() {
        nc.off(Members.Event.MemberInfoChanged, self.handleMemberInfoChange);
        nc.off(GroupInfoModel.Event.groupChange, self.handleGroupInfoChange);
    }
}

const self = new ContactsStore();

export const contactsStore = self;
export default contactsStore;
