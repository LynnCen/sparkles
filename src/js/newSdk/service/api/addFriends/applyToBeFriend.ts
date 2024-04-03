import axios from "../../apiCore/tmmCore";
import { isSuccess } from "@newSdk/utils/server_util";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
const REQUEST_API = "/addApplyFriend";
enum applyToFriendStatus {
    UserDeleted = 100011, //User deleted
}
export default async (id: string, from_way: number) => {
    const res = await axios({
        url: REQUEST_API,
        method: "post",
        data: {
            uid: id,
            from_way,
        },
    });
    if (res.data.err_code == applyToFriendStatus.UserDeleted) {
        MessagePrompt.error(localFormat({ id: "delete_account_fail_todo" }));
        getUserListInfo([id]);
        return false;
    }
    if (isSuccess(res)) MessagePrompt.success(localFormat({ id: "applySend" }));
    return true;
};
