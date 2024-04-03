import axios from "@newSdk/service/apiCore/tmmMomentsCore";

export const getCommentIds = async (mids: string) => {
    try {
        const res = await axios({
            url: "/getCommentIds",
            method: "post",
            data: {
                mids,
            },
        });
        return res.data.items || [];
    } catch (e) {
        return [];
    }
};

export default getCommentIds;
