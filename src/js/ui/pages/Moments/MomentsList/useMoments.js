/**
 * @Author Pull
 * @Date 2021-10-19 14:53
 * @project useMasonry
 */
import { useEffect, useRef, useState } from "react";
import { fetchMomentLikes } from "@newSdk/logic/moments/momentLikes";
import hotCommentProxy from "../store/hotCommentProxy";
import nc from "@newSdk/notification";
import FeedDetails from "@newSdk/model/moments/FeedDetails";
import { getRepostListCount } from "@newSdk/logic/moments/getRepostLists";
import ForwardCountProxy from "../store/forwardCountProxy";
import { fetchFeeds } from "@newSdk/logic/moments/fetchFeeds";
import fetchHotFeeds from "@newSdk/logic/moments/fetchHotFeeds";
import commentCountProxy from "../store/commentCountProxy";
import { getCurrentTimeWithOffset } from "@newSdk/logic/moments/utils";
import UiEventCenter, { UiEventType } from "utils/sn_event_center";
import { defaultChunkSize } from "@newSdk/logic/moments/_loadFeedsWithSize";

const hotMomentsCuIdPrefix = "hot_";

export const useMasonry = ({ fetchApi, fetchHotApi, masonryRef } = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [initFetching, setInitFetching] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const searchParams = useRef({ timePage: getCurrentTimeWithOffset() });
    const [hasMore, setHasMore] = useState(true);
    const fetchedCommentList = useRef(new Set());

    const initRef = useRef(true);

    // 刷新
    useEffect(() => {
        loadMore();

        setInitFetching(true);
        handleRefresh().finally(() => {
            setInitFetching(false);
        });

        return () => {
            useMasonry._isUnmount = true;
        };
    }, []);

    useEffect(() => {
        nc.on(FeedDetails.Event.MomentsChange, _handleDataChange);
        UiEventCenter.on(UiEventType.MOMENT_REFRESH, handleAfterPublish);

        nc.on(FeedDetails.Event.MomentsForwardLinkBreak, _handleLinkBreak);
        return () => {
            nc.off(FeedDetails.Event.MomentsChange, _handleDataChange);
            nc.off(FeedDetails.Event.MomentsForwardLinkBreak, _handleLinkBreak);
            UiEventCenter.off(UiEventType.MOMENT_REFRESH, handleAfterPublish);
        };
    }, [dataSource, masonryRef.current]);

    const _handleDataChange = (list, tag) => {
        switch (tag) {
            case FeedDetails.Tag.Del:
                return _handleDel(list);
        }
    };
    const _handleDel = (list) => {
        const ids = list.map(({ id }) => id);
        const renderAble = dataSource.filter(({ id }) => !ids.includes(id));
        setDataSource(renderAble);
        try {
            if (masonryRef.current) masonryRef.current.resizeMasonry();
        } catch (e) {
            console.error(e);
            setTimeout(() => {
                if (masonryRef.current) masonryRef.current.resizeMasonry();
            }, 444);
        }
    };
    // 转发断链
    const _handleLinkBreak = (list) => {
        if (list && list.length) {
            const _data = dataSource.map((item) => {
                if (list.includes(item.id)) item.breakOff = true;
                return item;
            });
            setDataSource([..._data]);
            if (masonryRef.current) masonryRef.current.resizeMasonry();
        }
    };

    const refresh = async () => {
        const [, hotMomentsInfo] = await Promise.all([fetchFeeds(), fetchHotFeeds()]);
        return hotMomentsInfo || [];
    };
    const resetParams = () => {
        setHasMore(true);

        searchParams.current = { timePage: getCurrentTimeWithOffset() };
        fetchedCommentList.current = new Set();
        // hack:目前没有找到 回顶顶部的方法。
        // setDataSource([...dataSource.slice(0, 3)]);
    };
    const handleRefresh = async (newMoment) => {
        await refresh();
        resetParams();
        initRef.current = true;
        await loadMore();
        if (masonryRef.current) {
            masonryRef.current.clearCache();
            masonryRef.current.resizeMasonry();
            masonryRef.current.scrollToTop();
        }
    };

    const handleAfterPublish = (newMoment) => {
        if (masonryRef.current) {
            const _dataSource = [...dataSource];
            newMoment.uuid = `temp_${newMoment.id}`;
            _dataSource.unshift(newMoment);
            setDataSource(_dataSource);
            masonryRef.current.clearCache();
            masonryRef.current.resizeMasonry();
            masonryRef.current.scrollToTop();
        }
    };

    //
    const loadMore = async () => {
        if (isLoading) return;
        setIsLoading(true);

        let data = [];
        let selfLoaded = [];
        const initFlag = initRef.current;
        initRef.current = false;

        if (initFlag) {
            const [items, hot] = await Promise.all([fetchApi(searchParams.current), fetchHotApi()]);
            data = [
                ...hot.map((item) => ({ ...item, uuid: `${hotMomentsCuIdPrefix}${item.id}` })),
                ...items,
            ];
            // data = [...hot, ...items];
            selfLoaded = [...data];
        } else {
            const items = await fetchApi(searchParams.current);
            data = [...dataSource, ...items];
            selfLoaded = [...items];
        }

        // 初始化 flag
        setMomentsList(data);
        if (masonryRef.current) masonryRef.current.resizeMasonry();
        afterLoad(selfLoaded);
    };

    const afterLoad = (dataListChunk) => {
        setIsLoading(false);
        if (!dataListChunk || !dataListChunk.length /*|| dataListChunk.length < 20 */)
            return setHasMore(false);

        const timePage = dataListChunk[dataListChunk.length - 1].createTime;
        searchParams.current = { timePage };

        if (dataListChunk < defaultChunkSize) {
            console.log("effect fetch enough");
            loadMore();
        }
    };

    const setMomentsList = (data) => {
        const isHotItem = (item) => item.uuid && item.uuid.startsWith(hotMomentsCuIdPrefix);

        const hotKeys = data.filter(isHotItem).map((item) => item.id);

        // 在普通moments 中去除 已显示在热榜的 moments
        const filterEqualsItem = data.filter(
            (item) => isHotItem(item) || !hotKeys.includes(item.id)
        );
        setDataSource(filterEqualsItem);
    };

    return {
        isLoading,
        initFetching,
        dataSource,
        handleRefresh,
        handleAfterPublish,
        hasMore,
        loadMore,
    };
};

export default useMasonry;
