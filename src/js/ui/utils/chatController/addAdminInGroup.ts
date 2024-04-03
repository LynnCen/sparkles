import GroupMembersModel from "@newSdk/model/GroupMembers";
import session from "../../stores_new/session";
import { pickerStore } from "components/TmmPickerBoard/pickerStore";
import { GroupMaxMemberLimit } from "utils/chatController/createGroup";
import { message } from "antd";
import localFormat from "utils/localeFormat";
import addGroupAdmin from "@newSdk/service/api/group/addGroupAdmin";
import { userStatus } from "@newSdk/consts/userStatus";
export const addAdminInGroup = async (groupId: string) => {
    const groupMember = await GroupMembersModel.getGroupMembers(groupId);
    const uidList = groupMember.map((item) => item.uid);
    const { GroupMembers } = pickerStore.TabEnum;
    pickerStore.open({
        initialTab: GroupMembers,
        title: "SelectMembers",
        supportTab: [
            {
                type: GroupMembers,
                title: "mp_member",
            },
        ],
        okText: "ok",
        initTabFormatMap: {
            [GroupMembers]: (list) =>
                list
                    .filter((item) => {
                        // if (item.isOwner) return false;
                        if (item.isAdmin || item.isOwner) return false;
                        return true;
                    })
                    .sort((a, b) => {
                        // sort by join time
                        return a.createTime - b.createTime;
                    }),
        },

        resultHandler: async (selectedTabs) => {
            const list = pickerStore.getTabList(selectedTabs, pickerStore.TabEnum.GroupMembers);
            console.log(list);
            const ids = list.map((user) => user.id);
            console.log(ids);
            if (ids.length + uidList.length > GroupMaxMemberLimit)
                return message.warn(localFormat({ id: "overGroupMemberSize" }));
            if (!groupId) return;
            try {
                await addGroupAdmin(groupId, ids);
                return true;
            } catch (e) {
                return false;
            }
        },
    });
};
export default addAdminInGroup;
