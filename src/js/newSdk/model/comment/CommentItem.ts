import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";
import { CommentIdType } from "@newSdk/model/comment/CommentId";

type timestamp = number;

export interface ReplyItem {
    id: string;
    mid: string;
    uid: string;
    pid: string;
    reply_id: string;
    reply_uid: string;
    text: string;
    create_time: timestamp;
}

class CommentItemTable {
    private table: Table<ReplyItem, string> | undefined;

    init(db: Dexie) {
        this.table = db.table("comments");
    }

    async bulkGet(ids: string[]) {
        const ls = await this.table?.where("id").anyOf(ids).sortBy("create_time");
        return ls ? ls.reverse() : [];
    }

    async bulkAddComments(comments: ReplyItem[], momentId?: string) {
        try {
            await this.table?.bulkPut(comments);
            momentId && this.publishNew(momentId);
        } catch (e) {
            console.log(e);
        }
    }

    async getCommentsByMomentIds(ids: string[]) {
        return (await this.table?.where("mid").anyOf(ids).reverse().toArray()) || [];
    }

    publishNew(momentId: string) {
        nc.publish("commentListUpdate", momentId);
    }
}

const CommentStore = new CommentItemTable();

export default CommentStore;
