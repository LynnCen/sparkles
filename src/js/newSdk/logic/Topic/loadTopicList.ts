import topicDetail, { Topic } from "@newSdk/model/moments/TopicDetail";
import { groupBy, head, keys, orderBy, values } from "lodash";
import feedsModel from "@newSdk/model/moments/FeedsModel";
import moment from "moment";
import { arrayToMap, mergeObArray } from "@newSdk/utils";
import getTopicDetails from "@newSdk/service/api/moments/getTopicDetails";

const MAX_QUERY_SIZE = 200;
const RECENT_VERGE_TIMESTAMP = moment().subtract(30, "d").valueOf();
export const loadTopicList = (() => {
    type TopicItem = {
        createTime: number;
        counts: number;
        recentCounts: number;
        tid: string;
        name?: string;
    };
    type TopicMap = Record<string, TopicItem>;

    let cacheList: TopicItem[] = [];

    return async function* () {
        yield cacheList;

        let topics = (await topicDetail.bulkGetRecentMonth()) || [];

        if (topics?.length < MAX_QUERY_SIZE) {
            topics = (await topicDetail.getAllTopicFeed()) || [];
        }

        /*
        *
        * 排序优先级：
            热度（最近30天内话题的Moments数量）>总数（该话题下所有Moments的数量）>时间(话题创建时间，最新的在前面)
            分页20条，最多显示200个。
        *
        * */

        const recentTopicMap: TopicMap = {};
        const oldTopicMap: TopicMap = {};

        const tidMapMid = groupBy(topics, "tid");
        const tids = keys(tidMapMid);
        await Promise.all(
            tids.map(async (cur) => {
                // 话题创建时间
                let minCreateTime = Number.MAX_SAFE_INTEGER;
                // 当前 topic 对应 moments id 集合；
                const curIds: string[] = tidMapMid[cur].map(({ mid, create_time }) => {
                    minCreateTime = Math.min(minCreateTime, create_time);
                    return mid;
                });

                // 当前 moments 数量；
                const {
                    counts,
                    recentCounts,
                    maxCreateTime,
                } = await feedsModel.getFeedsCountsByMomentIds(curIds, RECENT_VERGE_TIMESTAMP);
                const info = {
                    createTime: minCreateTime,
                    tid: cur,
                    recentCounts,
                    counts,
                };

                // tag: counts 排除 内容为空的话题
                if (counts) {
                    if (maxCreateTime > RECENT_VERGE_TIMESTAMP) {
                        recentTopicMap[cur] = info;
                    } else {
                        oldTopicMap[cur] = info;
                    }
                }
            })
        );

        /**
         * 1. 30天内
         */
        const recentTopic = values(recentTopicMap);
        const recentTopicKeys = keys(recentTopicMap);

        const needsOthersLen = MAX_QUERY_SIZE - recentTopic.length;

        /**
         * 2. 30天外
         */
        let oldTopic: TopicItem[] = [];
        let oldTopicKeys: string[] = [];
        if (needsOthersLen > 0) {
            oldTopic = values(oldTopicMap).slice(0, needsOthersLen);
            oldTopicKeys = keys(oldTopicMap).slice(0, needsOthersLen);
        }

        // const orderRecent = orderBy(
        //     recentTopic,
        //     ["recentCounts", "counts", "createTime"],
        //     ["desc", "desc", "desc"]
        // );
        //
        // topicList = topicList.concat(recentTopic);

        // const orderOldTopic = orderBy(
        //     oldTopicMap,
        //     ["counts", "createTime"],
        //     ["desc", "desc"]
        // ).slice(0, needsOthersLen);
        // console.log(orderOldTopic);
        // topicList = topicList.concat(oldTopic);

        /**
         * 获取 topic 详情
         */
        const [recentTopicInfo = [], oldTopicInfo = []] = await Promise.all([
            topicDetail.getTopic(recentTopicKeys),
            topicDetail.getTopic(oldTopicKeys),
        ]);

        // 查询本地;
        const recentInfoMap = arrayToMap(recentTopicInfo, "id");
        const oldInfoMap = arrayToMap(oldTopicInfo, "id");

        // 本地缺少需要同步的 详情；
        const syncTopicDetailIds: string[] = [];

        // 合并详情数据
        const mergeTopicDetail = (feeds: TopicItem[], details: Map<string, Topic>) => {
            return feeds.map((item) => {
                if (details.has(item.tid)) {
                    const info = details.get(item.tid) as Topic;
                    return {
                        ...item,
                        name: info.name,
                        createTime: info.create_time,
                    };
                } else {
                    syncTopicDetailIds.push(item.tid);
                    return item;
                }
            });
        };

        const recentList = mergeTopicDetail(recentTopic, recentInfoMap);
        const oldInfoList = mergeTopicDetail(oldTopic, oldInfoMap);

        // 排序
        const orderRecentList = orderBy(
            recentList,
            ["recentCounts", "counts", "createTime"],
            ["desc", "desc", "desc"]
        );
        const orderOldInfoList = orderBy(
            oldInfoList,
            ["counts", "createTime"],
            ["desc", "desc"]
        ).slice(0, needsOthersLen);

        // 同步服务端
        if (syncTopicDetailIds.length) {
            getTopicDetails(syncTopicDetailIds).then((topics) => {
                topicDetail.putTopic(topics);
            });
        }

        const result = [...orderRecentList, ...orderOldInfoList];

        cacheList = result.slice(0, 20);
        return result;
    };
})();

export default loadTopicList;
