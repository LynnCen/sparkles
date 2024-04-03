import axios from "@newSdk/service/apiCore/tmmCore";
import groupInfoModel from "@newSdk/model/GroupInfo";
import { Avatar } from "@newSdk/model/types";
import imgUtils from "@newSdk/utils/ImageSource";
import localFormat from "utils/localeFormat";
import { message as MessagePrompt } from "antd";
import GroupInfo from "@newSdk/model/GroupInfo";
enum updateGroupNoticeStatus {
    GroupNotExist = 100006, //User deleted
    NoAuthority = 100007,
}
export default async (gid: string, notice: string) => {
    try {
        const { data } = await axios({
            url: "/updateGroupNotice",
            method: "post",
            data: { id: gid, notice: notice },
        });
        if (
            data.err_code === updateGroupNoticeStatus.GroupNotExist ||
            data.err_code === updateGroupNoticeStatus.NoAuthority
        ) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        await GroupInfo.updateGroupInfoById(gid, {
            notice: notice,
            isNewNotice: notice ? true : false,
        });
        return true;
    } catch (e) {
        console.error("api method of updateGroupNotice", e);
        return [];
    }
};
