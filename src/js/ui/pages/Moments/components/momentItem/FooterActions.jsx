/**
 * @Author Pull
 * @Date 2021-11-02 19:20
 * @project FooterActions
 */
import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { CommentIcon, ForwardIcon, LikeHeartIcon, LikeRedIcon } from "../../../../icons";
import { formatNumber } from "utils/number_helper";
import { find } from "lodash";
import UserInfo from "@newSdk/model/UserInfo";
import { inject } from "mobx-react";
import classNames from "classnames/bind";
import styles from "./moments.module.less";
import { sendCancelUpvote, sendUpvote } from "@newSdk/service/api/moments/sendUpvote";
import { message } from "antd";
import ForwardItem from "../forwardMoments/ForwardItem";

const cx = classNames.bind(styles);

@inject(({ CommentCountProxy, UserInfoProxy, MomentLikes, ForwardCountProxy }) => ({
    likes: MomentLikes.likes,
    proxyUserInfo: UserInfoProxy.proxyInfo,
    onAddLikes: MomentLikes.onAddLikes,
    onDelLikes: MomentLikes.onDelLikes,
    getForwardCount: ForwardCountProxy.getCount,
    getCommentCount: CommentCountProxy.getCount,
}))
export class FooterActions extends Component {
    state = {
        loading: false,
    };
    onSendUpvote = async (event) => {
        event.stopPropagation();
        const { loading } = this.state;
        if (loading) return;
        const { likes, onAddLikes, onDelLikes, id, intl } = this.props;
        const isUpvote = likes[id] && find(likes[id], ({ uid }) => uid === UserInfo._id);
        const params = {
            id,
            mid: id,
            uid: UserInfo._id,
            create_time: Date.now(),
        };

        try {
            this.setState({ loading: true });
            if (isUpvote) {
                onDelLikes(id);
                await sendCancelUpvote({ id });
            } else {
                onAddLikes(id, params);
                await sendUpvote({ id });
            }
        } catch (e) {
            console.log(e);
            if (Number(e.code) === 100006) message.error(intl.formatMessage({ id: "like_failed" }));

            if (isUpvote) {
                onAddLikes(id, params);
            } else {
                onDelLikes(id);
            }
        } finally {
            this.setState({ loading: false });
        }
    };
    stopPropagation = (e) => e.stopPropagation();
    render() {
        const {
            id,
            showCount = true,
            textContext,
            forward,
            getForwardCount,
            getCommentCount,
            likes,
            media,
            proxyUserInfo,
            uid,
            intl,
        } = this.props;
        const userInfo = proxyUserInfo(uid) || {};
        const upvoteNum = likes[id] && likes[id].length;
        const isUpvote = likes[id] && find(likes[id], ({ uid }) => uid === UserInfo._id);
        const forwardCount = getForwardCount(id);
        const commentCount = getCommentCount(id);

        return (
            <Fragment>
                <span
                    className={cx("tag")}
                    onClick={this.onSendUpvote}
                    onMouseDown={this.stopPropagation}
                >
                    {isUpvote ? (
                        <LikeRedIcon />
                    ) : (
                        <LikeHeartIcon overlayClassName="dark-theme-color_lighter" />
                    )}
                    {showCount && !!upvoteNum && (
                        <span className={cx("dark-theme-color_lighter", { isUpvote: isUpvote })}>
                            {formatNumber(upvoteNum)}
                        </span>
                    )}
                </span>
                <span className={cx("tag")}>
                    <CommentIcon overlayClassName="dark-theme-color_lighter" />{" "}
                    {showCount && <span className="dark-theme-color_lighter">{commentCount}</span>}
                </span>
                {/*<span>{showCount && forwardCount}</span>*/}
                <span
                    className="cr-p"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        message.warn(intl.formatMessage({ id: "comingSoon" }));
                    }}
                >
                    <ForwardIcon overlayClassName="dark-theme-color_lighter" />
                    {/*{forward && <span className="dark-theme-color_lighter">{forward}</span>}*/}
                </span>
            </Fragment>
        );
    }
}

export default injectIntl(FooterActions);
