import { getUpvoteLists } from "@newSdk/service/api/moments/getUpvoteLists";
import MomentLikesModel from "@newSdk/model/moments/Likes";
import { pullAll, groupBy, keys } from "lodash";
import nc from "@newSdk/notification";

async function fetchMomentLikes(ids: string[]) {
    const data = await getMomentsLike(ids);
    getUpvoteLists(ids).then(async (likes) => {
        await MomentLikesModel.bulkDelete(ids);
        const newMomentLikes = groupBy(likes, "mid");
        const newMomentIds = keys(newMomentLikes);
        // console.log(likes, newMomentLikes, newMomentIds.length, ids.length);
        let delItems: string[];
        if (newMomentIds.length >= ids.length) {
            delItems = [];
        } else {
            delItems = pullAll(ids, newMomentIds);
        }

        MomentLikesModel.bulkAdd(likes, delItems);
    });
    return data;
}

async function getMomentsLike(moments: string[]) {
    return await MomentLikesModel.bulkGet(moments);
}

function addMomentLikesObserver(fn: (data: any) => void) {
    nc.addObserver("momentLikes", fn);
}

function removeMomentLikesObserver(fn: (data: any) => void) {
    nc.removeObserve("momentLikes", fn);
}

export { fetchMomentLikes, getMomentsLike, addMomentLikesObserver, removeMomentLikesObserver };
