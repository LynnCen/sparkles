import { getComments } from "@newSdk/service/api/comments/fetchComments";
import { getCommentIds } from "@newSdk/service/api/comments/fetchIds";
import CommentId from "@newSdk/model/comment/CommentId";
import CommentItem from "@newSdk/model/comment/CommentItem";
import { groupBy } from "lodash";
import nc from "@newSdk/notification";
import { updateCommentLikes } from "@newSdk/logic/comments/commentLikes";

async function updateCommentIds(momentId: string) {
    const idItems = await getCommentIds(momentId);

    if (idItems.length) {
        const ids = idItems.map(({ id }) => id);
        CommentId.bulkPut(idItems, momentId);
        updateCommentLikes(ids);
        const commentItems = await getComments(ids);
        CommentItem.bulkAddComments(commentItems, momentId);
    }
}

async function getCommentList(momentId: string, page: number = 1, pageSize: number = 20) {
    // console.log(momentId, page, pageSize);
    const { data, total } = await CommentId.bulkGet(momentId, page, pageSize);
    const commentIds = data.map(({ id }) => id);
    const commentItems = await CommentItem.bulkGet(commentIds);
    const res = await Promise.all(
        commentIds.map(async (commentId) => {
            const { id, data, total } = await CommentId.bulkGet(commentId, 1, 2);
            if (!data.length) return { id, data, total };
            const ids = data.map(({ id }) => id);
            const comments = await CommentItem.bulkGet(ids);
            return { id, data: comments, total };
        })
    );
    return { data: { commentLevel: commentItems, secondLevel: groupBy(res, "id") }, total };
}

async function getCommentListBy(commentIds: string[]) {
    const commentItems = await CommentItem.bulkGet(commentIds);
    const res = await Promise.all(
        commentIds.map(async (commentId) => {
            const { id, data, total } = await CommentId.bulkGet(commentId, 1, 2);
            if (!data.length) return { id, data, total };
            const ids = data.map(({ id }) => id);
            const comments = await CommentItem.bulkGet(ids);
            return { id, data: comments, total };
        })
    );
    return { data: { commentLevel: commentItems, secondLevel: groupBy(res, "id") } };
}

async function getReplyList(commentId: string, page: number = 1, pageSize: number = 20) {
    // console.log(commentId, page, pageSize);
    const { data, total } = await CommentId.bulkGet(commentId, page, pageSize);
    const commentIds = data.map(({ id }) => id);
    const commentItems = await CommentItem.bulkGet(commentIds);
    return { data: commentItems, total };
}

async function getIndexOfId(pid: string, id: string) {
    return await CommentId.findIndex(pid, id);
}

async function getCommentTotalCount(momentId: string) {
    return await CommentId.getTotalComment(momentId);
}

async function getPid(cid: string) {
    return await CommentId.getPid(cid);
}

function addCommentsObserver(fn: (data: any) => void) {
    nc.addObserver("commentListUpdate", fn);
}

function removeCommentsObserver(fn: (data: any) => void) {
    nc.removeObserve("commentListUpdate", fn);
}

export {
    updateCommentIds,
    getCommentList,
    getCommentTotalCount,
    addCommentsObserver,
    removeCommentsObserver,
    getReplyList,
    getIndexOfId,
    getCommentListBy,
    getPid,
};
