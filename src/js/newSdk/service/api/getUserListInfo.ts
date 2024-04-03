import axios from "../apiCore/tmmCore";
import { Avatar, Switch } from "../../model/types";
import imgUtils from "../../utils/ImageSource";
import memberModel, { FriendsStatus } from "../../model/Members";
import { mergeObArray } from "@newSdk/utils";

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
    status?: number;
}

export default async (ids: string[], hookFlag = false) => {
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

    if (hookFlag) return items.map(memberModel.friendInfoTransfer);

    const existList = await memberModel.getMemberByIds(ids);
    const upList = items.map((item: UserInfoItem) => {
        const info = memberModel.friendInfoTransfer(item);
        const { id, avatar } = info;
        memberModel.checkAvatarCache(id, avatar);
        return info;
    });

    // const stableProp = existList.map(({ isFriend, avatarPath, id }) => {
    //     const options: any = { id };
    //     if (isFriend != undefined) options.isFriend = isFriend;
    //     if (avatarPath != undefined) options.avatarPath = avatarPath;
    // });
    const existMap = mergeObArray(upList, existList, "id");

    memberModel.bulkPutMemberInfo(existMap);
    return upList;
};
