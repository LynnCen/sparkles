import { useEffect, useImperativeHandle, useRef } from "react";
import CellMeasurerCache from "react-virtualized/dist/es/CellMeasurer/CellMeasurerCache";
import createMasonryCellPositioner from "react-virtualized/dist/es/Masonry/createCellPositioner";
import UiEventCenter from "utils/sn_event_center";
import hotCommentProxy from "../../store/hotCommentProxy";
import useThrottle from "../../../../hooks/useThrottle";
import commentCountProxy from "../../store/commentCountProxy";
import { fetchMomentLikes } from "@newSdk/logic/moments/momentLikes";
import mediaDownloadProxy from "../../store/mediaDownloadProxy";
import userInfoProxy from "../../../../stores_new/userInfoProxy";

export const useMasonry = (ref, hasMore, loadMore, isLoading, dataSource) => {
    const cacheRef = useRef(
        new CellMeasurerCache({
            defaultHeight: 250,
            defaultWidth: 272,
            fixedWidth: true,
            // fixedHeight: true,
        })
    );
    const cache = cacheRef.current;

    const cellPosConfigRef = useRef({
        cellMeasurerCache: cache,
        columnCount: 3,
        columnWidth: 272,
        spacer: 20,
    });
    const cellPosConfig = cellPosConfigRef.current;

    const cellPointerRef = useRef(
        createMasonryCellPositioner({
            cellMeasurerCache: cache,
            columnCount: 3,
            columnWidth: 272,
            spacer: 20,
        })
    );
    const cellPositioner = cellPointerRef.current;

    const MasonryRef = useRef();
    const infoLoadedRef = useRef(new Set());
    useEffect(() => {
        UiEventCenter.on(hotCommentProxy.event.updated, resizeMasonry);

        return () => {
            UiEventCenter.off(hotCommentProxy.event.updated, resizeMasonry);
        };
    }, [MasonryRef.current]);
    const resizeMasonry = (f) => {
        if (MasonryRef.current) {
            cache.clearAll();
            cellPositioner.reset(cellPosConfig);
            MasonryRef.current && MasonryRef.current.clearCellPositions();
        }
    };
    const scrollToTop = (offset = 0) => {
        const { _scrollingContainer } = MasonryRef.current || {};
        if (_scrollingContainer) {
            _scrollingContainer.scrollTo(0, offset);
        }
    };
    const clearCache = () => {
        infoLoadedRef.current = new Set();
    };
    useImperativeHandle(
        ref,
        () => {
            return {
                resizeMasonry,
                scrollToTop,
                clearCache,
                _instance: MasonryRef.current,
            };
        },
        [resizeMasonry, MasonryRef.current]
    );
    useEffect(() => {
        // resizeMasonry();
        if (hasMore && loadMore) {
            loadMore();
        }
    }, []);

    const getItemInfo = useThrottle(
        (start, end) => {
            const visibleItems = dataSource.slice(start, end);
            // console.log(start, end, visibleItems, dataSource);
            let queryItems = [];
            visibleItems.forEach((item) => {
                if (!infoLoadedRef.current.has(item.id)) {
                    queryItems.push(item);
                    infoLoadedRef.current.add(item.id);
                }
            });

            if (!queryItems.length) return true;

            const ids = queryItems.map((item) => item.id);

            // 获取点赞数
            commentCountProxy.getCommentCountMap(ids);
            hotCommentProxy.getCommentMap(ids);
            fetchMomentLikes(ids);
            queryItems.forEach((item) => {
                // 下载媒体资源
                if (item.media && item.media.length) {
                    item.media.forEach(mediaDownloadProxy.addDownloadList);
                }
                // 下载转发 媒体资源
                if (item.forwardRoot && item.forwardRoot.media && item.forwardRoot.media.length) {
                    item.forwardRoot.media.map(mediaDownloadProxy.addDownloadList);
                }
                userInfoProxy.getBaseInfo(item.uid);
            });
        },
        200,
        [dataSource, infoLoadedRef.current]
    );

    const handleCellsRendered = ({ startIndex, stopIndex }) => {
        getItemInfo(startIndex, stopIndex);
        if (stopIndex && stopIndex >= dataSource.length - 5 && hasMore) {
            loadMore();
        }
    };

    return {
        cache,
        cellPosConfig,
        cellPositioner,
        resizeMasonry,
        MasonryRef,
        handleCellsRendered,
    };
};

export default useMasonry;
