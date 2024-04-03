import FeedDetails, {
    FeedDetailProps,
    ForwardFeedDetailProps,
} from "@newSdk/model/moments/FeedDetails";
import loadMomentsInfoSyncRemote from "@newSdk/logic/moments/_loadMomentsInfoSyncRemote";
import { arrayToMap } from "@newSdk/utils";
import { last } from "lodash";
import _forwardMomentLinkChecker from "@newSdk/logic/moments/_forwardMomentLinkChecker";

export const _loadForwardDisplay = async (localList: FeedDetailProps[], isCheckLink = true) => {
    // 转发moments 处理
    const needInfoSet = new Set<string>();

    // 获取转发显示需要等 原moment
    localList.forEach((item) => {
        if (FeedDetails.isForwardMoments(item)) {
            const { referRoot, referPres = [] } = item;
            needInfoSet.add(referRoot as string);
            referPres.forEach((id) => needInfoSet.add(id));
        }
    });

    // 获取 原 moments 详情
    const infoList = await loadMomentsInfoSyncRemote(Array.from(needInfoSet), {
        isLoadForwardDisplay: false,
    });

    // 转map
    const infoMap = arrayToMap(infoList, "id");

    // 需要递归查询的列表
    const forwardCheckLinks: any[] = [];

    // 注入当前列表
    localList = localList.map((item) => {
        if (FeedDetails.isForwardMoments(item)) {
            const forwardItem: ForwardFeedDetailProps = { ...item };
            const { referRoot, referPres = [] } = item;

            const root = infoMap.get(referRoot);
            forwardItem.forwardRoot = root;

            // 两级发布链，从后往前
            const forwardInfoLink = [];

            // 转发链内容，查看是否被删除
            const forwardLink = [...referPres];
            for (let i = 0; i < forwardLink.length; i++) {
                const id = forwardLink[i];
                const item = infoMap.get(id);

                // 转发链断开 --> 删除状态 || 拿不到item。 表示删除
                if (!item || FeedDetails.isDeleted(item)) {
                    forwardItem.breakOff = true;
                    break;
                }

                forwardInfoLink.push(item);
            }
            forwardItem.forwardPresInfo = forwardInfoLink;
            forwardItem.isForward = true;

            // 记录当前节点，递归两级以上的链，检测是否中断
            const endNode = last(forwardInfoLink);
            if (endNode) {
                const lastLinkNode = endNode.id === root.id;

                // 转发链味道头 && 当前没有检测到链有断开
                if (!lastLinkNode && !forwardItem.breakOff) {
                    forwardCheckLinks.push({
                        currentId: item.id,
                        preIdMax: endNode.id,
                        rootId: root.id,
                    }); //[item.id] = info;
                }
            }

            return forwardItem;
        }

        return item;
    });

    // forwardLinks
    // todo: check
    if (isCheckLink) {
        _forwardMomentLinkChecker()(forwardCheckLinks);
    }
    return localList;
};

export default _loadForwardDisplay;
