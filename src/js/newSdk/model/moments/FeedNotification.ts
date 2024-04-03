import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";

export type FeedNotificationType = {
    id: string;
    uid: string;
    mid: string;
    operated_id: string;
    action: number;
    sequence: number;
    is_read: number;
    authType: number;
    extra: Record<string, any>;
    create_time: number;
    update_time: number;
};

class FeedNotification {
    private store?: Table<FeedNotificationType, string>;
    private storeRead?: Table<FeedNotificationType, string>;

    init(db: Dexie) {
        this.store = db.table("notifications");
        this.storeRead = db.table("notificationRead");
    }

    async bulkPut(items: FeedNotificationType[], isMute: Boolean = false) {
        const data = await this.store?.bulkPut(items);
        // console.log(data);
        if (!isMute) this.publishNewNotification();
        return data;
    }

    async bulkPutRead(items: FeedNotificationType[]) {
        return this.storeRead?.bulkPut(items);
    }

    async bulkGet(page: number = 1, pageSize: number = 10) {
        const data = await this.store
            ?.orderBy("create_time")
            .reverse()
            .offset((page - 1) * pageSize)
            .limit(pageSize)
            .toArray();
        return data;
    }

    async getSequence(): Promise<number> {
        const data = await this.store?.orderBy("sequence").reverse().first();
        const dataRead = await this.storeRead?.orderBy("sequence").reverse().first();

        const noticeSeq = (data && data.sequence) || 0;
        const readSeq = (dataRead && dataRead.sequence) || 0;

        return Math.max(noticeSeq, readSeq);
    }

    async getUnReadNotifications(): Promise<number> {
        const data = await this.store?.where("is_read").equals(0).count();
        return data || 0;
    }

    async markAllRead(): Promise<string[]> {
        const data = await this.store?.where("is_read").equals(0).toArray();
        const ids = (data || []).map(({ id }) => id);
        this.readNotification(ids);
        return ids;
    }

    async getCounts() {
        const data = await this.store?.count();
        return data || 0;
    }

    async readNotification(ids: string[]) {
        return await this.store?.where("id").anyOf(ids).modify({ is_read: 1 });
    }

    publishNewNotification() {
        nc.publish("newNotifications");
    }
}

export const feedNotification = new FeedNotification();
export default feedNotification;
