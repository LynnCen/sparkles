/**
 * @Author Pull
 * @Date 2021-10-28 20:15
 * @project Moments
 */
import React, { Fragment, useRef } from "react";
import Masonry from "../../components/masonry/Masonry";
import useMoments from "./useMoments";
import PostMoment from "../../components/postMoments/PostMoment";
import { withRouter } from "react-router-dom";
import UserMomentsLayout from "../index";
import tmmUserInfo from "@newSdk/model/UserInfo";
export const UserMoments = withRouter(({ match = {}, parentRef = {} }) => {
    const { uid } = match.params || {};
    const masonryRef = useRef();
    const { dataSource, loadMore, isLoading, hasMore, resetAll } = useMoments(
        uid,
        masonryRef,
        parentRef
    );

    return (
        <UserMomentsLayout>
            {(onChildScroll) => (
                <Fragment>
                    {dataSource.length ? (
                        <Masonry
                            // onScroll={handleScroll}
                            ref={masonryRef}
                            dataSource={dataSource}
                            loadMore={loadMore}
                            hasMore={hasMore}
                            isLoading={isLoading}
                            loadingStyle={{ bottom: 8 }}
                            onScroll={onChildScroll}
                            scrollingResetTimeInterval={88}
                        />
                    ) : uid === tmmUserInfo._id ? (
                        <Masonry.Empty
                            loading={isLoading}
                            bodyStyle={{ alignItems: "flex-start", top: 100 }}
                        />
                    ) : (
                        <Masonry.EmptyWithText
                            loading={isLoading}
                            bodyStyle={{ alignItems: "flex-start", height: "auto", paddingTop: 50 }}
                        />
                    )}
                    {uid === tmmUserInfo._id && <PostMoment handleRefreshMoments={resetAll} />}
                </Fragment>
            )}
        </UserMomentsLayout>
    );
});
export default UserMoments;
