import axios from "../apiCore/tmmCore";
import { Avatar, Switch } from "../../model/types";
import memberModel from "../../model/Members";

export interface UserInfoItem {
    id: string;
    tmm_id: string;
    isset_tmm_id: Switch;
    avatar: Avatar;
    f_name: string; // firstName
    l_name: string; // lastName
    gender: Switch;
    phone: string;
    qr_code: string;
    region_id: string;
    signature: string;
    status: number;
}

export const getUserListInfo_pure = async (ids: string[]) => {
    if (!ids || !ids.length) return [];

    let res;

    try {
        res = await axios({
            url: "/getUserListInfo",
            method: "POST",
            data: {
                ids,
            },
        });
    } catch (e) {
        console.error(`------------> error in getUserListInfo`, e);
        return false;
    }

    const {
        data: { items },
    } = res;

    const list = items.map((item: UserInfoItem) => {
        const info = memberModel.friendInfoTransfer(item);
        const { id, avatar } = info;
        memberModel.checkAvatarCache(id, avatar);
        return info;
    });
    return list;
};

export default getUserListInfo_pure;
