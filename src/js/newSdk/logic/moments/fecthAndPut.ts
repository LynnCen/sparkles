import getFeedInfos from "@newSdk/service/api/moments/getFeedInfos";
import momentsDetailsModel from "@newSdk/model/moments/FeedDetails";
import nc from "@newSdk/notification";

async function fetchAndPut(id: string) {
    try {
        const data = await getFeedInfos([id]);

        momentsDetailsModel.bulkPutMoments(data.map(momentsDetailsModel.itemTransform), id);
        return data;
    } catch (e) {
        //
    }
}

function addMomentDetailObserver(fn: (data: any) => void) {
    nc.addObserver("moments_feed_details", fn);
}
function removeMomentDetailObserver(fn: (data: any) => void) {
    nc.addObserver("moments_feed_details", fn);
}

export { fetchAndPut, addMomentDetailObserver, removeMomentDetailObserver };
