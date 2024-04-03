import React from "react";
import { injectIntl } from "react-intl";
import { LikeHeartIcon, LikeRedIcon } from "../../../icons";
import { inject, observer } from "mobx-react";
import moment from "moment";
import MomentFromNow from "components/MomentFromNow";
import styles from "./index.less";
import {
    sendUpvoteComment,
    sendCancelUpvoteComment,
} from "@newSdk/service/api/comments/sendUpvote";
import { formatNumber } from "utils/number_helper";
import UserInfo from "@newSdk/model/UserInfo";
import { find, curry } from "lodash";
import classnames from "classnames";
import { debounce } from "lodash";
import { message } from "antd";

function isUpVote(arr) {
    return find(arr, ({ uid }) => uid === UserInfo._id);
}

@inject((store) => ({
    onUpdateCommentLikes: store.Comments.onUpdateCommentLikes,
    onReplyComment: store.Comments.onReplyComment,
    likes: store.Comments.likes,
    locale: store.settings.locale,
    onUpdateLikes: store.Comments.onUpdateLikes,
    onAddLikes: store.Comments.onAddLikes,
    onDelLikes: store.Comments.onDelLikes,
}))
@observer
class CommentFooter extends React.Component {
    state = {
        isUpvote: false,
        upvoteNum: 0,
        loading: false,
    };

    onSendUpvote = debounce(async () => {
        const { loading } = this.state;
        if (loading) return;
        const { replyDetail, likes, onDelLikes, intl } = this.props;
        const isUpvote = likes[replyDetail.id] && isUpVote(likes[replyDetail.id]);
        const params = {
            id: replyDetail.id,
            mid: replyDetail.mid,
            pid: replyDetail.pid,
        };
        this.setState({ loading: true });

        try {
            if (isUpvote) {
                onDelLikes(replyDetail.id);
                await sendCancelUpvoteComment(params);
            } else {
                this.onAddLike(replyDetail.id)({ ...params, uid: UserInfo._id });
                await sendUpvoteComment(params);
            }
        } catch (e) {
            if (Number(e.code) === 100006) message.error(intl.formatMessage({ id: "like_failed" }));
            if (!isUpvote) {
                onDelLikes(replyDetail.id);
            } else {
                this.onAddLike(replyDetail.id)({ ...params, uid: UserInfo._id });
            }
        } finally {
            this.setState({ loading: false });
        }
    }, 500);

    onAdd = (id, data) => {
        const { onAddLikes } = this.props;
        return onAddLikes(id, data);
    };

    onAddLike = curry(this.onAdd);

    render() {
        const { replyDetail, locale, likes, intl } = this.props;
        const isUpvote = likes[replyDetail.id] && isUpVote(likes[replyDetail.id]);
        moment.locale(locale);
        return (
            <div className={styles.comment_maindisc}>
                <div className={styles.comment_timedisplay}>
                    <MomentFromNow
                        className="dark-theme-color_grey"
                        timestamp={replyDetail.create_time}
                    />
                </div>
                <React.Fragment>
                    <div
                        className={`${styles.comment_replyaction} dark-theme-color_grey`}
                        onClick={this.props.toggleEditor}
                    >
                        {intl.formatMessage({ id: "reply" })}
                    </div>
                    <div className={styles.comment_likecount} onClick={this.onSendUpvote}>
                        {isUpvote ? (
                            <LikeRedIcon bodyStyle={{ width: 12 }} />
                        ) : (
                            <LikeHeartIcon bodyStyle={{ width: 12 }} />
                        )}
                        <span
                            className={classnames({
                                [styles.comment_likeUpvote]: isUpvote,
                            })}
                        >
                            {likes[replyDetail.id] &&
                                !!likes[replyDetail.id].length &&
                                formatNumber(likes[replyDetail.id].length)}
                        </span>
                    </div>
                </React.Fragment>
            </div>
        );
    }
}

export default injectIntl(CommentFooter);
