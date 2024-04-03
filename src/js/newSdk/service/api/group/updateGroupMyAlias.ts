import axios from "@newSdk/service/apiCore/tmmCore";
import UserInfo from "@newSdk/model/UserInfo";
import groupMembersModel from "@newSdk/model/GroupMembers";
import { isSuccess } from "@newSdk/utils/server_util";
import localFormat from "utils/localeFormat";
import { message as MessagePrompt } from "antd";
enum updateGroupMyAliasStatus {
    GroupNotExist = 100006,
    NoAuthority = 100007,
}
export default async (groupId: string, val: string) => {
    try {
        const response = await axios({
            url: "/updateGroupMyAlias",
            method: "post",
            data: { id: groupId, my_alias: val },
        });
        if (
            response.data.status === updateGroupMyAliasStatus.GroupNotExist ||
            response.data.status === updateGroupMyAliasStatus.NoAuthority
        ) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        if (!isSuccess(response)) return false;

        // groupMembersModel.
        groupMembersModel.modifyMemberInfo(groupId, UserInfo._id, { alias: val });
        return true;
    } catch (e) {
        console.error(`api method if updateGroupMyAlias`, e);
        return false;
    }
};
