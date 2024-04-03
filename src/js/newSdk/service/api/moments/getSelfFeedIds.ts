import axios from "@newSdk/service/apiCore/tmmMomentsCore";

export const getSelfFeedIds = async (sequence: number) => {
    try {
        const res = await axios({
            url: "/getSelfFeedIds",
            method: "post",
            data: {
                sequence,
            },
        });
        return {
            flow: res.data.flow.items || [],
            topic: res.data.topic.items || [],
            abstract: res.data.abstract.items || [],
        };
    } catch (e) {
        return {
            flow: [],
            topic: [],
            abstract: [],
        };
    }
};

export default getSelfFeedIds;
