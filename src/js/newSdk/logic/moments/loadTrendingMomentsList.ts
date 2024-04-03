/**
 * 1、查询 流id。
 * + 分时间片查 今天---》 三天前
 *  —— 没有数据切不为数据库最后一条数据, 则递归查询知道有数据
 *
 * + loadMore(lastTime) ---> offset>三天前--》 loader 知道有数据
 *  递归出口：？？
 *
 * ---> 查询 moments
 * 根据流 id 查询moments, 没有则到服务端拉取。
 */
import _loadFeedsWithSize from "@newSdk/logic/moments/_loadFeedsWithSize";
import loadMomentsInfoSyncRemote from "@newSdk/logic/moments/_loadMomentsInfoSyncRemote";
import FeedDetails from "@newSdk/model/moments/FeedDetails";

export const loadTrendingMomentsList = async ({ timePage }: { timePage: number }) => {
    // console.log("effff");
    // 查询moments
    // console.log("query --->", timePage, Date.now());
    const ids = await _loadFeedsWithSize({ time: timePage });
    // console.log(`query ---->`, ids);
    // 查询本地db
    const localList = await loadMomentsInfoSyncRemote(ids, { isLoadForwardDisplay: true });

    // console.log(`query ----->`, localList);
    return localList || [];
};
