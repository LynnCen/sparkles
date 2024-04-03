import axios from "@newSdk/service/apiCore/tmmMomentsCore";

export const getRepostLists = async (
    refer_pre_ids: string[]
): Promise<Record<string, string>[]> => {
    try {
        const res = await axios({
            url: "/getRepostLists",
            method: "post",
            data: {
                refer_pre_ids,
            },
        });
        return res.data.items || [];
    } catch (e) {
        return [];
    }
};

export default getRepostLists;
