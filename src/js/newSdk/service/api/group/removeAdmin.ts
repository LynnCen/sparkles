import axios from "@newSdk/service/apiCore/tmmCore";
import getGroupMemberInfoList from "@newSdk/service/api/group/getGroupMemberInfoList";
import { isSuccess } from "@newSdk/utils/server_util";
import localFormat from "utils/localeFormat";
import { message as MessagePrompt } from "antd";
import groupMembersModel from "@newSdk/model/GroupMembers";
enum removeAdminStatus {
    GroupNotExist = 100006, //User deleted
    NoAuthority = 100007,
}
export default async (gid: string, uid: string) => {
    try {
        const response = await axios({
            url: "/removeGroupAdministrator",
            method: "post",
            data: {
                id: gid,
                uid,
            },
        });

        if (
            response.data.err_code === removeAdminStatus.GroupNotExist ||
            response.data.err_code === removeAdminStatus.NoAuthority
        ) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        return groupMembersModel.modifyMemberInfo(gid, uid, { isAdmin: 0 });
        // return getGroupMemberInfoList(gid);
    } catch (e) {
        console.error(`api method of removeAdmin`, e);
        return false;
    }
};
