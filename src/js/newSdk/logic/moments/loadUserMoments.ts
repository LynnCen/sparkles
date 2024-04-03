import UserFeeds from "@newSdk/model/moments/UserFeeds";
import loadMomentsInfoSyncRemote from "@newSdk/logic/moments/_loadMomentsInfoSyncRemote";
import getLoadMoreUserFeedIds from "@newSdk/service/api/moments/getLoadMoreUserFeedIds";
import { mergeObArray } from "@newSdk/utils";
import loadUserFeedsOnServer from "@newSdk/logic/moments/loadUserMoments+remote";
import FeedDetails from "@newSdk/model/moments/FeedDetails";

interface IProps {
    uid: string;
    startIndex: number;
    includeType: number[];
    pageSize: number;
    lastSequence: number;
    init: boolean;
}
export const loadUserMoments = async ({
    uid,
    includeType,
    pageSize = 20,
    lastSequence,
    init,
}: IProps) => {
    // console.log("-----------------------------?>>>>> ");
    // console.log(`query props`, uid, includeType, pageSize, lastSequence, init);
    let feedsList = await UserFeeds.getFeedsByUid(uid, lastSequence, includeType, pageSize, init);
    // console.log(`feedsList localQuery --->`, feedsList);
    // console.log("check --->", init && startIndex === 0 && feedsList.length < pageSize);
    // if (init && startIndex === 0 && feedsList.length < pageSize) {
    //     return [];
    // }
    // console.log(feedsList);
    // 查询数目小于本地
    if (feedsList.length < pageSize) {
        // 服务端查询
        const lastItem = feedsList[feedsList.length - 1];
        const sequence = lastItem ? lastItem.sequence : lastSequence;

        const queryIncludeList = await loadUserFeedsOnServer(
            { targetType: includeType, needsCounts: pageSize - feedsList.length },
            { uid, sequence }
        );

        feedsList = feedsList.concat(queryIncludeList);
    }
    const ids = feedsList.map((item) => item.mid);

    const list = await loadMomentsInfoSyncRemote(ids, { isLoadForwardDisplay: true });

    const lastSeq = feedsList.sort((a, b) => b.sequence - a.sequence)[feedsList.length - 1]
        ?.sequence;
    // console.log(feedsList);
    // console.log("last sequence -------->", lastSeq);
    // console.log(list);

    return {
        list,
        lastSequence: lastSeq,
    };
};

export default loadUserMoments;
