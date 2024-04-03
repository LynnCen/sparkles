import memberInfoModel from "@newSdk/model/Members";
import { From_Type } from "@newSdk/consts/friend_misc";
import axios from "../../apiCore/tmmCore";

const REQUEST_API = "/searchUserByKeywords";
const getResult = (value: string) => {
    return axios({
        url: REQUEST_API,
        method: "post",
        data: {
            keywords: value.trim(),
        },
    });
};

const getSearchResult = async (value: string) => {
    try {
        const {
            data: { items: res },
        } = await getResult(value);
        if (!res.id) {
            return { user: null };
        }
        const ids = await memberInfoModel.getUnExistIdsByUid([res.id]);
        let user = res;
        if (ids.length) {
            memberInfoModel.addMemberInto(res);
        } else {
            user = await memberInfoModel.getMemberById(res.id);
        }

        const from_way = value.trim() === res.tmm_id ? From_Type.FROM_TMM : From_Type.FROM_PHONE;
        return { from_way, user };
    } catch (e) {
        console.log(e);
    }
};

export default getSearchResult;
