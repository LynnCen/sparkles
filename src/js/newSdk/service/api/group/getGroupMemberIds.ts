import axios from "@newSdk/service/apiCore/tmmCore";
import chatModel from "@newSdk/model/Chat";
import groupMemberModel from "@newSdk/model/GroupMembers";
import GroupInfo from "@newSdk/model/GroupInfo";
import tmmUserInfo from "@newSdk/model/UserInfo";

// 获取单个组成员
export default async (gid: string) => {
    try {
        const {
            data: { items },
        } = await axios({
            url: "/getGroupMemberIds",
            method: "post",
            data: {
                id: gid,
            },
        });

        return items;
    } catch (e) {
        console.error("api method of session/getGroupMemberIds", e);
        return false;
    }
};
