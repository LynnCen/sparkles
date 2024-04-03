import React from "react";
import { inject, observer } from "mobx-react";

import styles from "./index.less";
import { parse_text } from "../../Home/NewChat/components/MessageInput/image_of_emoji/emoji_helper";
import { getNameWeight } from "utils/nameWeight";
@inject((store) => ({
    onUpdateCommentLikes: store.Comments.onUpdateCommentLikes,
    getBaseUserInfo: store.UserInfoProxy.getBaseInfo,
    getComputedProxyInfo: store.UserInfoProxy.proxyInfo,
    onReplyMoment: store.Comments.onReplyMoment,
}))
@observer
class Reply extends React.Component {
    modules = {
        toolbar: null,
    };

    componentDidMount() {
        const { uid, reply_uid, reply_id } = this.props.reply;
        this.props.getBaseUserInfo(uid);
        reply_id && this.props.getBaseUserInfo(reply_uid);
    }

    render() {
        const { text, uid, reply_uid, reply_id } = this.props.reply;

        const user = this.props.getComputedProxyInfo(uid);
        const userReply = reply_id && this.props.getComputedProxyInfo(reply_uid);
        const userName = getNameWeight({
            friendAlias: user.friendAlias,
            alias: user.alias,
            name: user.name,
            uid: user.uid,
            status: user.status,
        });
        const replyName =
            userReply &&
            getNameWeight({
                friendAlias: userReply.friendAlias,
                alias: userReply.alias,
                name: userReply.name,
                uid: userReply.uid,
                status: userReply.status,
            });
        return (
            <div className={styles.reply_itemwrapper}>
                <div>
                    <span className={styles.reply_content}>
                        <span className={styles.reply_username}>{`${userName}: `}</span>
                        {userReply && (
                            <span className={styles.reply_replyusername}>@{replyName} </span>
                        )}
                        <span className="dark-theme-color_grey">{parse_text(text)}</span>
                    </span>
                </div>
            </div>
        );
    }
}

export default Reply;
