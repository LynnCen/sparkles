import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";
import { CommentIdType } from "@newSdk/model/comment/CommentId";

interface HotCommentProps {
    key: string;
    val: string;
}

class HotComment {
    static authorize = false;
    private db?: Dexie;
    private userId?: string;
    private store?: Table<HotCommentProps, string>;

    public Event = {
        hotCommentChange: "hot_comment_change",
    };

    init(db: Dexie) {
        this.db = db;
        this.userId = db.name;
        this.store = db.table("hotCommentFeeds");
        HotComment.authorize = true;
    }

    async getValueByKey(k: string) {
        try {
            const item = await this.store!.where("key").equals(k).first();
            if (item) return JSON.parse(item.val);
            return null;
        } catch (e) {
            console.error("error in heyValueByKey", k);
            return null;
        }
    }

    async bulkGetCommentsByMomentIds(ids: string[]): Promise<{ [key: string]: CommentIdType[] }> {
        try {
            const list = await this.store!.where("key").anyOf(ids).toArray();
            let map: any = {};
            list.forEach(({ key, val }) => {
                try {
                    map[key] = JSON.parse(val) || [];
                } catch (e) {
                    map[key] = [];
                }
            });
            return map;
        } catch (e) {
            return {};
        }
    }

    bulkPut(list: HotCommentProps[]) {
        this.store
            ?.bulkPut(list)
            .then((res) => {
                const ids = list.map((item) => item.key);
                this.handlePublish(ids);
            })
            .catch((e) => console.log("error in keyValue modal", e));
    }

    handlePublish(list: string[]) {
        nc.publish(this.Event.hotCommentChange, list);
    }
}

export const hotComment = new HotComment();
export default hotComment;
