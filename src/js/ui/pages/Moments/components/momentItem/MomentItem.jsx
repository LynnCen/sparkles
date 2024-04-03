/**
 * @Author Pull
 * @Date 2021-10-12 11:29
 * @project MomentItem
 */

import React, { Component, Fragment } from "react";
import styles from "./moments.module.less";
import classNames from "classnames/bind";
import Avatar from "components/Avatar";
import {
    GreyMoreActionIcon,
    LikeHeartIcon,
    CommentIcon,
    NonPublicIcon,
    LikeRedIcon,
} from "../../../../icons";
import MomentItemContent, { ContentEnum } from "./MomentItemContent";
import { inject } from "mobx-react";
import { AuthType } from "@newSdk/model/moments/instance/MomentsNormalContent";
import { withRouter } from "react-router-dom";
import moment from "moment";
import settings from "../../../../stores/settings";
import { ZHLangTy } from "../../../../../config";
import { find } from "lodash";
import UserInfo from "@newSdk/model/UserInfo";
import { sendUpvote, sendCancelUpvote } from "@newSdk/service/api/moments/sendUpvote";
import { formatNumber } from "utils/number_helper";
import MomentFromNow from "components/MomentFromNow";
import HotComment from "./HotComment";
import ForwardItem from "../forwardMoments/ForwardItem";
import ForwardContent from "./ForwardContent";
import TextContent from "./TextContent";
import MomentActions from "./actions/MomentActions";
import FooterActions from "./FooterActions";
import { AuthIcon } from "../../constants/publishAuthOptions";
import MomentUserHeader from "./MomentUserHeader";
import ForwardAppletContent from "./ForwardAppletContent";

const cx = classNames.bind(styles);

@inject(({ UserInfoProxy, MediaDownloadProxy, MomentLikes, ForwardCountProxy }) => ({
    proxyUserInfo: UserInfoProxy.proxyInfo,
    proxyMediaSource: MediaDownloadProxy.getProxyInfo,
    likes: MomentLikes.likes,
    onAddLikes: MomentLikes.onAddLikes,
    onDelLikes: MomentLikes.onDelLikes,
    getForwardCount: ForwardCountProxy.getCount,
}))
export class MomentItem extends Component {
    clickInterval = 0;

    stopPropagation = (e) => e.stopPropagation();
    handleMouseDown = () => {
        this.clickInterval = Date.now();
    };
    handleMouseUp = () => {
        const now = Date.now();
        if (now - 233 < this.clickInterval) {
            const {
                history,
                momentInfo: { id },
            } = this.props;
            history.push(`/moment/${id}`);
        }
    };

    render() {
        const {
            limitContent = true,
            mediaContentWidth = 240,
            log,
            proxyMediaSource,
            momentInfo,
        } = this.props;
        const {
            id,
            uid,
            textContext,
            sourceList = [],
            forwardPresInfo,
            forwardRoot,
            breakOff,
            appletInfo,
        } = momentInfo;
        const mediaInfo = sourceList.map((item) => ({ ...item, ...proxyMediaSource(item) }));
        return (
            <section
                className={cx("moment-item", "dark-theme-bg_lighter")}
                onContextMenu={() => console.log(id, log)}
                onMouseDown={this.handleMouseDown}
                onMouseUpCapture={this.handleMouseUp}
            >
                <MomentUserHeader fullTime={false} momentInfo={momentInfo} />
                <TextContent
                    text={textContext}
                    limitContent={limitContent}
                    forwardPresInfo={forwardPresInfo}
                />
                <div onMouseDown={this.stopPropagation}>
                    <MomentItemContent
                        description={textContext}
                        mediaContentWidth={mediaContentWidth}
                        sourceList={mediaInfo}
                    />
                </div>
                <ForwardContent forwardRoot={forwardRoot} breakOff={breakOff} mid={id} />
                <ForwardAppletContent appletInfo={appletInfo} />

                <aside className={cx("item-info")}>
                    <FooterActions
                        id={id}
                        uid={uid}
                        media={mediaInfo[0]}
                        textContext={textContext}
                    />
                </aside>
                <HotComment mid={id} />
            </section>
        );
    }
}

export default withRouter(MomentItem);
