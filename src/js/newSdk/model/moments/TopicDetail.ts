import Dexie, { Table } from "dexie";
import moment from "moment";
import { groupBy, keys, head } from "lodash";

import nc from "@newSdk/notification";
import feedsModel from "@newSdk/model/moments/FeedsModel";

export type TopicID = {
    id: string;
    tid: string;
    mid: string;
    type: number;
    status: number;
    create_time: number;
};

export type Topic = {
    id: string;
    tid: string;
    name: string;
    create_time: number;
};

class TopicDetail {
    static authorize = false;
    private topicDBIds?: Table<TopicID, string>;
    private topic?: Table<Topic, string>;

    public Event = {
        hootCommentChange: "user_feeds_change",
    };

    init(db: Dexie) {
        this.topicDBIds = db.table("topicFeeds");
        this.topic = db.table("topicDetails");
    }

    async putTopic(topics: Topic[]) {
        await this.topic?.bulkPut(topics);
        return this.publishNC(topics);
    }

    async bulkGetIds() {
        return await this.topicDBIds?.toArray();
    }

    // TODO need test return data
    async bulkGetRecentMonth(count: number = 30) {
        return this.topicDBIds
            ?.where("create_time")
            .aboveOrEqual(moment().subtract(count, "d").startOf("d").valueOf())
            .toArray();
    }

    async getAllTopicFeed() {
        return this.topicDBIds?.toArray();
    }

    bulkPutTopic(topics: TopicID[]) {
        this.topicDBIds?.bulkPut(topics);
    }

    async getTopic(ids?: string[]) {
        try {
            if (!ids) return await this.topic?.toArray();

            return await this.topic?.where("id").anyOf(ids).toArray();
        } catch (e) {
            return [];
        }
    }

    async getMomentByTid(tid: string) {
        try {
            return await this.topicDBIds?.where("tid").equals(tid).limit(200).toArray();
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async searchTopic(name: string) {
        try {
            return await this.topic
                ?.filter(function (topic) {
                    const searchIndex = topic.name.toLowerCase().search(name.toLowerCase());
                    return searchIndex >= 0;
                })
                .toArray();
        } catch (e) {
            return [];
        }
    }

    publishNC(data: Topic[]) {
        nc.publish("topicUpdate", data);
    }
}

export const topicDetail = new TopicDetail();
export default topicDetail;
