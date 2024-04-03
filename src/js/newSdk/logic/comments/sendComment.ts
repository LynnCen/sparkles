import { sendComment } from "@newSdk/service/api/comments/sendComment";
import CommentItem, { ReplyItem } from "@newSdk/model/comment/CommentItem";
import CommentId from "@newSdk/model/comment/CommentId";

async function sendCommentRequest(replyItem: ReplyItem) {
    try {
        const comment = await sendComment(replyItem);
        const { id, mid, uid, pid, create_time } = comment;
        await CommentId.bulkPut([{ id, mid, uid, pid, create_time }]);
        CommentItem.bulkAddComments([comment]);
        return comment;
    } catch (e) {
        throw e;
    }
}

export { sendCommentRequest };
