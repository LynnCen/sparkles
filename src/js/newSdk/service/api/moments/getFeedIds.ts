import axios from "@newSdk/service/apiCore/tmmMomentsCore";
import tmmUserInfo from "@newSdk/model/UserInfo";

export const getFeedIds = async (sequence: number) => {
    try {
        const res = await axios({
            url: "/getFeedIds",
            method: "post",
            data: {
                sequence,
                phone_prefix: tmmUserInfo.phone_prefix,
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

export default getFeedIds;
