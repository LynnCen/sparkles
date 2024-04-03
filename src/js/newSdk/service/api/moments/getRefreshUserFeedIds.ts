import axios from "@newSdk/service/apiCore/tmmMomentsCore";

interface IProps {
    uid: string;
    sequence: number;
}
export const getRefreshUserFeedIds = async (data: IProps) => {
    try {
        const res = await axios({
            url: "/getRefreshUserFeedIds",
            method: "post",
            data,
        });

        return {
            abstract: res.data.abstract.items || [],
            flow: res.data.flow.items || [],
            topic: res.data.topic.items || [],
        };
    } catch (e) {
        return {
            abstract: [],
            flow: [],
            topic: [],
        };
    }
};

export default getRefreshUserFeedIds;
