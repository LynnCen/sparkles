import axios from "@newSdk/service/apiCore/tmmMomentsCore";

export const getCommentList = async (pids: string[]) => {
    const list = await axios({
        url: "/getCommentIdByPIds",
        method: "post",
        data: {
            pids,
        },
    });

    return list.data.items || [];
};

export default getCommentList;
