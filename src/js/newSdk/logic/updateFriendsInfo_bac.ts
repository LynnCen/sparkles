import getContactsInfo from "@newSdk/service/api/getUserListExtInfo";
import getRelationList from "@newSdk/service/api/addFriends/getRelationList";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
import memberModel, { FriendsStatus } from "@newSdk/model/Members";
import chatModel from "@newSdk/model/Chat";
import { getSingleChatTarget, isGroup, mergeObArray } from "@newSdk/utils";

export default async (items: string[]) => {
    if (items.length) {
        // base info
        const [
            contactsInfo,
            relationInfo,
            userInfo,
            localInfos,
            oldFriendList,
        ] = await Promise.all([
            getContactsInfo(items),
            getRelationList(items),
            getUserListInfo(items),
            memberModel.getMemberByIds(items),
            memberModel.getAllMyFriends(),
        ]);

        // get friends to stranger,
        const notFriendNow = oldFriendList.filter((item) => !items.includes(item.id));

        const strangerIds: string[] = [];
        const updateStranger = notFriendNow.map((item) => {
            item.isFriend = FriendsStatus.stranger;
            // strangerIds.push(item.id);
            return item;
        });

        const sessionList = await chatModel.getSessionList();
        let updatedFlag = false;
        const newSession = sessionList.map((item) => {
            const { chatId } = item;
            if (!isGroup(chatId)) {
                const target = getSingleChatTarget(chatId);
                if (!items.includes(target)) {
                    item.hide = true;
                    updatedFlag = true;
                }
            }

            return item;
        });
        // stranger hide session
        if (updatedFlag) chatModel.bulkPutSession(newSession);
        // if (strangerIds && strangerIds.length) chatModel.hideSingleSessionByUid(strangerIds);

        // friends info
        const avatarPath = localInfos.map(({ avatarPath, id }) => ({ id, avatarPath }));
        const info = mergeObArray(userInfo, contactsInfo, relationInfo, avatarPath, "id");
        //
        await memberModel.bulkPutMemberInfo([...updateStranger, ...info]);

        info.forEach(({ id, avatar }) => memberModel.checkAvatarCache(id, avatar));

        return info;
    }
};
