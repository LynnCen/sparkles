import axios from "@newSdk/service/apiCore/tmmMomentsCore";
import { ReplyItem } from "@newSdk/model/comment/CommentItem";
import { createMomentId } from "@newSdk/utils";
import UserInfo from "@newSdk/model/UserInfo";
import ErrorStatus from "@newSdk/service/api/Error/ErrorStatus";

const REQUEST_API = "comment";

export const sendComment = async (comment: ReplyItem) => {
    const mid = createMomentId(UserInfo._id);
    try {
        const res = await axios({
            url: REQUEST_API,
            method: "post",
            data: { ...comment, id: mid },
        });

        if (res.data.status === 100006) {
            const {
                // @ts-ignore
                msg,
                data: { status },
            } = res;
            throw new ErrorStatus(msg, status);
        }

        return res.data.items || [];
    } catch (e) {
        throw e;
    }
};
