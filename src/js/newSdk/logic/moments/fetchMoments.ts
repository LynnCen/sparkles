import getFeedInfos from "@newSdk/service/api/moments/getFeedInfos";
import FeedDetails from "@newSdk/model/moments/FeedDetails";

export default async function (momentIds: string[]) {
    const momentInfos = await getFeedInfos(momentIds);
    const putList = momentInfos.map(FeedDetails.itemTransform);

    FeedDetails.bulkPutMoments(putList);

    return putList;
}
