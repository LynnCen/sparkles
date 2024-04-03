import React from "react";
import { inject, observer } from "mobx-react";
import MainContent from "../Comment/mainContent";
import CommentFooter from "../Comment/commentFooter";
import ModalOfEditor from "../ModalOfEditor";
import queryString from "query-string";
import { delay } from "lodash";

@inject((store) => ({
    onUpdateCommentLikes: store.Comments.onUpdateCommentLikes,
    getBaseUserInfo: store.UserInfoProxy.getBaseInfo,
    getComputedProxyInfo: store.UserInfoProxy.proxyInfo,
    onReplyMoment: store.Comments.onReplyComment,
    shouldUseDarkColors: store.Common.shouldUseDarkColors,
}))
@observer
class ModalReplyItem extends React.Component {
    state = {
        showEditor: false,
        ref: React.createRef(),
    };

    componentDidMount() {
        const { uid, reply_id, reply_uid, id: commentId } = this.props.reply;
        const { getBaseUserInfo } = this.props;
        getBaseUserInfo(uid);
        reply_id && getBaseUserInfo(reply_uid);
        const queryArr = window.location.hash.split("?");
        if (!queryArr || queryArr.length < 2) return;
        const params = queryString.parse(queryArr[1]);
        const { id } = params;
        if (id && id === commentId) {
            const { ref } = this.state;
            delay(() => {
                ref.current.scrollIntoViewIfNeeded();
            }, 0);
            delay(() => {
                const { location } = window;
                const updatedUrl = `file://${location.pathname}${location.search}${queryArr[0]}`;
                history.replaceState({}, "", updatedUrl);
            }, 100);
        }
    }

    toggleEditor = () => this.setState({ showEditor: !this.state.showEditor });

    onSend = async (val) => {
        const { reply, onReplyMoment, onReply } = this.props;
        const { mid, id, uid, pid } = reply;
        try {
            const replyItem = await onReplyMoment({
                mid,
                pid: pid,
                reply_id: id,
                reply_uid: uid,
                text: val,
            });
            this.toggleEditor();
            // console.log(replyItem);
            replyItem && onReply(replyItem);
        } catch (e) {
            //
        }
    };

    render() {
        const { shouldUseDarkColors, reply } = this.props;
        const { showEditor, ref } = this.state;
        const { uid, text, reply_id, reply_uid } = reply;
        const user = this.props.getComputedProxyInfo(uid);

        const replyUser = reply_id && this.props.getComputedProxyInfo(reply_uid);
        return (
            <div ref={ref}>
                <MainContent textContent={text} user={user} replyUser={replyUser}>
                    <CommentFooter replyDetail={reply} toggleEditor={this.toggleEditor} />
                    {showEditor && (
                        <ModalOfEditor
                            name={user.name}
                            onSend={this.onSend}
                            toggleEditor={this.toggleEditor}
                            shouldUseDarkColors={shouldUseDarkColors}
                        />
                    )}
                </MainContent>
            </div>
        );
    }
}

export default ModalReplyItem;
