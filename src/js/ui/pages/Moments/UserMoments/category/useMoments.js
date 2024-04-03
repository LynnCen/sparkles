/**
 * @Author Pull
 * @Date 2021-10-19 14:53
 * @project useMasonry
 */
import { useEffect, useRef, useState } from "react";
import { fetchMomentLikes } from "@newSdk/logic/moments/momentLikes";
import hotCommentProxy from "../../store/hotCommentProxy";
import nc from "@newSdk/notification";
import FeedDetails from "@newSdk/model/moments/FeedDetails";
import { getRepostListCount } from "@newSdk/logic/moments/getRepostLists";
import ForwardCountProxy from "../../store/forwardCountProxy";
import loadUserMoments from "@newSdk/logic/moments/loadUserMoments";
import fetchUserFeeds from "@newSdk/logic/moments/fetchUserFeeds";
import momentUserFeeds from "@newSdk/model/moments/UserFeeds";
import UiEventCenter, { UiEventType } from "utils/sn_event_center";
import tmmUserInfo from "@newSdk/model/UserInfo";

const defaultSearch = {
    startIndex: 0,
    lastSequence: 0,
    includeType: momentUserFeeds.tag.all,
};

export const useMasonry = (uid, masonryRef) => {
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [searchParams, setSearchParams] = useState(() => ({ ...defaultSearch, uid }));
    const [hasMore, setHasMore] = useState(true);
    const fetchedCommentList = useRef(new Set());
    const initRef = useRef(true);

    useEffect(() => {
        loadMore();
        handleRefresh();
    }, []);

    useEffect(() => {
        nc.on(FeedDetails.Event.MomentsChange, _handleDataChange);

        nc.on(FeedDetails.Event.MomentsForwardLinkBreak, _handleLinkBreak);
        return () => {
            nc.off(FeedDetails.Event.MomentsChange, _handleDataChange);
            nc.off(FeedDetails.Event.MomentsForwardLinkBreak, _handleLinkBreak);
        };
    }, [dataSource, isLoading]);

    useEffect(() => {
        UiEventCenter.on(UiEventType.MOMENT_REFRESH, handleAppletShare);

        return () => {
            UiEventCenter.off(UiEventType.MOMENT_REFRESH, handleAppletShare);
        };
    }, [dataSource, isLoading]);

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
        if (masonryRef.current) masonryRef.current.resizeMasonry();
    };

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

    const handleRefresh = async () => {
        await fetchUserFeeds(uid);
        setSearchParams({ ...defaultSearch, uid });
        initRef.current = true;
        console.log("effect");
        loadMore().then(() => {
            if (masonryRef.current) masonryRef.current.resizeMasonry();
        });
    };

    const handleAppletShare = () => {
        if (uid === tmmUserInfo._id) {
            return handleRefresh();
        }
    };

    //
    const loadMore = async () => {
        if (isLoading) return;
        setIsLoading(true);

        let data = [];
        let selfLoaded = [];
        let lSequence = -1;

        const initFlag = initRef.current;

        initRef.current = false;
        if (initFlag) {
            const { list, lastSequence } = await loadUserMoments({ ...searchParams, init: true });
            console.log(list);
            data = list;
            lSequence = lastSequence;
            selfLoaded = [...data];
        } else {
            const { list: items, lastSequence } = await loadUserMoments({
                ...searchParams,
                init: false,
            });
            lSequence = lastSequence;
            data = [...dataSource, ...items];
            selfLoaded = [...items];
        }

        // console.log(data);
        // 初始化 flag
        setDataSource(data);
        onLoaded(selfLoaded, [...data], lSequence);
    };

    const onLoaded = (dataChunk, list, lastSequence) => {
        setIsLoading(false);
        if (!dataChunk || !dataChunk.length /*|| dataListChunk.length < 20 */)
            return setHasMore(false);

        setSearchParams({
            ...defaultSearch,
            uid,
            // startIndex: list.length || 0,
            lastSequence,
        });
    };

    const resetAll = () => {};

    return {
        isLoading,
        dataSource,
        handleRefresh,
        resetAll,
        loadMore,
        hasMore,
    };
};

export default useMasonry;
