import axios from "@newSdk/service/apiCore/tmmCore";
import memberModel from "@newSdk/model/Members";
import { isSuccess } from "@newSdk/utils/server_util";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
import updateUserInfo from "@newSdk/logic/updateFriendsInfo";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
enum updateUserRemarkAliasStatus {
    UserDeleted = 100011, //User deleted
}
export default async (uid: string, alias: string) => {
    const response = await axios({
        url: "/updateUserRemarkAlias",
        method: "post",
        data: {
            uid,
            alias,
        },
    });
    if (response.data.status == updateUserRemarkAliasStatus.UserDeleted) {
        MessagePrompt.error(localFormat({ id: "delete_account_fail_todo" }));
        getUserListInfo([uid]);
        return false;
    }
    if (isSuccess(response)) {
        await memberModel.updateMemberInfo(uid, { friendAlias: alias });
        return true;
    }

    return false;
};
