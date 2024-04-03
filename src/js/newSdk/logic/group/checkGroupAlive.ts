/**
 * is kicked
 */
import getGroupMemberIds from "@newSdk/service/api/group/getGroupMemberIds";
import tmmUserInfo from "@newSdk/model/UserInfo";
import GroupInfo from "@newSdk/model/GroupInfo";

export const checkGroupAlive = async (gid: string) => {
    const items = await getGroupMemberIds(gid);

    if (!items) return {};

    const kicked = !items.includes(tmmUserInfo._id);
    await GroupInfo.updateGroupInfoById(gid, { memberCount: items.length, kicked });

    return { kicked };
};

export default checkGroupAlive;
