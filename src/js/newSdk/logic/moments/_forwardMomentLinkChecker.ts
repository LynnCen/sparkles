/**
 *
 * 1. 当前转发链信息
 * 2. 检查当前最上层是否未根结点
 * 3. 查询转发链已知最上层
 * 4. 检查转发链是否中断 (转发链)
 * 5. 不是最上层 构建转发链信息， to 1
 *
 */

import loadMomentsInfoSyncRemote from "@newSdk/logic/moments/_loadMomentsInfoSyncRemote";
import FeedDetails, { ForwardFeedDetailProps } from "@newSdk/model/moments/FeedDetails";
import nc from "@newSdk/notification";

interface Link {
    currentId: string;
    preIdMax: string;
    rootId: string;
}

export const _forwardMomentLinkChecker = () => {
    // 1. 递归 preInMax -> info -> pres -> === root ? break: call();

    // const forwardLink = {};
    // const nextCheckList = [];
    // let i = 1;
    // const log = (msg: any) => console.log(`-------> ${i}`, msg);
    const breakOffList: string[] = [];
    return async function checkFn(list: Link[]): Promise<void> {
        // 需要下次查询的 id 集合 { [下次查询的id]: 查询的转发节点id }
        const queryIdList: { [key: string]: any } = {};

        // log("input");
        // log(list);

        // 2. 检查是否为根结点
        list.map((item) => {
            // 当前可知最上层转发id，不是根节点
            if (item.preIdMax !== item.rootId) {
                queryIdList[item.preIdMax] = item.currentId;
            }
        });

        const ids = Object.keys(queryIdList);

        // 获取转发链信息
        const forwardLinkItem = await loadMomentsInfoSyncRemote(ids, {
            isLoadForwardDisplay: true,
            isCheckLink: false,
        });

        // 下一次
        const nextCheckList: Link[] = [];
        // 检查是否断层。
        forwardLinkItem.forEach((item: ForwardFeedDetailProps) => {
            const preIdMax = item.referPres![0];

            if (preIdMax === item.referRoot) {
                /* 未断层 */
            } else if (item.referPres?.length !== item.forwardPresInfo?.length) {
                /* 已断层 */
                // 已断层
                breakOffList.push(queryIdList[item.id]);
                // console.log(" ---> ", item);
            } else {
                // 递归
                nextCheckList.push({
                    currentId: queryIdList[item.id],
                    preIdMax: item.referPres![0] as string,
                    rootId: item.referRoot as string,
                });
            }
        });

        // -------------------------> 递归出口
        if (!nextCheckList.length) {
            console.log(`break off`, breakOffList);
            publishLinkBreakOff(breakOffList);
            return;
        } // out

        // i++;
        return checkFn(nextCheckList);
    };
};

const publishLinkBreakOff = (list: string[]) => {
    if (list && list.length) nc.publish(FeedDetails.Event.MomentsForwardLinkBreak, list);
};

export default _forwardMomentLinkChecker;
