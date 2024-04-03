import getCommentIds from "@newSdk/service/api/moments/getCommentIds";
import _ from "lodash";
export const getCommentsCountBulk = async (ids: string) => {
    const res = await getCommentIds(ids);

    const group = _.groupBy(res, "mid");

    const map: { [key: string]: number } = {};
    Object.entries(group).forEach(([key, value]) => {
        map[key] = value.length;
    });
    return map;
};
export default getCommentsCountBulk;
