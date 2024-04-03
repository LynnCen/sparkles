import axios from "@newSdk/service/apiCore/tmmMomentsCore";
import tmmUserInfo from "@newSdk/model/UserInfo";

export const getHotFeedIds = async (phonePrefix = tmmUserInfo.phone_prefix) => {
    try {
        const res = await axios({
            url: "/getHotFeedIds",
            method: "post",
            data: {
                phone_prefix: phonePrefix,
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

export default getHotFeedIds;
