import Members from "@newSdk/model/Members";
import { observable, action, computed } from "mobx";
import session from "../../stores_new/session";
import { getMyGroups } from "@newSdk/logic/group/getMyGroups";
import userProxy from "../../stores_new/userProxy";
import sessionInfoProxy from "../../stores_new/sessionInfoProxy";
import { splitFstName } from "utils/sn_utils";
import { createSingleChatId, getSingleChatTarget, isGroup } from "@newSdk/utils";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { GroupInfo } from "@newSdk/model/GroupInfo";
import { userStatus } from "@newSdk/consts/userStatus";
import sessionBoardStore from "../TmmSessionBoard/sessionBoardStore";
import groupMemberModel, { GroupMembers } from "@newSdk/model/GroupMembers";
import getRegionName from "utils/getRegionName";
import Settings from "../../stores/settings";
interface Item {
    name: string;
    avatar: string;
    selected?: boolean;
    [propsName: string]: any;
}

type enumType = {
    Contacts: "Contacts";
    Groups: "Groups";
    Recent: "Recent";
    GroupMembers: "GroupMembers";
    Forward: "Forward";
};
type Title<T> = {
    title: string;
    subTitile?: {
        prefix: string;
        suffix: string;
    };
} & T;

type AcType = enumType[keyof enumType];

type TabProps = {
    type: AcType | "";
    title: string;
    active: boolean;
    items: Item[];
};

type SupportTab = {
    type: AcType;
    title: string;
};

type SelectedUserProps = {
    avatar: string;
    name: string;
    [K: string]: string;
};
type ResultHandler = (selectedTabs: TabProps[], chatIds?: string[]) => Promise<boolean>;
type FormatHandleMap = { [tabType: string]: (tabList: any[]) => any[] };

type InitialProps = {
    initialTab: AcType;
    title: string;
    okText: string;
    supportTab: SupportTab[];
    resultHandler?: ResultHandler;
    cancelHandler?: () => {};
    initTabFormatMap?: FormatHandleMap;
    dataDidInit?: Function;
    forward?: boolean;
};

class PickerStore {
    TabEnum: enumType = {
        Contacts: "Contacts",
        Groups: "Groups",
        Recent: "Recent",
        GroupMembers: "GroupMembers",
        Forward: "Forward",
    };
    @observable visible: boolean = false;
    @observable title: string = "";
    @observable okText: string = "";
    @observable initialTab: AcType | "" = "";
    @observable selectedMap: { [propName: string]: SelectedUserProps } = {};
    @observable tabs: TabProps[] = [];
    @observable searchText = "";
    @observable resultHandler: ResultHandler = async () => true;
    @observable cancelHandler: () => void = () => {};
    @observable forward: boolean = false;

    @computed get isSelected() {
        return Object.keys(self.selectedMap).length > 0;
    }
    @computed get renderListInfo() {
        const { items, type } = self.activeTab;

        const search = self.searchText;
        const forward = self.forward;

        let list: Item[] = [];
        //
        if (search) {
            if (forward) {
                let map: Record<string, Item> = {};
                const contactsList = self.getTabList(self.tabs, self.TabEnum.Contacts);
                const GroupsList = self.getTabList(self.tabs, self.TabEnum.Groups);
                // const RecentList = self.getTabList(self.tabs, self.TabEnum.Recent);
                const friendAliasList = self.queryByKeyWords(contactsList, search, "friendAlias");
                const userNameList = self.queryByKeyWords(contactsList, search, "name");
                const groupNameList = self.queryByKeyWords(GroupsList, search, "name");
                const tmmIdList = self.queryByKeyWords(contactsList, search, "tmm_id");
                const regionIdList = self.queryByKeyWords(contactsList, search, "regionId");
                [
                    ...friendAliasList,
                    ...userNameList,
                    ...groupNameList,
                    ...tmmIdList,
                    ...regionIdList,
                ].forEach((item, index) => {
                    const key = self.getUUKey(self.TabEnum.Contacts, item);
                    if (!map[key]) {
                        map[key] = item;
                    }
                });
                list = Object.values(map);
            } else {
                if (type === self.TabEnum.Contacts) {
                    let map: Record<string, Item> = {};
                    const nameList = self.queryByKeyWords(items, search, "name");
                    const friendAliasList = self.queryByKeyWords(items, search, "friendAlias");
                    const tmmIdList = self.queryByKeyWords(items, search, "tmm_id");
                    const regionIdList = self.queryByKeyWords(items, search, "regionId");
                    [...friendAliasList, ...nameList, ...tmmIdList, ...regionIdList].forEach(
                        (item, index) => {
                            const key = self.getUUKey(type, item);
                            if (!map[key]) {
                                map[key] = item;
                            }
                        }
                    );
                    list = Object.values(map);
                } else if (type === self.TabEnum.GroupMembers) {
                    let map: Record<string, Item> = {};
                    const userInfo = items.map((item: Item) => {
                        const combineInfos = userProxy.getProxyUserBaseInfo(item.uid);
                        return {
                            ...combineInfos,
                            ...item,
                        };
                    });
                    const friendAliasList = self.queryByKeyWords(userInfo, search, "friendAlias");
                    const aliasList = self.queryByKeyWords(userInfo, search, "alias");
                    const nameList = self.queryByKeyWords(userInfo, search, "name");
                    const tmmIdList = self.queryByKeyWords(userInfo, search, "tmm_id");
                    const regionIdList = self.queryByKeyWords(userInfo, search, "regionId");
                    [
                        ...friendAliasList,
                        ...aliasList,
                        ...nameList,
                        ...tmmIdList,
                        ...regionIdList,
                    ].forEach((item, index) => {
                        const key = self.getUUKey(type, item);
                        if (!map[key]) {
                            map[key] = item;
                        }
                    });
                    list = Object.values(map);
                } else if (type === self.TabEnum.Groups) {
                    const groupNameList = self.queryByKeyWords(items, search, "name");
                    list = groupNameList;
                } else if (type === self.TabEnum.Recent) {
                    let userInfoLIst: Array<Item> = [];
                    let GroupInfoList: Array<Item> = [];
                    let map: Record<string, Item> = {};
                    items.forEach((it: Item) => {
                        if (isGroup(it.chatId))
                            return GroupInfoList.push(sessionInfoProxy.sessionInfoProxy(it.chatId));
                        userInfoLIst.push(sessionInfoProxy.sessionInfoProxy(it.chatId));
                    });
                    const friendAliasList = self.queryByKeyWords(
                        userInfoLIst,
                        search,
                        "friendAlias"
                    );
                    const nameList = self.queryByKeyWords(userInfoLIst, search, "name");
                    const groupNameList = self.queryByKeyWords(GroupInfoList, search, "name");
                    const tmmIdList = self.queryByKeyWords(userInfoLIst, search, "tmm_id");
                    const regionIdList = self.queryByKeyWords(userInfoLIst, search, "regionId");
                    [
                        ...friendAliasList,
                        ...nameList,
                        ...groupNameList,
                        ...tmmIdList,
                        ...regionIdList,
                    ].forEach((item, index) => {
                        const key = self.getUUKey(type, item);
                        if (!map[key]) {
                            map[key] = item;
                        }
                    });
                    list = Object.values(map);
                }
            }

            // list = items.filter((item) => {
            //     let combineInfos: any = {};

            //     if (type === self.TabEnum.Contacts) {
            //         combineInfos = userProxy.getProxyUserBaseInfo(item.id);
            //     } else if (type === self.TabEnum.GroupMembers) {
            //     } else {
            //         // 会话
            //         let chatId = "";
            //         if (type === self.TabEnum.Groups) chatId = item.id;
            //         if (type === self.TabEnum.Recent) chatId = item.chatId;
            //         combineInfos = sessionInfoProxy.sessionInfoProxy(chatId);
            //     }

            //     const info = { ...item, ...combineInfos };

            //     return `${info.name}${info.friendAlias}`.includes(search);
            // });
        } else {
            list = items;
        }

        // handle contacts

        if (type === self.TabEnum.Contacts && !search) {
            const space = {};
            list.forEach((item) => {
                if (item.status == userStatus.Deleted) return;
                const info = userProxy.getProxyUserBaseInfo(item.id);
                const name = (info.friendAlias || info.name || "")[0];
                splitFstName(space, item, name);
            });
            const keys = Object.keys(space).sort();
            if (keys[0] === "#") keys.push(keys.shift() as string);

            return {
                groupByKeys: {
                    space,
                    keys,
                },
                type,
            };
        }
        //
        return {
            list,
            type,
        };
    }
    @computed get activeTab() {
        return self.tabs.find((item) => item.active) || { items: [], type: "" };
    }

    @action toggleTab(activeType: AcType) {
        self.tabs = self.tabs.map((item) => {
            if (item.type === activeType) {
                item.active = true;
            } else {
                item.active = false;
            }

            return item;
        });
    }

    @action async open({
        initialTab,
        title,
        supportTab,
        okText,
        resultHandler,
        cancelHandler,
        initTabFormatMap = {},
        dataDidInit,
        forward = false,
    }: InitialProps) {
        self.title = title;
        self.okText = okText;
        self.initialTab = initialTab;
        self.tabs = await self.generateTab(supportTab, initialTab, initTabFormatMap);
        self.visible = true;
        self.forward = forward;
        if (resultHandler) self.resultHandler = resultHandler;
        if (cancelHandler) self.cancelHandler = cancelHandler;

        if (dataDidInit) dataDidInit();
    }

    @action close() {
        self.visible = false;
        self.title = "";
        self.okText = "";
        self.initialTab = "";
        self.selectedMap = {};
        self.tabs = [];
        self.searchText = "";
        self.forward = false;
    }

    @action onSearch = async (val: string) => {
        self.searchText = val;
        // const userNameInfo = await Members.queryByKeyWords(val, "name");
        // const userFriendAliasInfo = await Members.queryByKeyWords(val, "friendAlias");
        // const userTmmIdInfo = await Members.queryByKeyWords(val, "tmm_id");
        // const userRegionIdInfo = await Members.queryByKeyWords(val, "regionId");
        // // const userNameInfo = await Members.queryByName(val);
        // console.log("userNameInfo ---", userNameInfo);
        // console.log("userFriendAliasInfo ---", userFriendAliasInfo);
        // console.log("userTmmIdInfo ---", userTmmIdInfo);
        // console.log("userRegionIdInfo ---", userRegionIdInfo);
    };

    @action updateSelect({
        tabType,
        baseInfo,
        selectedInfo,
    }: {
        tabType: AcType;
        baseInfo: any;
        selectedInfo: SelectedUserProps;
    }) {
        const uuKey = self.getUUKey(tabType, baseInfo);
        console.log(tabType, baseInfo, selectedInfo, uuKey);
        baseInfo.selected = true;
        self.selectedMap[uuKey] = selectedInfo;
    }

    @action removeSelect(uuKey: string, info: any) {
        if (info.selected) info.selected = false;
        self.tabs.map(({ items }) => {
            const removeInfo = items.find((item) => item.id == info.id);
            if (removeInfo) removeInfo.selected = false;
        });

        delete self.selectedMap[uuKey];
    }

    assertSelect(tabType: AcType, info: any) {
        const chatId = self.getUUKey(tabType, info);
        if (self.selectedMap[chatId]) return true;
        return false;
    }

    async generateTab(
        tabsKey: SupportTab[],
        initialTab: AcType,
        initTabFormatMap: FormatHandleMap
    ): Promise<TabProps[]> {
        const { Contacts, Recent, Groups, GroupMembers } = self.TabEnum;
        const hasGroupOrRecent = !!tabsKey.find((item) =>
            ([Recent, Groups] as AcType[]).includes(item.type)
        );

        let myGroup: GroupInfo[] = [];
        let groupKeys: string[] = [];
        if (hasGroupOrRecent) {
            myGroup = await getMyGroups();
            groupKeys = myGroup.map((item) => item.id);
        }

        const prs = tabsKey.map(async ({ type, title }) => {
            const active = type === initialTab;

            let items = [];
            switch (type) {
                case Contacts: {
                    items = await Members.getAllMyFriends();
                    const formatHandler = initTabFormatMap[Contacts];
                    if (formatHandler) items = formatHandler(items);
                    break;
                }
                case Recent: {
                    // 从最近会话中，过滤掉已经不是 群成员的会话；
                    items = await session.sortSessionAsideByRule.filter(
                        (item) => groupKeys.includes(item.chatId) || !isGroup(item.chatId)
                    );
                    const formatHandler = initTabFormatMap[Recent];
                    if (formatHandler) items = formatHandler(items);
                    break;
                }
                case Groups: {
                    items = myGroup;
                    const formatHandler = initTabFormatMap[Groups];
                    if (formatHandler) items = formatHandler(items);
                    break;
                }
                case GroupMembers: {
                    items = await groupMemberModel.getGroupMembers(session.focusSessionId, true);
                    const formatHandler = initTabFormatMap[GroupMembers];
                    if (formatHandler) items = formatHandler(items);
                    break;
                }
            }

            return {
                items,
                active,
                title,
                type,
            };
        });

        return await Promise.all(prs);
    }

    onCancel() {
        if (self.cancelHandler) self.cancelHandler();
        self.close();
    }
    async onOk() {
        console.log(self.tabs);

        const result = self.tabs.map(({ items, ...attr }) => {
            const list = items.filter((item) => item.selected);
            return {
                ...attr,
                items: Object.values(self.selectedMap),
            };
        });
        try {
            console.log(result, Object.keys(self.selectedMap));
            const res = await self.resultHandler(result, Object.keys(self.selectedMap));
            if (res === true || res === undefined) return self.close();
        } catch (e) {
            console.log(`error of handle picker`);
        }
    }

    getTabList(tab: TabProps[], type: AcType) {
        return tab.find((item) => item.type === type)?.items ?? [];
    }

    // 以生成会话id作为标识
    getUUKey(type: AcType, info: any): string {
        // 生成会话id作为标识符，与单聊会话去重
        const { Contacts, Groups, GroupMembers } = self.TabEnum;
        if (type === Contacts) return createSingleChatId(tmmUserInfo._id, info.id);
        if (type === GroupMembers) return createSingleChatId(tmmUserInfo._id, info.uid);
        if (type === Groups) return info.id;
        if (type === "Forward") {
            if (info.id) {
                if (!isGroup(info.id)) return createSingleChatId(tmmUserInfo._id, info.id);
                return info.id;
            } else return info.chatId;

            // if (!isGroup(info.id)) {
            //     return createSingleChatId(tmmUserInfo._id, info.id);
            // } else if (isGroup(info.id)) {
            //     return info.id;
            // } else return info.chatId;
        } else return info.chatId;
    }
    queryByKeyWords<T extends Record<string, string>>(
        list: Array<T>,
        value: string,
        key: keyof T
    ): Array<T> {
        const regExp = new RegExp(`${value}`, "i");
        let filterList: Array<T> = [];
        list.forEach((item) => {
            if (!item[key]) return;
            if (key === "regionId") {
                const regionName = getRegionName(Settings.locale, item.regionId);
                if (regExp.test(regionName)) {
                    const { name, friendAlias, alias } = item;
                    let title: string;
                    if (friendAlias) {
                        title = friendAlias;
                    } else if (alias) {
                        title = alias;
                    } else {
                        title = name;
                    }
                    const regionObj: Title<T> = {
                        title: title,
                        subTitle: { prefix: "Region", suffix: regionName },
                        ...item,
                    };
                    filterList.push(regionObj);
                }
            } else if (key === "name") {
                if (regExp.test(item[key])) {
                    const { name, friendAlias, alias } = item;
                    let nameObj: Title<T>;
                    if (friendAlias) {
                        nameObj = {
                            title: friendAlias,
                            subTitle: {
                                prefix: "nickname",
                                suffix: name,
                            },
                            ...item,
                        };
                    } else if (alias) {
                        nameObj = {
                            title: alias,
                            subTitle: {
                                prefix: "nickname",
                                suffix: name,
                            },
                            ...item,
                        };
                    } else {
                        nameObj = {
                            title: name,
                            ...item,
                        };
                    }

                    filterList.push(nameObj);
                }
            } else if (key === "friendAlias") {
                if (regExp.test(item[key])) {
                    const friendAliasObj: Title<T> = { title: item.friendAlias, ...item };
                    filterList.push(friendAliasObj);
                }
            } else if (key === "tmm_id") {
                if (regExp.test(item[key])) {
                    const { name, friendAlias, alias } = item;
                    let title: string;
                    if (friendAlias) {
                        title = friendAlias;
                    } else if (alias) {
                        title = alias;
                    } else {
                        title = name;
                    }
                    const tmm_idObj: Title<T> = {
                        title: title,
                        subTitle: { prefix: "just_id", suffix: item.tmm_id },
                        ...item,
                    };
                    filterList.push(tmm_idObj);
                }
            } else if (key === "alias") {
                if (regExp.test(item[key])) {
                    const { name, friendAlias, alias } = item;
                    let nameObj: Title<T>;
                    if (friendAlias) {
                        nameObj = {
                            title: friendAlias,
                            subTitle: {
                                prefix: "nickname",
                                suffix: alias,
                            },
                            ...item,
                        };
                    } else {
                        nameObj = {
                            title: alias,
                            ...item,
                        };
                    }
                    filterList.push(nameObj);
                }
            }

            // return regExp.test(item[key]);
        });
        return filterList;
    }
}

const self = new PickerStore();

export const pickerStore = self;
export default self;
