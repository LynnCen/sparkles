import GroupModel from "@newSdk/model/GroupInfo";
import GroupMemberModel, { GroupMembers } from "@newSdk/model/GroupMembers";
import UserInfo from "@newSdk/model/UserInfo";

// legacy
export default async () => {
    // 已被提出群聊
    const kickedGroup = await GroupMemberModel.getUnKickedGroup(UserInfo._id);
    // if (!groups || !groups!.length) return [];

    const set = new Set<string>();
    kickedGroup.forEach((item: GroupMembers) => set.add(item.gid));

    const list = await GroupModel.getAllGroups();

    const kickedList = Array.from(set);
    return list.filter((item) => !kickedList.includes(item.id));
};
