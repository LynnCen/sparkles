import axios from "@newSdk/service/apiCore/tmmCore";
import { Avatar } from "@newSdk/model/types";
import imgUtils from "@newSdk/utils/ImageSource";
import localFormat from "utils/localeFormat";
import GroupInfo from "@newSdk/model/GroupInfo";
import { message as MessagePrompt } from "antd";
enum getGroupNoticeStatus {
    GroupNotExist = 100006, //User deleted
    NoAuthority = 100007,
}
export default async (gid: string, noticeId: string) => {
    try {
        const { data } = await axios({
            url: "/getGroupNotice",
            method: "post",
            data: { id: gid, notice_id: noticeId },
        });
        if (
            data.err_code === getGroupNoticeStatus.GroupNotExist ||
            data.err_code === getGroupNoticeStatus.NoAuthority
        ) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        if (noticeId === data.notice_id) return;
        await GroupInfo.updateGroupInfoById(gid, {
            notice: data.notice,
            isNewNotice: data.notice == "" ? false : true,
        });
    } catch (e) {
        console.error("api method of getGroupNotice", e);
        return [];
    }
};
