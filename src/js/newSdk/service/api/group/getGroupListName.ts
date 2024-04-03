import axios from "@newSdk/service/apiCore/tmmCore";
import groupInfoModel from "@newSdk/model/GroupInfo";
import { Avatar } from "@newSdk/model/types";
import imgUtils from "@newSdk/utils/ImageSource";

interface ResponseData {
    id: string;
    name: string;
    avatar: Avatar;
}

export default async (ids: string[]) => {
    try {
        const {
            data: { items = [] },
        } = await axios({
            url: "/getGroupListName",
            method: "post",
            data: { ids },
        });

        if (items && items.length) {
            await groupInfoModel.bulkPutGroups(items);
            items.forEach((item: ResponseData) =>
                groupInfoModel.checkAvatarCache(item.id, item.avatar)
            );
        }
        return items;
    } catch (e) {
        console.error("api method of getGroupList", e);
        return [];
    }
};
