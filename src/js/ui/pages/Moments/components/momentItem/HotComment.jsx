/**
 * @Author Pull
 * @Date 2021-10-28 14:22
 * @project ItemHotComment
 */
import React, { Component } from "react";
import { inject } from "mobx-react";
import classNames from "classnames/bind";
import styles from "./moments.module.less";
const cx = classNames.bind(styles);
import { parse_text } from "../../../Home/NewChat/components/MessageInput/image_of_emoji/emoji_helper";
import { getNameWeight } from "utils/nameWeight";
@inject(({ HotCommentProxy, UserInfoProxy }) => ({
    getHotComment: HotCommentProxy.getHotComment,
    proxyUserInfo: UserInfoProxy.proxyInfo,
    getBaseInfo: UserInfoProxy.getBaseInfo,
}))
export class hotComment extends Component {
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     const {} = prevProps
    // }

    render() {
        const { getHotComment, proxyUserInfo, getBaseInfo, mid } = this.props;
        const hotCommentList = getHotComment(mid);

        if (!hotCommentList || !hotCommentList.length) return null;
        return (
            <aside className={cx("item-comment")}>
                {hotCommentList.slice(0, 2).map((item) => {
                    const userInfo = proxyUserInfo(item.uid) || {};
                    if (!userInfo || !Object.keys(userInfo).length) {
                        getBaseInfo(item.uid);
                    }
                    return (
                        <p className={cx("comment-content")} key={item.id}>
                            <span className={cx("comment-name", "dark-theme-color_lighter")}>
                                {/* {userInfo.friendAlias || userInfo.name} */}
                                {getNameWeight({
                                    friendAlias: userInfo.friendAlias,
                                    alias: userInfo.alias,
                                    name: userInfo.name,
                                    uid: userInfo.uid,
                                    status: userInfo.status,
                                })}
                                :{" "}
                            </span>
                            <span className="dark-theme-color_grey">{parse_text(item.text)}</span>
                        </p>
                    );
                })}
            </aside>
        );
    }
}

export default hotComment;
