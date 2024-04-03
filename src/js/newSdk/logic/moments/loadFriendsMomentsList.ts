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
import feedsModel, { FeedProps } from "@newSdk/model/moments/FeedsModel";
import FeedDetails from "@newSdk/model/moments/FeedDetails";
import getFeedInfos from "@newSdk/service/api/moments/getFeedInfos";
import Members from "@newSdk/model/Members";
import _loadFeedsWithSize from "@newSdk/logic/moments/_loadFeedsWithSize";
import tmmUserInfo from "@newSdk/model/UserInfo";
import loadMomentsInfoSyncRemote from "@newSdk/logic/moments/_loadMomentsInfoSyncRemote";

export const loadFriendsMomentsList = async ({ timePage }: { timePage: number }) => {
    console.log("----> start fetching");
    const friendsList = (await Members.getAllMyFriends()).map((item) => item.id);
    if (!friendsList || friendsList.length === 0) return [];

    // 筛选好友（包括自己）
    const filterRule = (item: FeedProps) =>
        [...friendsList, tmmUserInfo._id].includes(item.uid) && !feedsModel.isDeleted(item);
    const ids = await _loadFeedsWithSize({ time: timePage, filter: filterRule });

    // 查询moments
    // 查询本地db
    const localList = await loadMomentsInfoSyncRemote(ids, { isLoadForwardDisplay: true });

    console.log("----> end fetching");
    // 查询用户信息
    return localList || [];
};

export default loadFriendsMomentsList;
