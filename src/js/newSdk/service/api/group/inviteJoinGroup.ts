import axios from "@newSdk/service/apiCore/tmmCore";
import getGroupMemberInfoList from "@newSdk/service/api/group/getGroupMemberInfoList";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
import updateUserInfo from "@newSdk/logic/updateFriendsInfo";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
enum inviteJoinGroupStatus {
    UserDeleted = 100011, //User deleted
    GroupNotExist = 100006, //User deleted
    NoAuthority = 100007,
    UserNotExist = 100010,
    MaxLimit = 100100,
}
export default (gid: string, members: string[]) => {
    return axios({
        url: "/inviteJoinGroup",
        method: "post",
        data: {
            id: gid,
            obj_uid: members,
        },
    }).then((res) => {
        if (
            res.data.status === inviteJoinGroupStatus.GroupNotExist ||
            res.data.status === inviteJoinGroupStatus.NoAuthority ||
            res.data.status === inviteJoinGroupStatus.UserNotExist ||
            res.data.status === inviteJoinGroupStatus.MaxLimit
        ) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        if (res.data.status == inviteJoinGroupStatus.UserDeleted) {
            MessagePrompt.error(localFormat({ id: "delete_account_fail_todo" }));
            getUserListInfo(members);
            return false;
        }
        getGroupMemberInfoList(gid);
    });
};
