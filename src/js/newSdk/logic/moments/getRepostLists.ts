import getRepostLists from "@newSdk/service/api/moments/getRepostLists";
import FeedDetails from "@newSdk/model/moments/FeedDetails";

import { groupBy, difference, countBy, uniq } from "lodash";
import getFeedInfos from "@newSdk/service/api/moments/getFeedInfos";

async function getRepostList(mid: string) {
    const momentIdResults = await getRepostLists([mid]);
    const DataInDB = await FeedDetails.getMomentsByIds(momentIdResults.map(({ mid }) => mid));
    const exists = DataInDB.map(({ id }) => id);
    const diff = difference(exists, uniq(momentIdResults.map(({ mid }) => mid)));
    const remoteData = diff.length ? await getFeedInfos(diff) : [];
    const transformArr = remoteData.map(FeedDetails.itemTransform);
    FeedDetails.bulkPutMoments(transformArr);
    return [...DataInDB, ...transformArr];
}

async function getRepostListCount(mids: string[]) {
    const momentIdResults = await getRepostLists(mids);
    return countBy(momentIdResults, "refer_pre");
}

export { getRepostList, getRepostListCount };
