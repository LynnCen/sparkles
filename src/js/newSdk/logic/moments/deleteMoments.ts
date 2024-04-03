import deleteMomentsById from "@newSdk/service/api/moments/deleteMomentsById";
import FeedDetails from "@newSdk/model/moments/FeedDetails";
import feedsModel from "@newSdk/model/moments/FeedsModel";

export const deleteMoments = async (id: string) => {
    await deleteMomentsById(id);
    await FeedDetails.deleteMomentsById(id);
    await feedsModel.deleteFeeds(id);
};

export default deleteMoments;
