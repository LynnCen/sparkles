import CommentItem, { ReplyItem } from "@newSdk/model/comment/CommentItem";
import getCommentList from "@newSdk/service/api/comments/getCommentList";
import hotComment from "@newSdk/model/moments/HotComment";
import _ from "lodash";
import { arrayToMap, groupListByKey } from "@newSdk/utils";
import fetchHotFeeds from "@newSdk/logic/moments/fetchHotFeeds";
import fetchHotCommentFeeds from "@newSdk/logic/moments/fetchHotCommentFeeds";
import { getComments } from "@newSdk/service/api/comments/fetchComments";

export const loadHotComment = async (momentsId: string[], isRefresh = false) => {
    if (!momentsId || !momentsId.length) return {};
    const commentsMap = await hotComment.bulkGetCommentsByMomentIds(momentsId);
    // console.log(momentsId);
    // console.log(commentsMap);
    // 刷新评论。
    if (isRefresh) fetchHotCommentFeeds(momentsId);

    const commentItem = _.flatten(Object.values(commentsMap));

    const ids = commentItem.map((item) => item.id);

    let localList = await CommentItem.bulkGet(ids);
    // console.log(localList);

    // console.log(`${localList.length} ${ids.length}`, localList.length !== ids.length);
    // 本地数据 缺少
    if (localList.length !== ids.length) {
        const existList = localList.map((item) => item.id);
        const unExistList = ids.filter((id) => !existList.includes(id));
        const res = await getComments(unExistList);
        // console.log(res);
        // await CommentRepo.bulkDelete(localList);
        await CommentItem.bulkAddComments(res);
        localList = [...localList, ...res];
    }

    const map: { [key: string]: ReplyItem[] } = groupListByKey(localList, "mid");

    // 排序
    const sortMap: { [key: string]: ReplyItem[] } = {};
    Object.entries(map).map(([k, v]) => {
        // 有序的id列表
        const sortFeedList = commentsMap[k];
        if (!sortFeedList) {
            sortMap[k] = v;
            return;
        }

        const dataMap = arrayToMap(v, "id");

        const sortComments = sortFeedList.map((item) => dataMap.get(item.id)).filter(Boolean);
        sortMap[k] = sortComments;
    });

    // console.log(map);
    return sortMap || {};
};

export default loadHotComment;
