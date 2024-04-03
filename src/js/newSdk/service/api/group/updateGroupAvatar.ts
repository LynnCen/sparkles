import axios from "@newSdk/service/apiCore/tmmCore";
import { AvatarPropsCom } from "@newSdk/typings";
import { isSuccess } from "@newSdk/utils/server_util";
import GroupInfo from "@newSdk/model/GroupInfo";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
interface AvatarProps {}
enum updateGroupAvatarStatus {
    ParameterError = 400, //User deleted
    GroupNotExist = 100006, //User deleted
    NoAuthority = 100007,
}
export const updateGroupAvatar = async (gid: string, avatar: AvatarPropsCom) => {
    try {
        const response = await axios({
            url: "/updateGroupAvatar",
            method: "post",
            data: {
                id: gid,
                avatar,
            },
        });
        if (
            response.data.status === updateGroupAvatarStatus.GroupNotExist ||
            response.data.status === updateGroupAvatarStatus.NoAuthority ||
            response.data.status === updateGroupAvatarStatus.ParameterError
        ) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        const sus = isSuccess(response);

        if (sus) await GroupInfo.checkAvatarCache(gid, avatar);
        return sus;
    } catch (e) {
        return false;
    }
};
