import axios from "@newSdk/service/apiCore/tmmMomentsCore";
import { trimAndDropEmpty } from "@newSdk/utils";
import MomentsContent from "@newSdk/model/moments/instance/MomentsContent";
import FeedDetails, { FeedDetailProps } from "@newSdk/model/moments/FeedDetails";
import feedsModel from "@newSdk/model/moments/FeedsModel";
export const publishMoment = async (moment: MomentsContent) => {
    try {
        const res = await axios({
            url: "/publish",
            method: "post",
            data: moment,
        });

        const items = FeedDetails.itemTransform(res.data.items);
        const { id, uid, authType, status, createTime, contentType } = items;

        const fakeTime = Date.now();
        const fakeFeed = feedsModel.buildFakeFeed({
            mid: id,
            uid,
            authType,
            createTime: fakeTime,
            status,
            contentType,
        });

        // console.log("------------>>>>fakeTime", fakeTime);
        items.createTime = fakeTime;

        // console.log(`------------>>>fake item`, { ...items });
        await Promise.all([
            feedsModel.insertBulkIds([fakeFeed]),
            FeedDetails.bulkPutMoments([items]),
        ]);
        return items;
    } catch (e) {
        console.log(e);
        return false;
    }
};

export default publishMoment;
