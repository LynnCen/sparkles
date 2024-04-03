import axios from "@newSdk/service/apiCore/tmmCore";
import getGroupMemberInfoList from "@newSdk/service/api/group/getGroupMemberInfoList";
import { isSuccess } from "@newSdk/utils/server_util";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
enum removeStatus {
    GroupNotExist = 100006, //User deleted
    NoAuthority = 100007,
}
export default async (gid: string, uids: string[]) => {
    try {
        const response = await axios({
            url: "/kickOutGroup",
            method: "post",
            data: {
                id: gid,
                uids,
            },
        });
        if (
            response.data.err_code === removeStatus.GroupNotExist ||
            response.data.err_code === removeStatus.NoAuthority
        ) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        if (!isSuccess(response)) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        return getGroupMemberInfoList(gid);
    } catch (e) {
        console.error(`api method of kickOutGroup`, e);
        return false;
    }
};
