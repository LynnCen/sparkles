import axios from "@newSdk/service/apiCore/tmmMomentsCore";

export const getFeedInfos = async (ids: string[]) => {
    if (!ids || !ids.length) return [];
    try {
        const res = await axios({
            url: "/getFeedInfos",
            method: "post",
            data: {
                ids,
            },
        });
        return res.data.items;
    } catch (e) {
        return [];
    }
};

export default getFeedInfos;
