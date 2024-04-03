import React from "react";
import { Button } from "antd";
import { injectIntl } from "react-intl";
import Comment from "./Comment";
import {
    addLikesObserver,
    removeLikesObserver,
    getLikesRepo,
} from "@newSdk/logic/comments/commentLikes";
import Empty from "./Empty";
import hotCommentProxy from "../Moments/store/hotCommentProxy";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import {
    getCommentList as getCommentsFromRepo,
    updateCommentIds,
    addCommentsObserver,
    removeCommentsObserver,
    getIndexOfId,
} from "@newSdk/logic/comments/comments";

import styles from "./index.less";
import TopComments from "./TopComments";

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentPage: 1, pageSize: 20, momentLevelSum: 0, loading: false };
        this.moreButtonRef = React.createRef();
    }

    componentDidMount() {
        const { momentID } = this.props;
        hotCommentProxy.getCommentMap([momentID]);
        this.loadCommentWhenInit();
        updateCommentIds(momentID);
        this.getUpvoteData();
        addLikesObserver(this.getUpvoteData);
        addCommentsObserver(this.onCommentsUpdate);
    }

    componentWillUnmount() {
        removeLikesObserver(this.getUpvoteData);
        removeCommentsObserver(this.onCommentsUpdate);
    }

    onCommentsUpdate = (momentId) => {
        if (this.props.momentID === momentId) {
            this.loadCommentWhenInit();
            this.props.onGetTotal();
        }
    };

    loadCommentWhenInit = async () => {
        const { momentID, history, onInitComments } = this.props;
        const params = queryString.parse(history.location.search);
        const { pid, id } = params;
        // console.log(momentID, pid, id);
        let page = 1;
        try {
            if (pid && id) {
                let levelOne = await getIndexOfId(momentID, pid);
                page = levelOne < 1 ? 1 : Math.ceil(levelOne / this.state.pageSize);
            }
            if (!pid && id) {
                let levelOne = await getIndexOfId(momentID, id);
                page = levelOne < 1 ? 1 : Math.ceil(levelOne / this.state.pageSize);
            }
            const pageSize = page * this.state.pageSize;
            const { data, total } = await getCommentsFromRepo(momentID, 1, pageSize);
            onInitComments(data);
            this.setState({ momentLevelSum: total, currentPage: page });
        } catch (e) {
            console.log(e);
        }
    };

    onGetComments = async () => {
        const { momentID } = this.props;
        const { currentPage } = this.state;
        const { data, total } = await getCommentsFromRepo(momentID, currentPage);
        return { data, total };
    };

    loadMore = () => {
        const { currentPage, loading } = this.state;
        if (loading) return;
        const { onUpdateComments } = this.props;
        this.setState({ currentPage: currentPage + 1, loading: true }, async () => {
            try {
                const { data } = await this.onGetComments();
                onUpdateComments(data);
            } catch (e) {
                console.error(e);
                // TODO add
            } finally {
                this.setState({ loading: false });
            }
        });
    };

    getUpvoteData = async () => {
        const { momentID, onUpdateLikes } = this.props;
        const data = await getLikesRepo(momentID);
        onUpdateLikes(data);
    };

    render() {
        const { comments = [], getHotComment, momentID, intl } = this.props;
        const { momentLevelSum, loading } = this.state;
        // console.log(this.moreButtonRef);
        if (!comments.length)
            return <Empty content={intl.formatMessage({ id: "comment_empty" })} />;
        return (
            <div className={styles.comment_container}>
                <TopComments momentID={momentID} />
                <div className={`${styles.comment_label} dark-theme-color_lighter`}>
                    {intl.formatMessage({ id: "allComments" })}
                </div>
                {comments.map((item) => (
                    <div key={item.id} className={styles.comment_itemwrapper}>
                        <Comment key={item.id} comment={item} />
                    </div>
                ))}
                {comments.length < momentLevelSum && (
                    <Button
                        ref={this.moreButtonRef}
                        type={"link"}
                        block
                        onClick={this.loadMore}
                        loading={loading}
                    >
                        {intl.formatMessage({ id: "see_more" })}
                    </Button>
                )}
                {comments.length === momentLevelSum && momentLevelSum > 5 && (
                    <Button type={"link"} block>
                        {intl.formatMessage({ id: "comment_nomore" })}
                    </Button>
                )}
            </div>
        );
    }
}

export default withRouter(injectIntl(Comments));
