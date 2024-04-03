import feedsModel, { FeedProps } from "@newSdk/model/moments/FeedsModel";
import moment from "moment";
import { offsetMin } from "@newSdk/logic/moments/utils";
import MomentsType from "@newSdk/model/moments/instance/MomentsType";
const getTimeRange = (day: number) => moment.duration(day, "days").asMilliseconds();
// 初次拉取时间 = 当前时间 + 5m

const futureRange = moment.duration(offsetMin, "minutes").asMilliseconds();
interface IProps {
    time: number;
    filter?: (x: FeedProps) => boolean;
}

export const defaultChunkSize = 20;
export const _loadFeedsWithSize = async ({ time = Date.now() + futureRange, filter }: IProps) => {
    if ((await feedsModel.getFeedsCount()) === 0) return [];

    const checkDBLessWithMaxIntervalDay = 30;

    let intervalDay = 3;
    let start = time;
    let end = start - getTimeRange(intervalDay);

    let list: FeedProps[] = [];
    let hasMore = true;

    // 获取 流列表
    while (
        list.filter((item) => item.type !== MomentsType.DELETE).length < defaultChunkSize &&
        hasMore
    ) {
        // console.log("each query range ------>", start, end, hasMore);
        const queryList = await feedsModel.loadFeedsIds(start, end, filter);
        list = list.concat(queryList);

        let nextStart = end;
        // 当查询到当前间隔天数超过30天查询 是否数据库为空
        if (intervalDay > checkDBLessWithMaxIntervalDay) {
            // start： 下一次开始查询的时间
            const _nextStart = await feedsModel.getFeedsLessCount(end);
            // 没有下一条，后续没有数据，db为空
            if (!_nextStart) {
                hasMore = false;

                // 跳过当前
                continue;
            } else {
                nextStart = _nextStart;
            }
        }

        // next
        start = nextStart;
        intervalDay += Math.ceil(intervalDay / 2);
        end = start - getTimeRange(intervalDay);
    }

    const sortList = [...list].sort((a, b) => b.createTime - a.createTime);
    return sortList.map((item) => item!.mid as string);
};
export default _loadFeedsWithSize;
