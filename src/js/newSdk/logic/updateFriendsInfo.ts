import getContactsInfo from "@newSdk/service/api/getUserListExtInfo";
import getRelationList from "@newSdk/service/api/addFriends/getRelationList";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
import memberModel, { FriendsStatus } from "@newSdk/model/Members";
import chatModel from "@newSdk/model/Chat";
import {
    createSingleChatId,
    getSingleChatTarget,
    isGroup,
    isMe,
    mergeObArray,
} from "@newSdk/utils";
import UserInfoModel, { InitLoadingStatus } from "@newSdk/model/UserInfo";
import nc, { Event } from "@newSdk/notification";
import { initPercentChange } from "@newSdk/logic/initScript/firstInitLoadingPercent";

export default async (items: string[], { isInit } = { isInit: false }) => {
    if (items.length) {
        // base info

        const extInfo = getContactsInfo(items);
        const relation = getRelationList(items);
        const baseInfo = getUserListInfo(items);

        const len = items.length;
        extInfo.then(() => {
            if (!isInit) return;
            const ratio = initPercentChange.PercentRatioEnum.Contacts.ExtensionInfo;
            initPercentChange.percentChange(ratio * len);
        });
        relation.then(() => {
            if (!isInit) return;
            const ratio = initPercentChange.PercentRatioEnum.Contacts.Relation;
            initPercentChange.percentChange(ratio * len);
        });
        baseInfo.then(() => {
            if (!isInit) return;
            const ratio = initPercentChange.PercentRatioEnum.Contacts.BaseInfo;
            initPercentChange.percentChange(ratio * len);
        });

        const [
            contactsInfo,
            relationInfo,
            userInfo,
            localInfos,
            oldFriendList,
        ] = await Promise.all([
            extInfo,
            relation,
            baseInfo,
            memberModel.getMemberByIds(items),
            memberModel.getAllMyFriends(),
        ]);

        // 初始化 接口失败
        if (!contactsInfo || !relationInfo || !userInfo) {
            throw new Error("init fail");
        }

        // 以前的好友，不是现在对好友；----> 已删除对好友
        const notFriendNow = oldFriendList.filter(
            (item) => !items.includes(item.id) && !isMe(item.id)
        );

        const strangerIds = new Set<string>();

        // 更新好友状态
        const updateStranger = notFriendNow.map((item) => {
            item.isFriend = FriendsStatus.stranger;
            strangerIds.add(createSingleChatId(item.id, UserInfoModel._id));
            return item;
        });

        // 已有会话更新状态
        const sessionList = (await chatModel.getSessionList()).filter(
            (item) => !isGroup(item.chatId)
        );
        let updatedFlag = false;
        let newSession = sessionList;
        // let newSession = sessionList.map((item) => {
        //     const { chatId } = item;
        //     if (!isGroup(chatId)) {
        //         const target = getSingleChatTarget(chatId);
        //         if (!items.includes(target) && !OfficialServices.includes(target)) {
        //             strangerIds.delete(chatId);
        //             item.hide = true;
        //             updatedFlag = true;
        //         }
        //     }
        //
        //     return item;
        // });

        // 剩下需要隐藏的单聊会话，
        if (strangerIds.size) {
            updatedFlag = true;
            const hideSession = Array.from(strangerIds).map((chatId) => {
                return {
                    chatId,
                    hide: true,
                    name: "",
                };
            });

            newSession = [...newSession, ...hideSession];
        }

        // 更新会话信息
        if (updatedFlag) await chatModel.bulkPutSession(newSession);

        // if (strangerIds && strangerIds.length) chatModel.hideSingleSessionByUid(strangerIds);

        // 刷新好友信息 缓存
        const avatarPath = localInfos.map(({ avatarPath, id }) => ({ id, avatarPath }));
        const info = mergeObArray(userInfo, contactsInfo, relationInfo, avatarPath, "id");
        //
        await memberModel.bulkPutMemberInfo([...updateStranger, ...info]);

        info.forEach(({ id, avatar }) => memberModel.checkAvatarCache(id, avatar));

        return info;
    }
};
