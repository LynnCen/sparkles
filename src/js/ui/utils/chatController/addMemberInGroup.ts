import GroupMembersModel from "@newSdk/model/GroupMembers";
import session from "../../stores_new/session";
import { pickerStore } from "components/TmmPickerBoard/pickerStore";
import { GroupMaxMemberLimit } from "utils/chatController/createGroup";
import { message } from "antd";
import localFormat from "utils/localeFormat";
import inviteJoinGroup from "@newSdk/service/api/group/inviteJoinGroup";

export const addMemberInGroup = async (groupId: string) => {
    const groupMember = await GroupMembersModel.getGroupMembers(groupId);
    const uidList = groupMember.map((item) => item.uid);
    const { Contacts } = pickerStore.TabEnum;
    pickerStore.open({
        initialTab: Contacts,
        title: "SelectMembers",
        supportTab: [
            {
                type: Contacts,
                title: "Contacts",
            },
        ],
        okText: "ok",
        initTabFormatMap: {
            [Contacts]: (list) => list.filter((item) => !uidList.includes(item.id)),
        },

        resultHandler: async (selectedTabs) => {
            const list = pickerStore.getTabList(selectedTabs, pickerStore.TabEnum.Contacts);
            const ids = list.map((user) => user.id);

            if (ids.length + uidList.length > GroupMaxMemberLimit)
                return message.warn(localFormat({ id: "overGroupMemberSize" }));
            if (!groupId) return;
            try {
                await inviteJoinGroup(groupId, ids);
                return true;
            } catch (e) {
                return false;
            }
        },
    });
};
export default addMemberInGroup;
