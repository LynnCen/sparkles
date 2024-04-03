import axios from "@newSdk/service/apiCore/tmmCore";
import UserInfo from "@newSdk/model/UserInfo";
import { GroupMembers } from "@newSdk/model/GroupMembers";
import { db } from "@newSdk/model";
import chatModel from "@newSdk/model/Chat";
import { isSuccess } from "@newSdk/utils/server_util";
import { GroupInfo } from "@newSdk/model/GroupInfo";

export default async (gid: string, isDelete?: boolean) => {
    try {
        const response = await axios({
            url: "/quitGroup",
            method: "post",
            data: { id: gid, is_del_chat: isDelete ? 1 : 0 },
        });

        if (!isSuccess(response)) return false;

        // delete current user;
        await db?.groupMembers
            ?.where("gid")
            .equals(gid)
            .and((item: GroupMembers) => item.uid === UserInfo._id)
            // ?.delete();
            .modify({ deleted: true, isAdmin: 0, isOwner: 0 });

        await db?.groupInfo
            ?.where("uid")
            .equals(UserInfo._id)
            .filter((item: GroupInfo) => item.id === gid)
            .modify({ kicked: true });
        // await db
        //     ?.transaction("rw", db?.groupMembers, db?.chat, db?.message, async () => {
        //         // await db?.groupMembers
        //         //     ?.where("gid")
        //         //     .equals(gid)
        //         //     .and((item: GroupMembers) => item.uid === UserInfo._id)
        //         //     ?.delete();
        //         // await db?.chat.where("chatId").equals(gid).delete();
        //         // db?.message.where("chatId").equals(gid).delete();
        //     })
        //     .then(() => {
        //         // chatModel.handleDeletePub(gid);
        //     });
    } catch (e) {
        console.error(`api method of quitGroup`, e);
        return false;
    }
};
