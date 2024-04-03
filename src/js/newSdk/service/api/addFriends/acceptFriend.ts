import memberModel from "@newSdk/model/Members";
import friendApply from "@newSdk/logic/friendReq";
import agreeApplyFriend from "@newSdk/service/api/addFriends/agreeApplyFriend";
import { Friend_relationship } from "@newSdk/consts/friend_misc";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
import updateUserInfo from "@newSdk/logic/updateFriendsInfo";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
enum acceptFriendStatus {
    UserDeleted = 100011, //User deleted
}
const acceptFriend = async (uid: string, applyId: string) => {
    try {
        const res = await agreeApplyFriend(uid);
        if (res.data.status == acceptFriendStatus.UserDeleted) {
            MessagePrompt.error(localFormat({ id: "delete_account_fail_todo" }));
            getUserListInfo([uid]);
            return false;
        }
        return Promise.all([
            memberModel.modifyMemberInfo(uid, {
                id: uid,
                isFriend: Friend_relationship.BOTH_FRIEND,
            }),
            friendApply.update(applyId, { status: 1 }),
        ]);
    } catch (e) {
        throw e;
    }
};

export default acceptFriend;
