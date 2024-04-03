import axios from "@newSdk/service/apiCore/tmmMomentsCore";
import { ReplyItem } from "@newSdk/model/comment/CommentItem";

const REQUEST_API = "getCommentList";

export const getComments = async (ids: string[]): Promise<ReplyItem[]> => {
    try {
        const res = await axios({
            url: REQUEST_API,
            method: "post",
            data: {
                ids: ids,
            },
        });
        return res.data.items || [];
    } catch (e) {
        console.log(e);
        return [];
    }
};
