/**
 * @Author Pull
 * @Date 2021-11-04 22:28
 * @project MomentsDetail
 */
import React, { Component } from "react";
import styles from "./index.less";
import MomentUserHeader from "../Moments/components/momentItem/MomentUserHeader";
import TextContent from "../Moments/components/momentItem/TextContent";
import MomentItemContent from "../Moments/components/momentItem/MomentItemContent";
import FooterActions from "../Moments/components/momentItem/FooterActions";
import { inject } from "mobx-react";
import ForwardAppletContent from "../Moments/components/momentItem/ForwardAppletContent";

@inject(({ MediaDownloadProxy }) => ({
    proxyMediaSource: MediaDownloadProxy.getProxyInfo,
}))
export class MomentsDetail extends Component {
    render() {
        const { momentInfo, proxyMediaSource } = this.props;
        const {
            authType,
            sendTime,
            id,
            uid,
            textContext,
            sourceList = [],
            appletInfo,
        } = momentInfo;
        const mediaInfo = sourceList.map((item) => ({ ...item, ...proxyMediaSource(item) }));
        return (
            <section className={`${styles.moment_detail} dark-theme-bg_lighter`}>
                <MomentUserHeader
                    fullTime
                    momentInfo={{
                        ...momentInfo,
                        authType: authType,
                        sendTime: sendTime,
                        id: id,
                        uid: uid,
                    }}
                />

                <TextContent text={textContext} limitContent={false} />
                <MomentItemContent
                    size="large"
                    description={textContext}
                    mediaContentWidth={496}
                    sourceList={mediaInfo}
                />

                <ForwardAppletContent overlayStyle={{ height: 270 }} appletInfo={appletInfo} />
                <div className={styles.item_info}>
                    <FooterActions
                        id={id}
                        uid={uid}
                        showCount={false}
                        media={mediaInfo[0]}
                        textContext={textContext}
                    />
                </div>
            </section>
        );
    }
}

export default MomentsDetail;
