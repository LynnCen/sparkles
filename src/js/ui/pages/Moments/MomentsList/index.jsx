import React, {
    Fragment,
    forwardRef,
    useImperativeHandle,
    useRef,
    useCallback,
    useState,
} from "react";
import { withRouter } from "react-router-dom";
import MasonryList from "../components/masonry/Masonry";
import { loadTrendingMomentsList } from "@newSdk/logic/moments/loadTrendingMomentsList";
import { MomentsTabEnum } from "../constants/tabs";
import loadFriendsMomentsList from "@newSdk/logic/moments/loadFriendsMomentsList";
import useMoments from "./useMoments";
import loadTrendingHotMoments from "@newSdk/logic/moments/loadTrendingHotMoments";
import PostMoment from "../components/postMoments/PostMoment";
import MomentsLayout from "../MomentsLayout";

const MomentList = ({ match }) => {
    const { type } = match.params || {};
    const fetchApi =
        type === MomentsTabEnum.Trending ? loadTrendingMomentsList : loadFriendsMomentsList;
    const fetchHotApi = type === MomentsTabEnum.Trending ? loadTrendingHotMoments : () => [];

    const masonryRef = useRef();
    const {
        isLoading,
        initFetching,
        loadMore,
        hasMore,
        dataSource,
        handleRefresh,
        handleAfterPublish,
    } = useMoments({
        fetchApi,
        fetchHotApi,
        masonryRef,
    });

    // useImperativeHandle(
    //     layoutRef,
    //     () => ({
    //         handleRefresh,
    //     }),
    //     [handleRefresh]
    // );

    return (
        <MomentsLayout refresh={handleRefresh}>
            {dataSource.length ? (
                <MasonryList
                    ref={masonryRef}
                    dataSource={dataSource}
                    loadMore={loadMore}
                    hasMore={hasMore}
                    isLoading={isLoading}
                />
            ) : (
                <MasonryList.EmptyWithText loading={isLoading || initFetching} />
            )}

            <PostMoment handleRefreshMoments={handleAfterPublish} />
        </MomentsLayout>
    );
};

export default withRouter(MomentList);
