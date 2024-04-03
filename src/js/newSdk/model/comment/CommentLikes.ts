import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";

type timestamp = number;

export interface CommentLike {
    id: string;
    mid: string;
    uid: string;
    cid: string;
    create_time: number;
}

class CommentLikeTable {
    private table: Table<CommentLike, string> | undefined;

    init(db: Dexie) {
        this.table = db.table("commentLikes");
    }

    bulkGet(ids: string[]) {
        return this.table?.where("cid").anyOf(ids).toArray();
    }

    async bulkDel(ids: string[]) {
        try {
            const count = await this.table?.where("cid").anyOf(ids).delete();
            // console.log(count);
        } catch (e) {
            //
        }
    }

    async bulkPut(commentLikes: CommentLike[]) {
        await this.table?.bulkPut(commentLikes);
        this.publishLikesUpdate();
    }

    publishLikesUpdate() {
        nc.publish("commentLikes");
    }
}

const commentLikeStore = new CommentLikeTable();

export default commentLikeStore;
