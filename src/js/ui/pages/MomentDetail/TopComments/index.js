import React from "react";
import { injectIntl } from "react-intl";
import { inject, observer } from "mobx-react";
import styles from "../index.less";
import Comment from "../Comment";
import {
    getCommentListBy,
    addCommentsObserver,
    removeCommentsObserver,
} from "@newSdk/logic/comments/comments";
import { getHotIds } from "@newSdk/logic/moments/getHotCommentsByMoment";
import { orderBy } from "lodash";

@inject((store) => ({
    topComments: store.Comments.topComments,
    onInitTopComments: store.Comments.onInitTopComments,
}))
@observer
class TopComments extends React.Component {
    componentDidMount() {
        this.getHotComment();
        addCommentsObserver(this.getHotComment);
    }

    componentWillUnmount() {
        removeCommentsObserver(this.getHotComment);
    }

    getHotComment = async () => {
        const { momentID, onInitTopComments } = this.props;
        const topComments = await getHotIds(momentID);
        const topCommentIds = topComments.map((comment) => comment.id);
        getCommentListBy(topCommentIds).then(({ data }) => {
            const sortedArr = topComments.map((item, index) => ({ ...item, sort: index }));
            const commentLevel = data.commentLevel;
            data.commentLevel = orderBy(commentLevel, function (item) {
                const sortedItem = sortedArr.find((comment) => comment.id === item.id);
                return sortedItem && sortedItem.sort;
            });
            onInitTopComments(data);
        });
    };

    render() {
        const { topComments, intl } = this.props;
        // console.log(topComments);
        return (
            <React.Fragment>
                {!!topComments.length && (
                    <React.Fragment>
                        <div className={`${styles.comment_label} dark-theme-color_lighter`}>
                            {intl.formatMessage({ id: "topComments" })}
                        </div>
                        {topComments.map((item, index) => (
                            <div key={index} className={styles.comment_itemwrapper}>
                                <Comment key={index} comment={item} isTopComment />
                            </div>
                        ))}
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

export default injectIntl(TopComments);
