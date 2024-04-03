import { getCommentLikes } from "@newSdk/service/api/comments/likes";
import nc from "@newSdk/notification";
import commentLikeStore from "@newSdk/model/comment/CommentLikes";
import commentIdsStore from "@newSdk/model/comment/CommentId";

async function updateCommentLikes(ids: string[]) {
    const remoteDate = await getCommentLikes(ids);
    await commentLikeStore.bulkDel(ids);
    commentLikeStore.bulkPut(remoteDate);
}

async function getLikesRepo(momentId: string) {
    const likes = await commentIdsStore.getCommentsIdsByMoment(momentId);
    if (likes) {
        return await commentLikeStore.bulkGet(likes.map(({ id }) => id));
    }
    return [];
}

function addLikesObserver(fn: (data: any) => void) {
    nc.addObserver("commentLikes", fn);
}

function removeLikesObserver(fn: (data: any) => void) {
    nc.removeObserve("commentLikes", fn);
}

export { updateCommentLikes, getLikesRepo, addLikesObserver, removeLikesObserver };
