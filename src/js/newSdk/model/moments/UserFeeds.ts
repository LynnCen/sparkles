import Dexie, { Table } from "dexie";
import { b_video, b_text, b_image } from "@newSdk/model/moments/instance/MomentsNormalContent";
import feedsModel from "@newSdk/model/moments/FeedsModel";

interface Tag {
    image: number[];
    video: number[];
    text: number[];
    all: number[];
}
export interface UserFeedsProps {
    mid: string;
    uid: string;
    sequence: number;
    authType: number;
    status: number;
    createTime: number;
    type: number;
    contentType: number;
}
class MomentUserFeeds {
    static authorize = false;
    private db?: Dexie;
    private userId?: string;
    private store?: Table<UserFeedsProps, string>;

    public Event = {
        hootCommentChange: "user_feeds_change",
    };

    tag: Tag = {
        image: Array.from(
            new Set([b_image, b_image | b_text, b_image | b_video, b_image | b_video | b_text])
        ),
        video: Array.from(
            new Set([b_video, b_video | b_text, b_video | b_image, b_video | b_image | b_text])
        ),
        text: Array.from(
            new Set([b_text, b_text | b_image, b_text | b_video, b_text | b_video | b_image])
        ),
        all: [],
    };
    constructor() {
        this.tag.all = Array.from(
            new Set([...this.tag.image, ...this.tag.text, ...this.tag.video])
        );
    }

    init(db: Dexie) {
        this.db = db;
        this.userId = db.name;
        this.store = db.table("momentsUserFeeds");
        MomentUserFeeds.authorize = true;
    }

    bulkPut(list: UserFeedsProps[]) {
        this.store
            ?.bulkPut(list)
            .then(() => console.log("success"))
            .catch((e) => console.log("error", e));
    }

    // 获取最大 sequence
    async getMaxSequenceByUid(uid: string) {
        try {
            const items = (await this.store?.where("uid").equals(uid).sortBy("sequence")) || [];
            return items[0] ? items[0].sequence : 0;
        } catch (e) {
            return 0;
        }
    }

    isVideoMessage(type: number) {
        return this.tag.video.includes(type);
    }
    isImageMessage(type: number) {
        return this.tag.image.includes(type);
    }

    // 获取 feeds
    async getFeedsByUid(
        uid: string,
        lastSequence: number,
        types: number[],
        limit: number = 20,
        init = false
    ) {
        try {
            const items =
                (await this.store
                    ?.where("uid")
                    .equals(uid)
                    .filter(
                        (item) =>
                            types.includes(item.contentType) &&
                            feedsModel.userVisibleFeed({ ...item })
                    )
                    .reverse()
                    .sortBy("sequence")) || [];

            let offsetIndex = 0;
            if (!init) {
                offsetIndex = items.findIndex((item) => item.sequence === lastSequence);
                if (offsetIndex !== -1) offsetIndex = offsetIndex + 1;
            }
            if (offsetIndex === -1) return [];
            // console.log(
            //     `slice----> items.slice(${offsetIndex}, ${limit})`,
            //     items,
            //     items.slice(offsetIndex, offsetIndex + limit)
            // );
            return items.slice(offsetIndex, offsetIndex + limit);
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    transformItem({
        mid,
        uid,
        sequence,
        auth_type,
        status,
        type,
        create_time,
        content_type,
    }: any): UserFeedsProps {
        return {
            mid,
            uid,
            sequence,
            authType: auth_type,
            status,
            type,
            createTime: create_time,
            contentType: content_type,
        };
    }
}

export const momentUserFeeds = new MomentUserFeeds();
export default momentUserFeeds;
