import axios from "@newSdk/service/apiCore/tmmMomentsCore";

const REQUEST_API = "getCommentUpvoteLists";

export const getCommentLikes = async (ids: string[]) => {
    try {
        const res = await axios({
            url: REQUEST_API,
            method: "post",
            data: {
                ids,
            },
        });
        return res.data.items || [];
    } catch (e) {
        return [];
    }
};
