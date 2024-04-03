import getHotFeedIds from "@newSdk/service/api/moments/getHotFeedIds";
import keyValueModel from "@newSdk/model/keyValues/KeyValue";
import SupportDBKey from "@newSdk/model/keyValues/SupportDBKey";
import { mergeObArray } from "@newSdk/utils";
import topicDetail from "@newSdk/model/moments/TopicDetail";

export const fetchHotFeeds = async () => {
    const { flow, abstract, topic } = await getHotFeedIds();
    if (topic && topic.length) topicDetail.bulkPutTopic(topic);
    const feeds = mergeObArray(flow, abstract, "mid");
    await keyValueModel.bulkPut([
        {
            key: SupportDBKey.MomentHotFeeds,
            val: JSON.stringify(feeds),
        },
    ]);
};

export default fetchHotFeeds;
