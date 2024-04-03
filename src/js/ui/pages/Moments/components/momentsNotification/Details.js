import React from "react";
import { Avatar, Badge, Button } from "antd";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import { inject, observer } from "mobx-react";

import MomentFromNow from "components/MomentFromNow";
import {
    addNewNotification,
    clearNotification,
    fetchNoticesPerPage,
    getCounts,
    readNotification,
} from "@newSdk/logic/moments/notifications";
import { getPid } from "@newSdk/logic/comments/comments";
import mediaDownloadProxy from "../../store/mediaDownloadProxy";
import loadMomentsInfoSyncRemote from "@newSdk/logic/moments/_loadMomentsInfoSyncRemote";
import { getComments } from "@newSdk/service/api/comments/fetchComments";
import { parse_text } from "../../../Home/NewChat/components/MessageInput/image_of_emoji/emoji_helper";
import { LikeRedIcon, VideoStart } from "../../../../icons";
import { getNameWeight } from "utils/nameWeight";
import cx from "./index.less";

const MOMENT_COMMENT_TYPE = 1;
const MOMENT_UPVOTE_TYPE = 2;
const COMMENT_UPVOTE_TYPE = 3;
const COMMENT_REPLY_TYPE = 4;
const MOMENT_REPOST_TYPE = 5;

@inject((store) => ({
    notifications: store.Notification.notifications,
    addNotifications: store.Notification.addNotifications,
    getNewNotification: store.Notification.getNewNotification,
    getBaseUserInfo: store.UserInfoProxy.getBaseInfo,
    getComputedProxyInfo: store.UserInfoProxy.proxyInfo,
    clearAllNotifications: store.Notification.clearAllNotifications,
    initNotifications: store.Notification.initNotifications,
    unreadCount: store.Notification.counts,
}))
@observer
class Detail extends React.Component {
    state = {
        currentPage: 1,
        isLoading: false,
        total: 0,
    };

    onLoadMore = async () => {
        const { addNotifications } = this.props;
        const { currentPage, isLoading } = this.state;
        if (isLoading) return;
        try {
            this.setState({ isLoading: true });
            const data = await fetchNoticesPerPage(currentPage);
            addNotifications(data);
            this.setState({ currentPage: currentPage + 1 });
        } catch (e) {
            //
        } finally {
            this.setState({ isLoading: false });
        }
    };

    onClearAll = () => {
        const { clearAllNotifications } = this.props;
        clearNotification();
        clearAllNotifications();
    };

    componentDidMount() {
        addNewNotification(this.updateData);
        this.updateData();
        this.props.getNewNotification();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible && this.props.visible) {
            this.updateData();
            this.props.getNewNotification();
        }
    }

    updateData = () => {
        const { initNotifications } = this.props;
        this.setState({ currentPage: 1 }, async () => {
            const { currentPage } = this.state;
            const data = await fetchNoticesPerPage();
            initNotifications(data);
            this.setState({ currentPage: currentPage + 1 });
            getCounts().then((total) => this.setState({ total }));
        });
    };

    render() {
        const { notifications = [], history, intl, unreadCount } = this.props;
        const { total, isLoading } = this.state;
        let hasMore = notifications.length < total;
        return (
            <div className={cx.notification_box}>
                <div
                    className={`${cx.notification_header} dark-theme-bg_darkness dark-theme-border_normal`}
                >
                    <span className="dark-theme-color_lighter">
                        {intl.formatMessage({ id: "notification" })}
                    </span>
                    {!!unreadCount && (
                        <div className={cx.notification_headClear} onClick={this.onClearAll}>
                            {intl.formatMessage({ id: "clear" })}
                        </div>
                    )}
                </div>
                <section className={cx.notification_list}>
                    <div className="dark-theme-border_darkness">
                        {notifications && notifications.length ? (
                            notifications.map((item) => (
                                <div className={cx.notification_container} key={item.id}>
                                    <Item notificationInfo={item} history={history} intl={intl} />
                                </div>
                            ))
                        ) : (
                            <aside className={`${cx.notification_empty} dark-theme-color_grey`}>
                                {intl.formatMessage({ id: "comment_nomore" })}
                            </aside>
                        )}
                    </div>

                    {hasMore && (
                        <Button type={"link"} block onClick={this.onLoadMore} loading={isLoading}>
                            {intl.formatMessage({ id: "see_more" })}
                        </Button>
                    )}
                </section>
            </div>
        );
    }
}

export default withRouter(injectIntl(Detail));

@inject((store) => ({
    notifications: store.Notification.notifications,
    getBaseUserInfo: store.UserInfoProxy.getBaseInfo,
    getComputedProxyInfo: store.UserInfoProxy.proxyInfo,
    counts: store.Notification.counts,
    setCounts: store.Notification.setCounts,
}))
@observer
class Item extends React.Component {
    state = {
        momentInfo: {},
        showContent: {},
    };

    componentDidMount() {
        const { notificationInfo, getBaseUserInfo } = this.props;

        getBaseUserInfo(notificationInfo.uid);
        this.getMomentInfo();

        const { id, action } = notificationInfo;
        switch (action) {
            case MOMENT_COMMENT_TYPE:
            case COMMENT_REPLY_TYPE:
                getComments([id]).then(([res]) => {
                    this.setState({ showContent: res });
                });
                return;
            default:
                this.setState({ showContent: {} });
                return;
        }
    }

    getMomentInfo = async () => {
        const { notificationInfo } = this.props;
        const [momentInfo] = await loadMomentsInfoSyncRemote([notificationInfo.mid], {
            isLoadForwardDisplay: true,
            isCheckLink: false,
            filter: function (moment) {
                return moment.type !== 82;
            },
        });
        this.setState({ momentInfo });
        if (!momentInfo || !momentInfo.media) return;
        if (momentInfo.media && momentInfo.media.length) {
            momentInfo.media.forEach(mediaDownloadProxy.addDownloadList);
        }
    };

    gotoMomentHomePage = () => {
        const { notificationInfo, history } = this.props;
        const { uid } = notificationInfo;
        history.push(`/user/moments/${uid}/moments`);
    };

    gotoComment = async () => {
        const { notificationInfo, history } = this.props;
        const { mid, action, id } = notificationInfo;
        const isMomentComment = action === MOMENT_COMMENT_TYPE;
        const isCommentReply = action === COMMENT_REPLY_TYPE;
        const isUpvote = action === MOMENT_UPVOTE_TYPE;
        let addParam = {};
        if (isMomentComment) {
            addParam = { ...addParam, id };
        }

        if (isCommentReply) {
            try {
                const pid = await getPid(id);
                pid && (addParam = addParam = { ...addParam, id, pid });
            } catch (e) {
                console.log(e);
            }
        }

        if (isUpvote) {
            addParam = { ...addParam, id, tab: "likes" };
        }
        // console.log(action, operated_id, addParam);
        this.onRead();
        history.push(`/moment/${mid}?${queryString.stringify(addParam)}`);
    };

    gotoMomentPage = () => {
        const { notificationInfo, history } = this.props;
        const { mid } = notificationInfo;
        this.onRead();
        history.push(`/moment/${mid}`);
    };

    onRead = () => {
        const { notificationInfo, counts, setCounts } = this.props;
        const { id, is_read } = notificationInfo;
        if (is_read) return;
        readNotification(id);
        setCounts(Math.max(0, counts - 1));
    };

    render() {
        const { notificationInfo, getComputedProxyInfo, intl } = this.props;
        const { momentInfo, showContent } = this.state;
        const { uid, mid, action, create_time } = notificationInfo;

        const user = getComputedProxyInfo(uid);
        const momentImg =
            momentInfo &&
            momentInfo.media &&
            momentInfo.media[0] &&
            mediaDownloadProxy.getProxyInfo(momentInfo.media[0]);
        return (
            <div className={cx.notification_wrapper}>
                <Badge dot={!notificationInfo.is_read}>
                    <Avatar src={user.avatarPath} size={24} onClick={this.gotoMomentHomePage} />
                </Badge>
                <div className={cx.notification_main} onClick={this.gotoComment}>
                    <div className={`${cx.notification_username} dark-theme-color_grey`}>
                        {/* {user.friendAlias || user.name} */}
                        {getNameWeight({
                            friendAlias: user.friendAlias,
                            alias: user.alias,
                            name: user.name,
                            uid: user.uid,
                            status: user.status,
                        })}
                    </div>
                    <div className={`${cx.notification_content} dark-theme-color_lighter`}>
                        {action === MOMENT_COMMENT_TYPE && (
                            <React.Fragment>
                                {intl.formatMessage({ id: "comment" })}:{" "}
                                {showContent && parse_text(showContent.text || "")}
                            </React.Fragment>
                        )}

                        {action === COMMENT_REPLY_TYPE && (
                            <React.Fragment>
                                {intl.formatMessage({ id: "reply" })}:{" "}
                                {showContent && parse_text(showContent.text || "")}
                            </React.Fragment>
                        )}
                        {(action === MOMENT_UPVOTE_TYPE || action === MOMENT_UPVOTE_TYPE) && (
                            <LikeRedIcon />
                        )}
                    </div>
                    <div className={`${cx.notification_createtime} dark-theme-color_grey`}>
                        <MomentFromNow timestamp={create_time} />
                    </div>
                </div>

                {momentInfo && (
                    <div className={cx.notification_momentimg} onClick={this.gotoMomentPage}>
                        {momentInfo.media && momentImg.mediaType === 1 && (
                            <img src={momentImg.localPath} />
                        )}
                        {momentInfo.media && momentImg.mediaType === 2 && (
                            <div className={cx.notification_videocontainer}>
                                <div className={cx.notification_video}>
                                    <VideoStart />
                                </div>

                                <video src={momentImg.localPath} />
                            </div>
                        )}
                        {!momentInfo.media && (
                            <div className={cx.notification_momenttext}>
                                {parse_text(momentInfo.text || "")}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
