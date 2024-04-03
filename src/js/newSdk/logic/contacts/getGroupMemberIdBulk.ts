import chatModal from "@newSdk/model/Chat";
import getGroupsMemberIds from "@newSdk/service/api/group/getGroupsMemberIds";

// 刷新组 人员数
export const getGroupMemberIdBulk = async (gids: string[]) => {
    const map: any = {};

    const groupsMembers = await getGroupsMemberIds(gids);

    const sessionProps = groupsMembers.map(({ id, uids }) => {
        const memberCount = (uids || []).length;
        map[id] = memberCount;

        return { chatId: id, memberCount };
    });

    chatModal.updateSessionBulkIfExist(sessionProps);
    return map;
};
