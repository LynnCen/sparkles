import axios from "../apiCore/tmmCore";
import { Avatar, Switch } from "../../model/types";
import memberModel from "../../model/Members";
import getContactsIds from "@newSdk/service/api/getContactsIds";
// import

interface UserInfoItem {
    alias: string;
    obj_uid: string;
    is_star: Switch;
    u_avatar: Avatar;
    u_name: string;
    remark_text: string;
    tag: string[];
    view_detail: Switch;
    is_read: Switch;
    from_way: number;
}

export default async (ids: string[]) => {
    if (!ids) {
        try {
            ids = await getContactsIds();
        } catch (e) {}
    }

    if (!ids.length) return [];
    try {
        const {
            data: { items },
        } = await axios({
            url: "/getUserListExtInfo",
            method: "POST",
            data: {
                ids,
            },
        });

        return items.map(dataTransfer);

        // if (hookFlag) return list;
        //
        // const existList = await memberModel.getMemberByIds(ids);
        // const upList = mergeObArray(existList, list, "id");
        // memberModel.bulkPutMemberInfo(upList);
        // return list;
    } catch (e) {
        console.error(`api method of getContactsListInfo`, e);
        return false;
    }
};

const dataTransfer = (item: UserInfoItem) => {
    const { alias, obj_uid, is_star, view_detail, tag } = item;
    return {
        id: obj_uid,
        friendAlias: alias,
        isStar: is_star,
        viewDetail: view_detail,
        isRead: view_detail,
        tag,
    };
};
