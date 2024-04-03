import getGroupMemberInfoList_pure from "@newSdk/service/api/group/getGroupMemberInfoList_pure";
import GroupMembers from "@newSdk/model/GroupMembers";

// 批量更新群人员信息

export const fetchGroupMemberInfoBulk = async (gid: string, uids: string[]) => {
    const members = await getGroupMemberInfoList_pure(gid, uids);

    if (!members) return [];

    GroupMembers.bulkPut(members, gid);
    return members;
};

export default fetchGroupMemberInfoBulk;
