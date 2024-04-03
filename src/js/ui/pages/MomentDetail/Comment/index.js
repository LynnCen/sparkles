import React from "react";
import { Button, message, Modal } from "antd";
import { injectIntl } from "react-intl";
import { inject, observer } from "mobx-react";
import Reply from "../ReplyItem";
import MainContent from "./mainContent";
import CommentFooter from "./commentFooter";
import { CloseIconBolder } from "../../../icons";
import ModalReplyItem from "../ModalReplyItem";
import styles from "./index.less";
import ModalOfEditor from "../ModalOfEditor";
import queryString from "query-string";
import { getReplyList, getIndexOfId } from "@newSdk/logic/comments/comments";
import { head, delay } from "lodash";
import ThemeModal from "components/Tmm_Ant/ThemeModal";

@inject((store) => ({
    onUpdateCommentLikes: store.Comments.onUpdateCommentLikes,
    getBaseUserInfo: store.UserInfoProxy.getBaseInfo,
    getComputedProxyInfo: store.UserInfoProxy.proxyInfo,
    onReplyMoment: store.Comments.onReplyComment,
    commentReplies: store.Comments.commentReplies,
    onUpdateLikes: store.Comments.onUpdateLikes,
    onUpdateComments: store.Comments.onUpdateComments,
    topCommentsReplies: store.Comments.topCommentsReplies,
    shouldUseDarkColors: store.Common.shouldUseDarkColors,
}))
@observer
class Comment extends React.Component {
    state = {
        showList: false,
        showEditor: false,
        replyList: [],
        total: 0,
        currentPage: 1,
        pageSize: 20,
        loading: false,
        ref: React.createRef(),
    };

    toggleEditor = () => this.setState({ showEditor: !this.state.showEditor });
    toggleList = () => {
        const {
            comment: { id },
        } = this.props;
        this.setState({ showList: !this.state.showList }, async () => {
            const { currentPage, showList, pageSize } = this.state;
            if (showList) {
                const { data, total } = await getReplyList(id, currentPage, pageSize);
                this.setState({ replyList: data, total, currentPage: currentPage + 1 });
            } else {
                this.setState({ replyList: [], total: 0, currentPage: 1 });
            }
        });
    };

    onGetReply = async () => {
        const {
            comment: { id },
        } = this.props;
        const { currentPage, replyList, pageSize, loading } = this.state;
        if (loading) return;
        try {
            this.setState({ loading: true });
            const { data } = await getReplyList(id, currentPage, pageSize);
            this.setState({ replyList: replyList.concat(data), currentPage: currentPage + 1 });
        } catch (e) {
            //
        } finally {
            this.setState({ loading: false });
        }
    };

    onSend = async (val) => {
        const { comment, onReplyMoment, intl } = this.props;
        const { mid, id, uid } = comment;
        try {
            const reply = await onReplyMoment({
                mid,
                pid: id,
                reply_id: id,
                reply_uid: uid,
                text: val,
            });
            this.toggleEditor();
            reply && this.onReply(reply);
            message.success(intl.formatMessage({ id: "publishcomment" }));
        } catch (e) {
            if (Number(e.code) === 100006) {
                message.error(intl.formatMessage({ id: "comment_failed_delete" }));
                return;
            }
            message.error(intl.formatMessage({ id: "comment_failed" }));
        }
    };

    onReply = (reply) => {
        const { replyList } = this.state;
        this.setState({ replyList: [reply, ...replyList] });
    };

    onGetNeedComments = async () => {
        const params = queryString.parse(window.location.hash);
        const { pid, id } = params;
        let levelOne = await getIndexOfId(pid, id);
        const page = levelOne < 1 ? 1 : Math.ceil(levelOne / this.state.pageSize);
        const pageSize = page * this.state.pageSize;
        const { data } = await getReplyList(pid, 1, pageSize);
        this.setState({ replyList: data, currentPage: page + 1 });
    };

    componentDidMount() {
        const { comment, getBaseUserInfo } = this.props;
        const { uid, reply_uid } = comment;
        [uid, reply_uid].map((item) => getBaseUserInfo(item));
        this.init();
    }

    componentWillUnmount() {
        Modal.destroyAll();
    }

    init = async () => {
        const { comment, isTopComment } = this.props;
        const { ref } = this.state;
        const { id: commentId } = comment;
        const queryArr = window.location.hash.split("?");
        if (!queryArr || queryArr.length < 2) return;
        const params = queryString.parse(queryArr[1]);
        const { id, pid } = params;
        if (pid && pid === commentId) {
            this.onGetNeedComments().then(() => {
                if (isTopComment) return;
                setTimeout(() => ref.current.scrollIntoViewIfNeeded(), 0);
                this.setState({ showList: true });
            });
            return;
        }
        if (id && id === commentId) {
            if (isTopComment) return;
            setTimeout(() => ref.current.scrollIntoViewIfNeeded(), 0);
            delay(() => {
                const { location } = window;
                const updatedUrl = `file://${location.pathname}${location.search}${queryArr[0]}`;
                history.replaceState({}, "", updatedUrl);
            }, 100);
        }
    };

    render() {
        const {
            comment,
            commentReplies,
            intl,
            topCommentsReplies,
            isTopComment,
            shouldUseDarkColors,
        } = this.props;
        const { showList, showEditor, replyList, loading, ref } = this.state;
        const replies = isTopComment ? topCommentsReplies : commentReplies;
        const { uid, text, id } = comment;
        const user = this.props.getComputedProxyInfo(uid);
        const { data = [], total = 0 } = head(replies[id] || []) || {};
        const hasMore = replyList.length < total;
        return (
            <div className={styles.comment_itemContainer} ref={ref}>
                <MainContent textContent={text} user={user} toggleList={this.toggleList}>
                    <CommentFooter replyDetail={comment} toggleEditor={this.toggleEditor} />
                    {showEditor && (
                        <ModalOfEditor
                            name={user.name}
                            onSend={this.onSend}
                            toggleEditor={this.toggleEditor}
                            shouldUseDarkColors={shouldUseDarkColors}
                        />
                    )}
                    {!!total && (
                        <div className={`${styles.comment_replycontainer} dark-theme-bg_normal`}>
                            {(data || []).slice(0, 2).map((item) => {
                                return (
                                    <Reply
                                        key={isTopComment ? `${item.id}-pop` : item.id}
                                        reply={item}
                                    />
                                );
                            })}
                            {total && (
                                <span className={styles.comment_intotal} onClick={this.toggleList}>
                                    {intl.formatMessage(
                                        { id: "comment_summary" },
                                        { counts: total }
                                    )}{" "}
                                    &gt;
                                </span>
                            )}
                        </div>
                    )}

                    {showList && (
                        <ThemeModal
                            wrapClassName={styles.comment_custom_modal}
                            visible
                            centered
                            width={600}
                            footer={null}
                            closable={false}
                        >
                            <div className={styles.comment_modal_wrapper}>
                                <div
                                    className={`${styles.comment_label} dark-theme-border_normal dark-theme-color_lighter`}
                                >{`${total} ${intl.formatMessage({ id: "reply" })}`}</div>
                                <div
                                    className={styles.comment_modal_close}
                                    onClick={this.toggleList}
                                >
                                    <CloseIconBolder overlayClass="dark-theme-color_lighter" />
                                </div>
                                <div className={styles.comment_modal_replies}>
                                    <MainContent textContent={text} user={user} isCompact>
                                        <CommentFooter
                                            replyDetail={comment}
                                            toggleEditor={this.toggleEditor}
                                        />
                                        {replyList &&
                                            replyList.map((item) => {
                                                return (
                                                    <ModalReplyItem
                                                        key={item.id}
                                                        reply={item}
                                                        onReply={this.onReply}
                                                    />
                                                );
                                            })}
                                        {hasMore && (
                                            <Button
                                                type={"link"}
                                                block
                                                onClick={this.onGetReply}
                                                loading={loading}
                                            >
                                                {intl.formatMessage({ id: "see_more" })}
                                            </Button>
                                        )}
                                    </MainContent>
                                </div>
                            </div>
                        </ThemeModal>
                    )}
                </MainContent>
            </div>
        );
    }
}

export default injectIntl(Comment);
