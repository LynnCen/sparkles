import keyValueModel from "@newSdk/model/keyValues/KeyValue";
import SupportDBKey from "@newSdk/model/keyValues/SupportDBKey";
import loadMomentsInfoSyncRemote from "@newSdk/logic/moments/_loadMomentsInfoSyncRemote";
import FeedDetails from "@newSdk/model/moments/FeedDetails";
import { arrayToMap } from "@newSdk/utils";

export const loadTrendingHotMoments = async () => {
    const hotMoments = await keyValueModel.getValueByKey(SupportDBKey.MomentHotFeeds);

    if (!hotMoments) return [];

    const ids = hotMoments.map((item: any, i: number) => item.mid);
    const list = await loadMomentsInfoSyncRemote(ids, { isLoadForwardDisplay: true });
    const listMap = arrayToMap(list, "id");

    return ids.map((id: string) => listMap.get(id)).filter(Boolean) || [];
    //     console.log(hotKeys);
};

export default loadTrendingHotMoments;
