import axios from "@newSdk/service/apiCore/tmmCore";
import getGroupMemberInfoList from "@newSdk/service/api/group/getGroupMemberInfoList";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
import updateUserInfo from "@newSdk/logic/updateFriendsInfo";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
import { isSuccess } from "@newSdk/utils/server_util";
import groupMembersModel from "@newSdk/model/GroupMembers";
interface ResponseItems {
    id: string;
    uid: string;
    admin_time: number;
}
enum addAdminStatus {
    GroupNotExist = 100006, //User deleted
    NoAuthority = 100007,
}
export default async (gid: string, uids: string[]) => {
    try {
        const res = await axios({
            url: "/addGroupAdministrators",
            method: "post",
            data: {
                id: gid,
                uids: uids,
            },
        });
        if (res.data.err_code === addAdminStatus.GroupNotExist) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        if (res.data.err_code === addAdminStatus.NoAuthority) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        res.data.items.forEach(({ id, uid, admin_time }: ResponseItems) => {
            groupMembersModel.modifyMemberInfo(gid, uid, { isAdmin: 1, adminTime: admin_time });
        });
    } catch (error) {
        console.error(`api method if addGroupAdministrator`, error);
        return false;
    }
};
