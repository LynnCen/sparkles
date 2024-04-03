import axios from "@newSdk/service/apiCore/tmmMomentsCore";
import { IMomentLike } from "@newSdk/model/moments/Likes";

const REQUEST_API = "getUpvoteLists";

export const getUpvoteLists = async (ids: string[]): Promise<IMomentLike[]> => {
    try {
        const res = await axios({
            url: REQUEST_API,
            method: "post",
            data: {
                ids,
            },
        });
        return res.data.items || [];
    } catch (e) {
        return [];
    }
};
