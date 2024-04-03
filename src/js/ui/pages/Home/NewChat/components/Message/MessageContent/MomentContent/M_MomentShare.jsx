/**
 * @Author Pull
 * @Date 2021-11-17 17:59
 * @project M_MomentShare
 */
import React, { Component } from "react";
import { inject } from "mobx-react";
import styles from "./styles.less";
import Avatar from "components/Avatar";
import { parse_text } from "../../../MessageInput/image_of_emoji/emoji_helper";
import ImageIcon, { supportEnumType } from "components/_N_ImageIcon/ImageIcon";
import { MomentIcon, VideoStart } from "../../../../../../../icons";
import { MediaType } from "../../../../../../Moments/constants/media";
import { renderMessageStatus } from "../../../../../index";
import momentUserFeeds from "@newSdk/model/moments/UserFeeds";
import { withRouter } from "react-router-dom";
import { ROUTE_PATH } from "../../../../../../../routes";
import { MomentsTabEnum } from "../../../../../../Moments/constants/tabs";
import { message as MessagePrompt } from "antd";
import localFormat from "utils/localeFormat";
const renderAbleTypes = [MediaType.IMAGE, MediaType.VIDEO];

@inject(({ UserProxyEntity, MediaDownloadProxy }) => ({
    getBaseInfo: UserProxyEntity.getUserInfo,
    proxyUserInfo: UserProxyEntity.getProxyUserBaseInfo,
    proxyMediaSource: MediaDownloadProxy.getProxyInfo,
    addDownloadList: MediaDownloadProxy.addDownloadList,
}))
export class MomentShareContent extends Component {
    state = {
        isVideo: "",
    };
    renderText = "";
    componentDidMount() {
        const { content, addDownloadList, getBaseInfo } = this.props;
        getBaseInfo(content.uid);
        if (content.image && renderAbleTypes.includes(content.image.mediaType)) {
            addDownloadList({
                ...content.image,
                mediaType: MediaType.IMAGE,
                format: content.image.fileType,
            });

            if (content.image.mediaType === MediaType.VIDEO)
                this.setState({
                    isVideo: true,
                });
        }
    }

    renderMedia() {
        const { proxyMediaSource, content } = this.props;
        if (!content.image || !renderAbleTypes.includes(content.image.mediaType)) return;

        const media = proxyMediaSource({
            ...content.image,
            mediaType: MediaType.IMAGE,
            format: content.image.fileType,
        });
        if (media.percent !== undefined)
            return <ImageIcon enumType={supportEnumType.DOWNLOADING} />;
        if (media.downloadFail) return <ImageIcon enumType={supportEnumType.DOWNLOAD_FAIL} />;
        if (media.localPath) return <img src={media.localPath} alt="" className={styles.image} />;
    }

    handleViewMoments = () => {
        //  2022/7/1 hdie moments
        return MessagePrompt.warn(localFormat({ id: "viewInThePhone" }));
        const { history, content } = this.props;
        // history.replace(ROUTE_PATH.MOMENTS_LIST.replace(":type", MomentsTabEnum.Trending));
        history.push(ROUTE_PATH.MOMENT_DETAIL.replace(":id", content.mid));
    };

    render() {
        const { proxyUserInfo, content } = this.props;
        const userInfo = proxyUserInfo(content.uid);
        const renderText =
            this.renderText ||
            parse_text(content.text || "", "emoji", {
                toStr: true,
                formatTopic: true,
            });
        this.renderText = renderText;
        const { intl, message, timeToShow } = this.props;

        return (
            <section className={styles.momentContent} onClick={this.handleViewMoments}>
                <header className={styles.userHeader}>
                    <Avatar src={userInfo.avatarPath} size={20} />
                    <span className={styles.userName}>{userInfo.friendAlias || userInfo.name}</span>
                </header>

                {renderText && (
                    <div className={styles.text} dangerouslySetInnerHTML={{ __html: renderText }} />
                )}

                {content.image && renderAbleTypes.includes(content.image.mediaType) && (
                    <div className={styles.media}>
                        {this.renderMedia()}
                        {this.state.isVideo && (
                            <aside className={styles.videoMask}>
                                <VideoStart />
                            </aside>
                        )}
                    </div>
                )}

                <aside className={styles.footer}>
                    <div className={styles.icon}>
                        <MomentIcon bodyStyle={{ width: 12, height: 12 }} />
                        <span className={styles.title}>Moments</span>
                    </div>
                    <div>
                        <span>{timeToShow}</span>
                        <span className={styles.status}>
                            {renderMessageStatus(message, intl.formatMessage)}
                        </span>
                    </div>
                </aside>
            </section>
        );
    }
}

export default withRouter(MomentShareContent);
