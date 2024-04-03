import getFeedIds from "@newSdk/service/api/moments/getFeedIds";
import getSelfFeedIds from "@newSdk/service/api/moments/getSelfFeedIds";
import storage from "utils/storage";
import tmmUserInfo from "@newSdk/model/UserInfo";
import feedsModel from "@newSdk/model/moments/FeedsModel";
import getFeedInfos from "@newSdk/service/api/moments/getFeedInfos";
import FeedDetails from "@newSdk/model/moments/FeedDetails";
import moment from "moment";
import { mergeObArray } from "@newSdk/utils";
import topicDetail from "@newSdk/model/moments/TopicDetail";
import _checkDeleteMoments from "@newSdk/logic/moments/_checkDeleteMoments";
import nc from "@newSdk/notification";
interface ICacheInfo {
    areaFeedsSequence?: number;
    selfFeedsSequence?: number;
    newMoments?: boolean;
}

const DefaultInsertTimePoint = moment.duration("3", "days").milliseconds();

export const fetchFeeds = async () => {
    const momentsCacheInfo = (await storage.get("moments")) || {};
    const cacheInfo: ICacheInfo = (await storage.get(`moments.${tmmUserInfo._id}`)) || {};
    const { areaFeedsSequence = 0, selfFeedsSequence = 0 } = cacheInfo;

    const [
        { flow: areaFlow, abstract: areaAbstract, topic: areaTopic },
        { flow: selfFlow, abstract: selfAbstract, topic: selfTopic },
    ] = await Promise.all([
        getFeedIds(Number(areaFeedsSequence)),
        getSelfFeedIds(Number(selfFeedsSequence)),
    ]);

    topicDetail.bulkPutTopic([...areaTopic, ...selfTopic]);

    const areaFeeds = mergeObArray(areaAbstract, areaFlow, "mid");
    const selfFeeds = mergeObArray(selfAbstract, selfFlow, "mid");

    const areaSeq = areaFlow.sort((a: any, b: any) => a.create_time - b.create_time)[
        areaFlow.length - 1
    ]?.sequence;
    const selfSeq = selfFlow.sort((a: any, b: any) => a.create_time - b.create_time)[
        selfFlow.length - 1
    ]?.sequence;

    const mergeList = [...areaFeeds, ...selfFeeds];
    if (!mergeList.length) return;

    // 去重
    let existId: string[] = [];
    let minCreateTime = Date.now();
    // 接口数据去重
    const filterItems = [...areaFeeds, ...selfFeeds].filter(({ mid, create_time }, i) => {
        const f = !existId.includes(mid);

        // 添加当前项
        if (f) existId.push(mid);

        // 更新最早时间
        minCreateTime = Math.min(minCreateTime, create_time);

        return f;
    });

    existId = [];
    // 数据库去重
    const dbList = await feedsModel.getMomentsUtilTime(minCreateTime);
    const existIdList = dbList.map((item) => item.mid);
    const list = filterItems.filter((item) => !existIdList.includes(item.mid));

    // 排序
    list.sort((a, b) => b.create_time - a.create_time);
    // console.log(list)
    // 入库
    await feedsModel.insertBulkIds([...list].map(feedsModel.itemTransform));
    // 更新本地 sequence
    if (areaSeq) cacheInfo.areaFeedsSequence = areaSeq;
    if (selfSeq) {
        //
        if (selfSeq > selfFeedsSequence) {
            nc.publish(feedsModel.Event.FriendsUpdated, {});
            cacheInfo.newMoments = true;
        }

        cacheInfo.selfFeedsSequence = selfSeq;
    }
    momentsCacheInfo[tmmUserInfo._id] = cacheInfo;
    await storage.set("moments", momentsCacheInfo);

    // 拉取最近moments数据入库 || []
    const beforeTimePoint = Date.now() - DefaultInsertTimePoint;
    let recentList = list.filter((item) => item.create_time > beforeTimePoint);
    if (!recentList.length || recentList.length < 20) recentList = list.slice(0, 20);

    // 拉取moments详情
    const moments = await getFeedInfos(recentList.map((item) => item.mid));

    // 删除 moments
    _checkDeleteMoments([...moments]);
    // 入库
    await FeedDetails.bulkPutMoments([...moments].map(FeedDetails.itemTransform));

    return moments;
};
