// refresh all cache with group
import groupInfo, { GroupInfo } from "@newSdk/model/GroupInfo";
import getGroupsMemberIds from "@newSdk/service/api/group/getGroupsMemberIds";
import getGroupIdList from "@newSdk/service/api/group/getGroupIdList";

export const refreshOwnGroupList = async () => {
    const groups = await groupInfo.getAllGroups();
    // const gidList = groups.map((item) => item.id);

    const gidList = await getGroupIdList();

    //  获取全部群组
    const groupsMemberList = await getGroupsMemberIds(gidList);

    const memberCountMap = new Map();
    // const outOfGroup: string[] = [];

    // const
    groupsMemberList.forEach(({ id, uids }) => {
        // 群组人数
        memberCountMap.set(id, uids.length);
        // // 被删除
        // if (!uids.includes(tmmUserInfo._id)) {
        //     outOfGroup.push(id);
        // }
    });

    // 更新
    const newGroup: GroupInfo[] = [];
    groups.forEach((item) => {
        const { kicked, memberCount, id } = item;
        let updateFlag = false;

        const updateKicked = !gidList.includes(id);
        const updateMemberCount = memberCountMap.get(id);

        if (updateKicked !== kicked || memberCount !== updateMemberCount) updateFlag = true;

        item.kicked = updateKicked;
        item.memberCount = updateMemberCount;

        updateFlag && newGroup.push(item);
    });

    if (newGroup.length) {
        await groupInfo.bulkPutGroups(newGroup);
    }
};

export default refreshOwnGroupList;
