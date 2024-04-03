import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";
import { drop, take, partial } from "lodash";

const getSlice = (arr: any[], n: number) => {
    return take(arr, n);
};

type timestamp = number;
export interface CommentIdType {
    id: string;
    mid: string;
    uid: string;
    pid: string;
    create_time: timestamp;
}

class CommentIdTable {
    private table: Table<CommentIdType, string> | undefined;

    init(db: Dexie) {
        this.table = db.table("commentIds");
    }

    async getCommentsIdsByMoment(momentId: string) {
        const data = await this.table?.where("mid").equals(momentId).toArray();
        return data || [];
    }

    // comment / momentId
    async bulkGet(momentId: string, page: number = 1, pageSize: number = 20) {
        const data = await this.table?.where("pid").equals(momentId).sortBy("create_time");
        const takePageSize = partial(getSlice, drop((data || []).reverse(), (page - 1) * pageSize));
        const response = takePageSize(pageSize);
        return { id: momentId, data: response, total: (data && data.length) || 0 };
    }
    // total comment
    async getTotalComment(momentId: string) {
        const count = await this.table?.where("mid").equals(momentId).count();
        return count || 0;
    }

    // get pid
    async getPid(cid: string) {
        const commentId = await this.table?.get({ id: cid });
        return commentId && commentId.pid;
    }

    // find index of commentId or momentId
    async findIndex(pid: string, id: string) {
        const data = await this.table?.where("pid").equals(pid).reverse().sortBy("create_time");
        const index = (data || []).findIndex((item) => item.id === id);
        return index + 1;
    }

    async bulkPut(commentIds: CommentIdType[], momentId?: string) {
        await this.table?.bulkPut(commentIds);
        momentId && this.publishNew(momentId);
    }

    async bulkDel(commentIds: string[]) {
        return this.table?.bulkDelete(commentIds);
    }

    publishNew(momentId: string) {
        nc.publish("commentIds", momentId);
    }
}

const commentIdsStore = new CommentIdTable();

export default commentIdsStore;
