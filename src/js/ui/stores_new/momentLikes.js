import { observable, action } from "mobx";
import { groupBy, keys, reduce } from "lodash";
import UserInfo from "@newSdk/model/UserInfo";
import { addMomentLikesObserver } from "@newSdk/logic/moments/momentLikes";

class MomentLikes {
    @observable likes = {};

    constructor() {
        addMomentLikesObserver(({ momentLikes, delMomentIds }) => {
            momentLikesStore.onUpdateLikes(momentLikes);
            if (delMomentIds && Array.isArray(delMomentIds) && delMomentIds.length) {
                const delItems = delMomentIds
                    .map((momentId) => ({ [momentId]: [] }))
                    .reduce(
                        (cur, acc) => ({
                            ...acc,
                            ...cur,
                        }),
                        {}
                    );
                // console.log(delItems);
                momentLikesStore.onDeleteLikes(delItems);
            }
        });
    }

    @action onUpdateLikes(likes) {
        const groupedItem = groupBy(likes, ({ mid }) => mid);
        momentLikesStore.likes = {
            ...momentLikesStore.likes,
            ...groupedItem,
        };
    }

    @action onDeleteLikes(likes) {
        momentLikesStore.likes = {
            ...momentLikesStore.likes,
            ...likes,
        };
    }

    @action onAddLikes(momentId, like) {
        momentLikesStore.likes = {
            ...momentLikesStore.likes,
            [momentId]: [like, ...(momentLikesStore.likes[momentId] || [])],
        };
    }

    @action onDelLikes(momentId) {
        momentLikesStore.likes = {
            ...momentLikesStore.likes,
            [momentId]: momentLikesStore.likes[momentId].filter(({ uid }) => uid !== UserInfo._id),
        };
    }
}

const momentLikesStore = new MomentLikes();
export default momentLikesStore;
