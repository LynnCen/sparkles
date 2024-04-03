import settings from "./stores/settings";
import OverallUserCard from "./stores/OverallUserCard";
/* region: Tag 组件store 拆分*/
/* endregion */

/* region:重构 */
import NewSession from "./stores_new/session";
import NewChat from "./stores_new/chat";
import Common from "./stores_new/common";
import IntersectionWatcher from "./stores_new/intersectionObserver";
import UserInfoProxy from "./stores_new/userInfoProxy";
import DownloadCenter from "./stores_new/downloadCenter";
import FormatIntlTemp from "./stores_new/formatIntlTemplate";
import Comments from "./stores_new/comments";
import MomentLikes from "./stores_new/momentLikes";
import Notification from "./stores_new/notifications";
import SessionBoardStore from "./components/TmmSessionBoard/sessionBoardStore.ts";
import SessionInfoProxy from "./stores_new/sessionInfoProxy";
// moments
import MediaDownloadProxy from "./pages/Moments/store/mediaDownloadProxy";
import HotCommentProxy from "./pages/Moments/store/hotCommentProxy";
import ForwardCountProxy from "./pages/Moments/store/forwardCountProxy";
import CommentCountProxy from "./pages/Moments/store/commentCountProxy";
import ForwardMoments from "./pages/Moments/store/forwardMoments";
import { UserProxyEntity } from "./stores_new/userProxy";
/* endregion:重构 */

/**
 * Tips: the store should have a “clearCache” method which need cache any data. for clear state when login out。
 */

const newStores = {
    NewSession,
    NewChat,
    Common,
    SessionBoardStore,
    IntersectionWatcher,
    UserInfoProxy,
    UserProxyEntity,
    DownloadCenter,
    FormatIntlTemp,
    Comments,
    MomentLikes,
    Notification,

    SessionInfoProxy,
    HotCommentProxy,
    ForwardCountProxy,
    CommentCountProxy,
    MediaDownloadProxy,

    ForwardMoments,
};

const stores = {
    settings,
    OverallUserCard,
};

const state = Object.assign(stores, newStores);
export const clearCache = () => {
    // TODO: test effect
    for (let key in state) {
        const store = state[key];
        if (store.clearCache) store.clearCache();
    }
};

export default state;
