import UserInfo from "@newSdk/model/UserInfo";
import { createGroupChatId } from "@newSdk/utils";
import axios from "@newSdk/service/apiCore/tmmCore";
import { db } from "@newSdk/model";
import groupModel from "@newSdk/model/GroupInfo";
import chatModel from "@newSdk/model/Chat";
import groupMemberModel from "@newSdk/model/GroupMembers";
import { Avatar } from "@newSdk/model/types";
import { CancelToken, AxiosRequestConfig } from "axios";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
import updateUserInfo from "@newSdk/logic/updateFriendsInfo";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
interface ICreateChat {
    name: string;
    gid: string;
    memberIds: string[];
    localPath: string;
}
enum createGroupStatus {
    UserDeleted = 100011, //User deleted
}
export default async (
    { gid, name, memberIds, localPath }: ICreateChat,
    cancelToken?: CancelToken
) => {
    const requestConfig: AxiosRequestConfig = {
        url: "/createGroup",
        method: "post",
        data: {
            id: gid,
            // avatar: JSON.stringify(avatar),
            name,
            members: memberIds,
        },
    };
    if (cancelToken) requestConfig.cancelToken = cancelToken;
    const res = await axios(requestConfig);
    if (res.data.status == createGroupStatus.UserDeleted) {
        MessagePrompt.error(localFormat({ id: "delete_account_fail_todo" }));
        getUserListInfo(memberIds);
        return false;
    }
    // TODO
    await db
        ?.transaction("rw", db?.groupInfo, db?.chat, db?.memberInfos, async () => {
            await groupModel.putGroup({
                id: gid,
                // avatar,
                avatarPath: localPath,
                name,
                uid: UserInfo._id,
            });
            await chatModel.addConversation({
                chatId: gid,
                // avatar: localPath,
                isMute: 0,
                isTop: 0,
                timestamp: Date.now(),
                name,
            });
            return;
        })
        .then(() => {
            groupMemberModel.getGroupMembers(gid, true);
        })
        .catch(console.error);
    return gid;
};
