import React from "react";
import { injectIntl } from "react-intl";
import { LeftOutlined } from "@ant-design/icons";
import classnames from "classnames";

import TmmTabs from "components/TmmTabs";
import Comments from "./Comments";
import Likes from "./Likes";
import MemberInfo from "./UserInfo";

import styles from "./index.less";
import Editor from "./InlineEditor";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import FeedDetails from "@newSdk/model/moments/FeedDetails";

import { getCommentTotalCount } from "@newSdk/logic/comments/comments";
import mediaDownloadProxy from "../Moments/store/mediaDownloadProxy";
import userInfoProxy from "../../stores_new/userInfoProxy";
import { formatNumber } from "utils/number_helper";
import loadMomentsInfoSyncRemote from "@newSdk/logic/moments/_loadMomentsInfoSyncRemote";
import { fetchAndPut } from "@newSdk/logic/moments/fecthAndPut";
import Header from "../Header";
import MomentsDetail from "./MomentsDetail";
import queryString from "query-string";
import { fetchMomentLikes } from "@newSdk/logic/moments/momentLikes";
import fetchMoments from "@newSdk/logic/moments/fetchMoments";
import { message, Spin } from "antd";

@inject((store) => ({
    commentsCount: store.Comments.commentsCount,
    updateCommentsCount: store.Comments.updateCommentsCount,
    onReplyMoment: store.Comments.onReplyMoment,
    onUpdateComments: store.Comments.onUpdateComments,
    onInitComments: store.Comments.onInitComments,
    comments: store.Comments.comments,
    commentReplies: store.Comments.commentReplies,
    likes: store.Comments.likes,
    onUpdateLikes: store.Comments.onUpdateLikes,
    momentLikes: store.MomentLikes.likes,
    getHotComment: store.HotCommentProxy.getHotComment,
    shouldUseDarkColors: store.Common.shouldUseDarkColors,
}))
@observer
class MomentDetail extends React.Component {
    state = {
        categories: [
            {
                key: "likes",
                label: "likes",
                isSelected: false,
            },
            {
                key: "comments",
                label: "comments",
                isSelected: true,
            },
            // { key: "reposts", label: "reposts", isSelected: false },
        ],
        userInfo: {},
        momentInfo: undefined,
        momentUserInfo: {},
        forwardInfo: {},
        repostsCount: 0,
        total: 0,
        loading: false,
    };

    onChange = (key) => {
        const { categories } = this.state;
        this.setState({
            categories: Array.from(categories, (item) => {
                if (item.key === key) return { ...item, isSelected: true };
                return { ...item, isSelected: false };
            }),
        });
    };
    componentDidMount() {
        const {
            match: { params = {} },
            history,
        } = this.props;
        this.getMomentInfo(params.id);
        this.onGetTotal();

        fetchMomentLikes([params.id]);

        const state = queryString.parse(history.location.search);
        if (state.tab) this.onChange(state.tab);
    }

    onGetTotal = async () => {
        const {
            match: {
                params: { id: momentID },
            },
            updateCommentsCount,
        } = this.props;
        const total = await getCommentTotalCount(momentID);
        updateCommentsCount(total);
    };

    updatedForwardInfo = async (data, acc) => {
        const { refer_root, refer_pres, id } = data;
        this.setState({ forwardInfo: { forwardRoot: refer_root, ...this.state.forwardInfo } });
        const isContinue = data && FeedDetails.isForwardMoments(data) && id !== refer_root;

        if (!isContinue) {
            this.setState({
                forwardInfo: { ...this.state.forwardInfo, breakOff: true },
            });
            return acc;
        }
        for (const item of refer_pres) {
            let index = refer_pres.indexOf(item);
            const [data] = await fetchAndPut(item);
            if (!data) {
                this.setState({
                    forwardInfo: { ...this.state.forwardInfo, breakOff: true },
                });
                FeedDetails.updateMomentsDelStatues([item]);
                return acc;
            }
            acc.push(data);
            if (index === refer_pres.length - 1) {
                return await this.updatedForwardInfo(data, acc);
            }
        }
    };

    // reply moment
    onSend = async (val) => {
        const { momentInfo } = this.state;
        const { intl } = this.props;
        try {
            await this.props.onReplyMoment({
                mid: momentInfo.id,
                pid: momentInfo.id,
                reply_id: momentInfo.id,
                reply_uid: momentInfo.uid,
                text: val,
            });
            message.success(intl.formatMessage({ id: "publishcomment" }));
        } catch (e) {
            if (Number(e.code) === 100006) {
                message.error(this.props.intl.formatMessage({ id: "comment_failed_delete" }));
                return;
            }
            message.error(intl.formatMessage({ id: "comment_failed" }));
        }
    };

    getForwardRef = async (id) => {
        try {
            const [forwardInfo] = await loadMomentsInfoSyncRemote([id], {
                isLoadForwardDisplay: true,
                isCheckLink: false,
            });
            this.setState({ forwardInfo });
            if (forwardInfo.forwardRoot.media && forwardInfo.forwardRoot.media.length) {
                forwardInfo.forwardRoot.media.forEach(mediaDownloadProxy.addDownloadList);
            }
        } catch (e) {
            // TODO add exception handler
        }
    };

    getMomentInfo = async (id) => {
        try {
            this.setState({ loading: true });
            const [momentInfo] = await fetchMoments([id]);
            if (momentInfo.media && momentInfo.media.length) {
                momentInfo.media.forEach(mediaDownloadProxy.addDownloadList);
            }
            const momentUserInfo = await userInfoProxy.getBaseInfo(momentInfo.uid);
            console.log(momentInfo);
            this.setState({ momentInfo, momentUserInfo });
        } catch (e) {
            // console.log(e);
        } finally {
            this.setState({ loading: false });
        }
    };

    renderBody = () => {
        const { categories, momentInfo, momentUserInfo, loading } = this.state;
        const { getHotComment, intl, commentsCount, momentLikes, shouldUseDarkColors } = this.props;

        if (!momentInfo) return null;
        if (loading) {
            // console.log("loading...");
            return (
                <div className={styles.moment_main_loading}>
                    <Spin />
                </div>
            );
        }

        const showCategory = categories.find((item) => item.isSelected);
        const categoryUpdateLabel = categories.map((item) => {
            if (item.key === "comments")
                return {
                    ...item,
                    label: `${intl.formatMessage({ id: "comment" })}${
                        commentsCount > 0 ? ` ${formatNumber(commentsCount)}` : ""
                    }`,
                };

            if (item.key === "likes") {
                return {
                    ...item,
                    label: `${intl.formatMessage({ id: "like" })}${
                        momentLikes[momentInfo.id] && momentLikes[momentInfo.id].length > 0
                            ? ` ${formatNumber(momentLikes[momentInfo.id].length)}`
                            : ""
                    }`,
                };
            }
            return {
                ...item,
                label: `reposts${this.state.repostsCount ? this.state.repostsCount : ""}`,
            };
        });

        return (
            <div className={styles.moment_main}>
                <div className={`${styles.moment_main_left} dark-theme-bg_lighter`}>
                    {momentInfo.status ? (
                        <React.Fragment>
                            <div className={`${styles.block} dark-theme-bg_lighter`}>
                                <div className={styles.moment_content}>
                                    <MomentsDetail
                                        momentInfo={{
                                            ...momentInfo,
                                            id: momentInfo.id,
                                            uid: momentInfo.uid,
                                            authType: momentInfo.authType,
                                            sendTime: momentInfo.createTime,
                                            sourceList: momentInfo.media,
                                            textContext: momentInfo.text,
                                        }}
                                    />
                                    <Editor
                                        placeholder={intl.formatMessage({ id: "saySomething" })}
                                        send={this.onSend}
                                        shouldUseDarkColors={shouldUseDarkColors}
                                    />
                                </div>
                            </div>

                            <div className={`${styles.block} dark-theme-bg_lighter`}>
                                <div className={styles.moment_content_categories}>
                                    <TmmTabs
                                        configs={categoryUpdateLabel}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className={styles.moment_content_main}>
                                    {showCategory && showCategory.key === "comments" && (
                                        <Comments
                                            comments={this.props.comments}
                                            likes={this.props.likes}
                                            onUpdateLikes={this.props.onUpdateLikes}
                                            momentID={this.props.match.params.id}
                                            getHotComment={getHotComment}
                                            commentReplies={this.props.commentReplies}
                                            onInitComments={this.props.onInitComments}
                                            onUpdateComments={this.props.onUpdateComments}
                                            onGetTotal={this.onGetTotal}
                                        />
                                    )}

                                    {showCategory && showCategory.key === "likes" && (
                                        <Likes momentID={this.props.match.params.id} />
                                    )}
                                </div>
                            </div>
                        </React.Fragment>
                    ) : (
                        <div
                            style={{
                                height: 500,
                                lineHeight: "500px",
                                textAlign: "center",
                            }}
                        >
                            {intl.formatMessage({ id: "moment_deleted" })}
                        </div>
                    )}
                </div>
                <div className={styles.moment_main_right}>
                    <MemberInfo userInfo={momentUserInfo} />
                </div>
            </div>
        );
    };

    render() {
        const { intl } = this.props;

        return (
            <div className={classnames([styles.moment_wrapper, "dark-theme-bg_deep"])}>
                <div
                    className={classnames(
                        "electron_drag-able",
                        styles.moment_header,
                        "dark-theme-bg_normal"
                    )}
                >
                    <span onClick={this.props.history.goBack}>
                        <LeftOutlined className="dark-theme-color_lighter" />
                    </span>
                    <span className={`${styles.moment_headerlabel} dark-theme-color_lighter`}>
                        {intl.formatMessage({ id: "moments" })}
                    </span>
                    <span />
                </div>
                <div className={styles.moment_mainwrapper}>{this.renderBody()}</div>
            </div>
        );
    }
}

export default withRouter(injectIntl(MomentDetail));
