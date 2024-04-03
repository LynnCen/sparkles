import UserFeeds from "@newSdk/model/moments/UserFeeds";
import getRefreshUserFeedIds from "@newSdk/service/api/moments/getRefreshUserFeedIds";
import { mergeObArray } from "@newSdk/utils";
import topicDetail from "@newSdk/model/moments/TopicDetail";

export const fetchUserFeeds = async (uid: string) => {
    // 最大 seq 刷新
    const sequence = await UserFeeds.getMaxSequenceByUid(uid);

    const { abstract, flow, topic } = await getRefreshUserFeedIds({ uid, sequence });
    if (topic && topic.length) topicDetail.bulkPutTopic(topic);

    const feeds = mergeObArray(abstract, flow, "mid");

    await UserFeeds.bulkPut(feeds.map(UserFeeds.transformItem));

    return feeds;
};

export default fetchUserFeeds;
