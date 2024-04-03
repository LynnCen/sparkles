import { db } from "@newSdk/model/";
import { createSingleChatId } from "@newSdk/utils";
import UserInfo from "@newSdk/model/UserInfo";
import memberModel from "@newSdk/model/Members";
import chatModel from "@newSdk/model/Chat";
import axios from "@newSdk/service/apiCore/tmmCore";
import getRelationList from "@newSdk/service/api/addFriends/getRelationList";
import { isSuccess } from "@newSdk/utils/server_util";

export default async (id: string) => {
    try {
        const response = await axios({
            url: "/delFriend",
            method: "post",
            data: {
                id,
            },
        });

        const info = (await getRelationList([id])) || [];
        const relation = info[0] || {};

        if (!isSuccess(response)) return false;
        // if (code !== 200) return false;

        // delete localDB
        const memberTable = db?.table("memberInfos");
        const sessionTable = db?.table("chat");
        const messageTable = db?.table("message");

        if (!memberTable || !sessionTable || !messageTable) return;

        const sessionId = createSingleChatId(id, UserInfo._id);
        await db
            ?.transaction(
                "rw",
                memberTable,
                sessionTable,
                /* messageTable, */ () => {
                    memberTable?.update(id, { isFriend: relation.isFriend || 3 });
                    sessionTable?.where("chatId").equals(sessionId).delete();
                    // messageTable?.where("chatId").equals(sessionId).delete();
                }
            )
            .then(() => {
                memberModel.getMemberById(id).then((info) => memberModel.handlePublish([info]));
                chatModel.handleDeletePub(sessionId);
            })
            .catch((e: any) => {
                console.error("method of api/deleteFriend", e);
                return false;
            });

        return true;
    } catch (e) {
        console.error("method of api/deleteFriend", e);
        return false;
    }

    // delete session

    // delete message?
};
