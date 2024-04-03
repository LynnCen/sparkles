import useMoments from "./useMoments";
import loadUserMoments from "@newSdk/logic/moments/loadUserMoments";
import momentUserFeeds from "@newSdk/model/moments/UserFeeds";
import fetchUserFeeds from "@newSdk/logic/moments/fetchUserFeeds";
import Masonry from "../../components/masonry/Masonry";
import React from "react";

/**
 * @Author Pull
 * @Date 2021-10-28 20:16
 * @project Picture
 */

export const UserPicture = ({ uid }) => {
    const { searchParams, hasMore, onLoaded, reset } = useMoments(uid);

    const includeType = momentUserFeeds.tag.image;
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
        <section>Picture</section>
    );
};

export default UserPicture;
