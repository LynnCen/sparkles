import FeedDetails, { FeedDetailProps } from "@newSdk/model/moments/FeedDetails";
import MomentsType from "@newSdk/model/moments/instance/MomentsType";
import feedsModel from "@newSdk/model/moments/FeedsModel";

export const _checkDeleteMoments = (list: FeedDetailProps[]) => {
    let deleteItem: string[] = [];

    list.forEach((item) => {
        if (item.type === MomentsType.DELETE) {
            try {
                const { extra } = item;
                extra.ids.forEach((id) => deleteItem.push(id));
            } catch (e) {
                e;
            }
        }
    });

    if (deleteItem.length) {
        Promise.all([
            FeedDetails.deleteBulk(deleteItem),
            feedsModel.setFeedsDeleteTag(deleteItem),
        ]).then(() => {
            console.log(deleteItem);
            FeedDetails.publishDeleteNoc(deleteItem.map((id) => ({ id })));
        });
    }
};

export default _checkDeleteMoments;
