import { observable, action } from "mobx";
import { sendCommentRequest } from "@newSdk/logic/comments/sendComment";
import { head, groupBy } from "lodash";
import UserInfo from "@newSdk/model/UserInfo";

function isTopComment(topList, pid) {
    return topList.findIndex((top) => top.id === pid) > -1;
}

class Comments {
    @observable comments = [];
    @observable commentsCount = 0;
    @observable commentReplies = {};
    @observable likes = {};

    @observable topComments = [];
    @observable topCommentsReplies = {};

    @action async onReplyMoment(commentItem) {
        try {
            const reply = await sendCommentRequest({
                ...commentItem,
                create_time: Date.now(),
            });
            if (!reply) return;
            commentsStore.comments = [reply, ...commentsStore.comments];
            commentsStore.commentReplies = {
                ...commentsStore.commentReplies,
                [reply.id]: [{ id: reply.id, data: [], total: 0 }],
            };
            commentsStore.commentsCount = commentsStore.commentsCount + 1;
        } catch (e) {
            throw e;
        }
    }

    @action async onReplyComment(replyItem) {
        try {
            const reply = await sendCommentRequest({
                ...replyItem,
                create_time: Date.now(),
            });
            if (!reply) return;
            commentsStore.commentsCount = commentsStore.commentsCount + 1;
            const { commentReplies } = commentsStore;
            const { pid } = reply;

            const replies = commentReplies[pid] || [];
            let replyData = [],
                total = 0;
            if (head(replies)) {
                replyData = head(replies).data || [];
                total = head(replies).total || 0;
            }
            commentsStore.commentReplies[pid] = [
                {
                    id: pid,
                    data: [reply, ...replyData],
                    total: total + 1,
                },
            ];
            commentsStore.onTopCommentChanges(pid, reply);
            return reply;
        } catch (e) {
            throw e;
        }
    }

    @action onTopCommentChanges(pid, reply) {
        const { topCommentsReplies, topComments } = commentsStore;
        if (isTopComment(topComments, pid)) {
            let topReplyData = [],
                TopTotal = 0;
            const topReplies = topCommentsReplies[pid] || [];

            if (head(topReplies)) {
                topReplyData = head(topReplies).data || [];
                TopTotal = head(topReplies).total || 0;
            }
            commentsStore.topCommentsReplies[pid] = [
                {
                    id: pid,
                    data: [reply, ...topReplyData],
                    total: TopTotal + 1,
                },
            ];
        }
    }

    @action onInitComments({ commentLevel, secondLevel }) {
        commentsStore.comments = [...commentLevel];
        commentsStore.commentReplies = secondLevel;
    }

    @action onInitTopComments({ commentLevel, secondLevel }) {
        commentsStore.topComments = [...commentLevel];
        commentsStore.topCommentsReplies = secondLevel;
    }

    @action updateCommentsCount(counts) {
        commentsStore.commentsCount = counts;
    }

    @action onUpdateComments({ commentLevel, secondLevel }) {
        commentsStore.comments = [...commentsStore.comments, ...commentLevel];
        commentsStore.commentReplies = { ...commentsStore.commentReplies, ...secondLevel };
    }

    @action onUpdateLikes(likes) {
        const groupedItem = groupBy(likes, ({ cid }) => cid);

        commentsStore.likes = {
            ...groupedItem,
        };
    }

    @action onAddLikes(commentId, like) {
        commentsStore.likes = {
            ...commentsStore.likes,
            [commentId]: [like, ...(commentsStore.likes[commentId] || [])],
        };
    }

    @action onDelLikes(commentId) {
        commentsStore.likes = {
            ...commentsStore.likes,
            [commentId]: commentsStore.likes[commentId].filter(({ uid }) => uid !== UserInfo._id),
        };
    }
}

const commentsStore = new Comments();
export default commentsStore;
