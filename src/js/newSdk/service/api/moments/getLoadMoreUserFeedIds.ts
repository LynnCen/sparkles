import axios from "@newSdk/service/apiCore/tmmMomentsCore";

interface IProps {
    uid: string;
    sequence: number;
}

export const getLoadMoreUserFeedIds = async (data: IProps) => {
    try {
        const res = await axios({
            url: "/getLoadMoreUserFeedIds",
            method: "post",
            data,
        });
        return {
            abstract: res.data.abstract.items,
            topic: res.data.topic.item,
            flow: res.data.flow.items,
        };
    } catch (e) {
        return {
            abstract: [],
            topic: [],
            flow: [],
        };
    }
};

export default getLoadMoreUserFeedIds;
