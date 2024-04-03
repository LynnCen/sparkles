/**
 * @Author Pull
 * @Date 2021-10-13 11:52
 * @project MomentItemContent
 */
import React, { Fragment } from "react";
import MultiGrid from "../MultiGrid/MultiGrid";
import classNames from "classnames/bind";
import styles from "./moments.module.less";
import { DefaultMediaDisplayCount } from "../../constants/base";
import { MediaType } from "../../constants/media";
import ImageIcon, { supportEnumType } from "components/_N_ImageIcon/ImageIcon";
import { VideoStart } from "../../../../icons";
import { shell } from "electron";
import { ipcRenderer } from "../../../../../platform";
import userInfoModel from "@newSdk/model/UserInfo";
import { LightBoxIPCType } from "../../../../../../MainProcessIPCType";
import { checkOriginCache } from "utils/sn_utils";

// import {} from "images/fa";

const cx = classNames.bind(styles);
export const ContentEnum = {
    IMAGE: 1,
    VIDEO: 2,
    FORWARD: "forward",
};

export const MomentItemContent = ({ count, sourceList, size, mediaContentWidth }) => {
    const previewImageList = async (e, forceIndex = 0) => {
        e.stopPropagation();
        const media = sourceList.map((item, i) => ({
            ...item,
            fileType: item.format,
            mid: `mid_${i}`,
        }));

        const forceMid = `mid_${forceIndex}`;
        const currentItem = media.find((item) => item.mid === forceMid);

        console.log(currentItem);
        const path = await checkOriginCache(currentItem.objectId, currentItem.format);
        let preview = path || currentItem.localPath;

        ipcRenderer.send(LightBoxIPCType.createLightBox, {
            moments: true,
            media: media.reverse(),
            previewTempLink: preview,
            mid: forceMid,
            userInfo: userInfoModel,
        });
    };

    const renderMediaContent = (item, i) => {
        if (item.percent !== undefined) return <ImageIcon enumType={supportEnumType.DOWNLOADING} />;
        if (item.downloadFail) return <ImageIcon enumType={supportEnumType.DOWNLOAD_FAIL} />;

        switch (item.mediaType) {
            case MediaType.IMAGE:
                return item.localPath ? (
                    <img
                        className={cx("cr-p")}
                        src={item.localPath}
                        alt=""
                        onClick={(e) => previewImageList(e, i)}
                    />
                ) : (
                    <ImageIcon enumType={supportEnumType.DOWNLOADING} />
                );
            case MediaType.VIDEO:
                return (
                    <section
                        className={cx("video-container", "cr-p")}
                        onClick={(e) => {
                            e.stopPropagation();
                            shell.openItem(item.localPath);
                        }}
                    >
                        <aside className={cx("video-mask")}>
                            <VideoStart />
                        </aside>
                        <video src={item.localPath} poster={item.posterLocalPath} />
                    </section>
                );
            default:
                return null;
        }
    };
    return (
        <Fragment>
            {sourceList.length ? (
                <section className={cx("item-media")}>
                    <MultiGrid
                        size={size}
                        count={count || sourceList.length}
                        onPreviewImages={previewImageList}
                        sourceList={sourceList}
                        mediaContentWidth={mediaContentWidth}
                    >
                        {sourceList.slice(0, DefaultMediaDisplayCount).map((item, i) => (
                            <MultiGrid.Item key={i}>{renderMediaContent(item, i)}</MultiGrid.Item>
                        ))}
                    </MultiGrid>
                </section>
            ) : null}
        </Fragment>
    );
};

export default MomentItemContent;
