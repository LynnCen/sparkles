import axios from "@newSdk/service/apiCore/tmmMomentsCore";
import { CommentIdType } from "@newSdk/model/comment/CommentId";

const REQUEST_API = "getCommentIds";

export const getCommentIds = async (id: string): Promise<CommentIdType[]> => {
    try {
        const res = await axios({
            url: REQUEST_API,
            method: "post",
            data: {
                mids: [id],
            },
        });
        return res.data.items || [];
    } catch (e) {
        return [];
    }
};
