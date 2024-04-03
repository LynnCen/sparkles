import getLoadMoreUserFeedIds from "@newSdk/service/api/moments/getLoadMoreUserFeedIds";
import { FeedProps } from "@newSdk/model/moments/FeedsModel";
import topicDetail, { TopicID } from "@newSdk/model/moments/TopicDetail";
import { mergeObArray } from "@newSdk/utils";
import UserFeeds, { UserFeedsProps } from "@newSdk/model/moments/UserFeeds";

interface ApiProps {
    uid: string;
    sequence: number;
}

interface QueryProps {
    targetType: number[];
    needsCounts: number;
}

export const loadUserFeedsOnServer = async (
    { targetType, needsCounts }: QueryProps,
    { uid, sequence }: ApiProps
) => {
    let currentSequence = sequence;
    let list: UserFeedsProps[] = [];
    let queryIncludeList: UserFeedsProps[] = [];
    let topicList: any[] = [];
    let hasMore = true;
    while (queryIncludeList.length < needsCounts && hasMore) {
        const { abstract, flow, topic } = await getLoadMoreUserFeedIds({
            uid,
            sequence: currentSequence,
        });
        const useFeeds = mergeObArray(abstract, flow, "mid");
        topicList = topicList.concat(topic);

        // 当前筛选 项
        const targetList = useFeeds.filter((item) => targetType.includes(item.content_type));

        // 列表
        list = list.concat(useFeeds);
        // 指定tag 列表
        queryIncludeList = queryIncludeList.concat(targetList);

        // 跟新 seq
        currentSequence = list.sort((a, b) => a.sequence - b.sequence)[0]?.sequence || 0;
        hasMore = useFeeds.length !== 0;
    }

    await Promise.all([UserFeeds.bulkPut(list), topicDetail.bulkPutTopic(topicList)]);
    return queryIncludeList;
};

export default loadUserFeedsOnServer;
