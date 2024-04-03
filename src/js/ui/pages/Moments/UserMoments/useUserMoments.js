/**
 * @Author Pull
 * @Date 2021-10-15 10:26
 * @project useUserMoments
 */
import { useEffect, useState } from "react";
import { MomentsTypeTab, DefaultMomentsTypeTb } from "../constants/tabs";
import { createSingleChatId } from "@newSdk/utils";
import UserInfo from "@newSdk/model/UserInfo";
import addApplyFriend from "@newSdk/service/api/addFriends/applyToBeFriend";
import { From_Type } from "@newSdk/consts/friend_misc";
import session from "../../../stores_new/session";

export const useUserMoments = (uid, history) => {
    const defaultSearch = {
        uid,
        startIndex: 0,
        lastSequence: 0,
    };
    const [query, setQuery] = useState(DefaultMomentsTypeTb.value);
    const [sendReq, setSendReq] = useState(false);

    const chatWith = () => {
        const chatId = createSingleChatId(UserInfo._id, uid);
        session.selectSession(chatId, true, true);
        if (history.location.pathname !== "/") {
            history.push("/");
        }
    };

    const addFriend = async () => {
        try {
            const res = await addApplyFriend(uid, From_Type.FROM_MOMENTS);
            if (res) setSendReq(true);
        } catch (e) {}
    };
    return {
        query,
        setQuery,
        sendReq,
        chatWith,
        addFriend,
    };
};

export default useUserMoments;
