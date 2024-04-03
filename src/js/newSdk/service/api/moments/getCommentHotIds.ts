import axios from "@newSdk/service/apiCore/tmmMomentsCore";

export const getCommentHotIds = async (mids: string[]) => {
    const res = await axios({
        url: "/getCommentHotIds",
        method: "post",
        data: {
            mids,
        },
    });

    try {
        return res.data.items;
    } catch (e) {
        return [];
    }
};

export default getCommentHotIds;
