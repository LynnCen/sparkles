import FeedDetails, { FeedDetailProps } from "@newSdk/model/moments/FeedDetails";
import getFeedInfos from "@newSdk/service/api/moments/getFeedInfos";
import _loadForwardDisplay from "@newSdk/logic/moments/_loadForwardDisplay";
import MomentsType from "@newSdk/model/moments/instance/MomentsType";
import feedsModel from "@newSdk/model/moments/FeedsModel";
import _checkDeleteMoments from "@newSdk/logic/moments/_checkDeleteMoments";

export const loadMomentsInfoSyncRemote = async (
    ids: string[],
    {
        filter = FeedDetails.filterVisibleMoments,
        isLoadForwardDisplay = false,
        isCheckLink = true,
    } = {}
) => {
    let localList = await FeedDetails.getMomentsByIds(ids);
    // console.log("queryed local", localList);

    if (localList.length === ids.length) {
        localList = [...localList].sort((a, b) => b.createTime - a.createTime);
    } else if (localList.length < ids.length) {
        // console.log("eff server");

        const existList = localList.map((item) => item.id);
        const unExistList = ids.filter((id) => !existList.includes(id));

        // Server synchronization data
        const res = await getFeedInfos(unExistList);

        // moments
        let formatList: FeedDetailProps[] = [];

        formatList = res.map(FeedDetails.itemTransform);

        //  moments type 82
        _checkDeleteMoments([...formatList]);

        //
        // const formatList = res.map(FeedDetails.itemTransform);
        if (formatList && formatList.length) FeedDetails.bulkPutMoments(formatList);

        //
        localList = [...localList, ...formatList].sort((a, b) => b.createTime - a.createTime);
    }

    localList = localList.filter(filter) || [];
    // if (isLoadForwardDisplay) localList = await _loadForwardDisplay(visibleList, isCheckLink);

    return localList;
};

export default loadMomentsInfoSyncRemote;
