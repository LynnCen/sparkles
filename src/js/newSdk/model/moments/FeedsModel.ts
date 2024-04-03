import Dexie, { Table } from "dexie";
import { authorize } from "@newSdk/model/descriptor";
import nc from "@newSdk/notification";
import { trimAndDropEmpty } from "@newSdk/utils";
import MomentsType from "@newSdk/model/moments/instance/MomentsType";

export interface FeedProps {
    mid: string;
    uid: string;
    type: number;
    sequence: number;
    authType: number;
    status: number;
    createTime: number;
    contentType: number;
}

const STATUS = {
    ALIVE: 1,
    DELETE: 0,
};
class FeedsModel {
    static authorize = false;
    private db?: Dexie;
    private userId?: string;
    private store?: Table<FeedProps, string>;

    public Event = {
        FeedsChange: "moments_feeds_change",
        FriendsUpdated: "moments_friends_list_updated",
    };

    init(db: Dexie) {
        this.db = db;
        this.userId = db.name;
        this.store = db.table("momentsFeeds");
        FeedsModel.authorize = true;
    }

    @authorize
    async getMomentsUtilTime(timestamp: number) {
        console.log(timestamp);
        try {
            return (
                (await this.store
                    ?.where("createTime")
                    .between(timestamp, Date.now(), true, true)
                    .toArray()) || []
            );
        } catch (e) {
            console.error(`error in getMomentsUtilTime`, e);
            return [];
        }
    }

    @authorize
    async insertBulkIds(list: FeedProps[]) {
        try {
            await this.store?.bulkPut(list).then((res) => {});
        } catch (e) {
            console.error(`error in insertBulkIds`, e);
            return [];
        }
    }

    @authorize
    async deleteFeeds(mid: string) {
        try {
            await this.store?.update(mid, { status: STATUS.DELETE });
            //     .then(() => {
            //     // this.publishDeleteNoc([{ id }]);
            // });
        } catch (e) {}
    }

    async getFeedsCount() {
        return this.store?.count();
    }

    async getFeedsLessCount(createTime: number) {
        try {
            const collection = this.store?.where("createTime").between(0, createTime, false, true);
            if (collection) {
                const lessCount = await collection.count();
                if (lessCount > 0) {
                    const firstItem = await collection.first();
                    return firstItem!.createTime;
                }
            }

            return 0;
        } catch (e) {
            console.error(`error in getFeedsLessCount`, e);
            return 0;
        }
    }

    isDeleted(item: FeedProps) {
        return item.status === STATUS.DELETE;
    }

    userVisibleFeed(item: FeedProps) {
        return item.status !== STATUS.DELETE && item.type !== MomentsType.DELETE;
    }

    async loadFeedsIds(
        startTime: number,
        endTime: number,
        filter = (x: FeedProps) => !this.isDeleted(x)
    ) {
        try {
            const chunk = this.store?.where("createTime").between(endTime, startTime, true, false);

            let list: FeedProps[] =
                (await chunk
                    ?.filter((item) => filter(item))
                    // .reverse()
                    .sortBy("createTime")) || [];

            return list;
        } catch (e) {
            console.error("error in api loadFeedsIds", e);
            return [];
        }
    }

    async setFeedsDeleteTag(ids: string[]) {
        try {
            const list = (await this.store?.where("mid").anyOf(ids).toArray()) || [];
            const _list = list.map((item) => ({ ...item, status: STATUS.DELETE }));
            this.store?.bulkPut(_list);
        } catch (e) {
            console.error(`error in setFeedsDeleteTag`, e);
        }
    }

    async getFeedsCountsByMomentIds(momentIds: string[], recentVerge: number) {
        try {
            const momentFeeds =
                (await this.store
                    ?.where("mid")
                    .anyOf(momentIds)
                    .filter((moment) => moment.type !== 82 && !this.isDeleted(moment))
                    .toArray()) || [];

            const counts = momentFeeds.length;

            let maxCreateTime = 0;
            const recent = momentFeeds.filter(({ createTime }) => {
                maxCreateTime = Math.max(maxCreateTime, createTime);
                return createTime > recentVerge;
            });
            return {
                counts,
                maxCreateTime,
                recentCounts: recent.length,
            };
        } catch (e) {
            return {
                counts: 0,
                recentCounts: 0,
                minCreateTime: 0,
                maxCreateTime: 0,
            };
        }
    }

    buildFakeFeed(ob: { [key in keyof FeedProps]?: FeedProps[key] }): any {
        // @ts-ignore
        return {
            sequence: 0,
            authType: 1,
            status: 1,
            createTime: Date.now(),
            // contentType: ,
            ...ob,
        };
    }

    publish(list = []) {
        nc.publish(this.Event.FeedsChange, list);
    }
    itemTransform({
        mid: id,
        uid,
        sequence,
        auth_type,
        status,
        type,
        create_time,
        content_type,
    }: any): FeedProps {
        return trimAndDropEmpty({
            mid: id,
            uid,
            type,
            sequence,
            authType: auth_type,
            status,
            createTime: create_time,
            contentType: content_type,
        }) as FeedProps;
    }
}

export const feedsModel = new FeedsModel();
export default feedsModel;
