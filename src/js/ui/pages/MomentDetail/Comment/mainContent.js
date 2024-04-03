import React from "react";
import { injectIntl } from "react-intl";
import classnames from "classnames";
import UserInfo from "components/UserInfo";
import { parse_text } from "../../Home/NewChat/components/MessageInput/image_of_emoji/emoji_helper";
import { getNameWeight } from "utils/nameWeight";
import styles from "./index.less";

const contentRef = React.createRef();

class MainContent extends React.Component {
    state = {
        showMore: false,
    };

    componentDidMount() {
        if (!contentRef.current) return;
        const { clientHeight, scrollHeight } = contentRef.current;
        if (clientHeight < scrollHeight) {
            this.setState({ showMore: true });
        }
    }

    render() {
        const {
            children,
            user,
            textContent,
            replyUser = false,
            isCompact = false,
            toggleList,
            intl,
        } = this.props;
        const { showMore } = this.state;
        const userName = getNameWeight({
            friendAlias: user.friendAlias,
            alias: user.alias,
            name: user.name,
            uid: user.uid,
            status: user.status,
        });
        const replyName =
            replyUser &&
            getNameWeight({
                friendAlias: replyUser.friendAlias,
                alias: replyUser.alias,
                name: replyUser.name,
                uid: replyUser.uid,
                status: replyUser.status,
            });
        return (
            <div
                className={classnames(styles.comment_itemwrapper, { [styles.compact]: isCompact })}
            >
                <div className={styles.comment_avatar}>
                    <UserInfo userInfo={user} size={32} />
                </div>
                <div className={styles.comment_mainwrapper}>
                    <div className={styles.name_container}>
                        <div className={`${styles.comment_username} dark-theme-color_grey`}>
                            {userName}
                        </div>
                    </div>
                    <div className={styles.comment_maincontent}>
                        {replyUser && (
                            <span className={styles.comment_replyUser}>@{replyName} </span>
                        )}
                        <pre ref={contentRef} className=" dark-theme-color_lighter">
                            {parse_text(textContent, "emoji-24")}
                        </pre>
                        {showMore && !isCompact && (
                            <div
                                className={`${styles.comment_showmore} dark-theme-bg_lighter dark-theme-color_grey`}
                                onClick={toggleList}
                            >
                                ...
                                <span className={styles.comment_showmore_label}>
                                    {" "}
                                    {intl.formatMessage({ id: "see_more" })}
                                </span>
                            </div>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        );
    }
}

export default injectIntl(MainContent);
