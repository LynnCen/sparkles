import axios from "@newSdk/service/apiCore/tmmCore";
import { db } from "@newSdk/model";
import chatModel from "@newSdk/model/Chat";
import groupInfoModel from "@newSdk/model/GroupInfo";
import { isSuccess } from "@newSdk/utils/server_util";
import localFormat from "utils/localeFormat";
import { message as MessagePrompt } from "antd";
enum updateGroupNameStatus {
    GroupNotExist = 100006,
    NoAuthority = 100007,
}
export default async (gid: string, name: string) => {
    try {
        const response = await axios({
            url: "/updateGroupName",
            method: "post",
            data: {
                id: gid,
                name,
            },
        });
        if (
            response.data.status === updateGroupNameStatus.GroupNotExist ||
            response.data.status === updateGroupNameStatus.NoAuthority
        ) {
            MessagePrompt.error(localFormat({ id: "op_fail" }));
            return false;
        }
        if (!isSuccess(response)) return false;
        // else return false;
        await db
            ?.transaction("rw", db?.groupInfo, db?.chat, async () => {
                // modify groupInfo name
                await db?.groupInfo.update(gid, { name });
                await db?.chat.update(gid, { name });
            })
            .then(async () => {
                const newGroup = await groupInfoModel.getGroupInfo(gid);
                if (newGroup) return groupInfoModel.handlePublish([newGroup]);
            })
            .catch(console.error);
        return true;
    } catch (e) {
        console.error(`api method of updateGroupName`, e);
        return false;
    }
};
