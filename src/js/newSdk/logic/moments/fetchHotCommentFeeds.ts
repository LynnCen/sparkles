import getCommentHotIds from "@newSdk/service/api/moments/getCommentHotIds";
import _ from "lodash";
import hotComment from "@newSdk/model/moments/HotComment";
import { groupListByKey } from "@newSdk/utils";

export const fetchHotCommentFeeds = async (ids: string[]) => {
    const list = await getCommentHotIds(ids);

    const group = groupListByKey(list, "mid");
    const hotFeeds = Object.entries(group).map(([key, val]) => ({
        key,
        val: JSON.stringify(val),
    }));
    await hotComment.bulkPut(hotFeeds);
    return group;
};

export default fetchHotCommentFeeds;
