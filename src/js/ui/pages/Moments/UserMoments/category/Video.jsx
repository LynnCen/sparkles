import useMoments from "./useMoments";
import momentUserFeeds from "@newSdk/model/moments/UserFeeds";
import loadUserMoments from "@newSdk/logic/moments/loadUserMoments";
import fetchUserFeeds from "@newSdk/logic/moments/fetchUserFeeds";
import Masonry from "../../components/masonry/Masonry";
import React from "react";

/**
 * @Author Pull
 * @Date 2021-10-28 20:16
 * @project Video
 */

export const UserVideo = ({ uid }) => {
    const { searchParams, hasMore, onLoaded, reset } = useMoments(uid);

    const includeType = momentUserFeeds.tag.video;
    const fetchApi = (init) => loadUserMoments({ ...searchParams, uid, includeType, init });
    const refreshApi = async () => fetchUserFeeds(uid);

    return (
        // <Masonry
        //     ref={ref}
        //     dataSource={dataSource}
        //     loadMore={loadMore}
        //     hasMore={hasMore}
        //     isLoading={isLoading}
        // />
        <section>Video</section>
    );
};

export default UserVideo;
