/**
 * @Author Pull
 * @Date 2021-10-30 15:41
 * @project ForwardContent
 */
import React, { Component } from "react";
import styles from "./moments.module.less";
import classNames from "classnames/bind";
import { inject } from "mobx-react";
import { parse_text } from "../../../Home/NewChat/components/MessageInput/image_of_emoji/emoji_helper";
import MomentItemContent from "./MomentItemContent";
import { MultiGridSizeEnum } from "../MultiGrid/MultiGrid";
import { getNameWeight } from "utils/nameWeight";
const cx = classNames.bind(styles);
@inject(({ UserInfoProxy, MediaDownloadProxy, ForwardCountProxy }) => ({
    proxyUserInfo: UserInfoProxy.proxyInfo,
    getBaseInfo: UserInfoProxy.getBaseInfo,
    proxyMediaSource: MediaDownloadProxy.getProxyInfo,
    getForwardCount: ForwardCountProxy.getCount,
}))
export class ForwardContent extends Component {
    init = false;

    getUserInfo() {
        const { forwardRoot, getBaseInfo } = this.props;
        if (!this.init && forwardRoot && forwardRoot.uid) {
            getBaseInfo(forwardRoot.uid);
            this.init = true;
        }
    }

    render() {
        const {
            forwardRoot,
            proxyUserInfo,
            proxyMediaSource,
            getForwardCount,
            breakOff,
            mid,
        } = this.props;
        if (!forwardRoot) return null;
        this.getUserInfo();

        const userInfo = proxyUserInfo(forwardRoot.uid);
        const { media = [] } = forwardRoot;
        const mediaInfo = media.map(proxyMediaSource);
        return (
            <section className={cx("forward-content")}>
                {breakOff ? (
                    `Sorry, this post has been deleted by author.`
                ) : (
                    <div>
                        <span style={{ color: "#22cee0" }}>
                            @
                            {getNameWeight({
                                friendAlias: userInfo.friendAlias,
                                alias: userInfo.alias,
                                name: userInfo.name,
                                uid: userInfo.uid,
                                status: userInfo.status,
                            })}
                            {/* {userInfo.friendAlias || userInfo.name} */}
                        </span>
                        <span>{parse_text(forwardRoot.text || "")}</span>

                        {media && media.length ? (
                            <MomentItemContent
                                count={media.length}
                                size={MultiGridSizeEnum.SMALL}
                                sourceList={mediaInfo}
                            />
                        ) : null}
                    </div>
                )}
            </section>
        );
    }
}

export default ForwardContent;
