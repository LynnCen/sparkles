import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";

export interface IMomentLike {
    id: string;
    mid: string;
    uid: string;
    create_time: number;
}

class MomentLikes {
    momentLikesTable?: Table<any, IMomentLike>;

    init(db: Dexie) {
        this.momentLikesTable = db.table("momentLikes");
    }

    async bulkAdd(momentLikes: IMomentLike[], delMomentIds?: string[]) {
        try {
            const data = await this.momentLikesTable?.bulkPut(momentLikes);
            this.publishNC(momentLikes, delMomentIds);
            return data;
        } catch (e) {
            return [];
        }
    }

    async bulkDelete(ids: string[]) {
        try {
            return await this.momentLikesTable?.where("mid").anyOf(ids).delete();
        } catch (e) {
            //
        }
    }

    async bulkGet(moments: string[]) {
        try {
            const data = await this.momentLikesTable?.where("mid").anyOf(moments).toArray();
            return data;
        } catch (e) {
            return [];
        }
    }

    publishNC(momentLikes: IMomentLike[], delMomentIds?: string[]) {
        nc.publish("momentLikes", { momentLikes, delMomentIds });
    }
}

const MomentLikesModel = new MomentLikes();

export default MomentLikesModel;
