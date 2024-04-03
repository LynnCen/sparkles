import axios from "@newSdk/service/apiCore/tmmMomentsCore";

export const getTopicDetails = async (ids: string[]) => {
    try {
        const res = await axios({
            url: "/getTopicDetails",
            method: "post",
            data: { ids },
        });
        return res.data.items || [];
    } catch (e) {
        return [];
    }
};

export default getTopicDetails;
