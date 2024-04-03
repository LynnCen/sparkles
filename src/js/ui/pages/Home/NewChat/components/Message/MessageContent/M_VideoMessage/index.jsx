import React from "react";
import { Progress, message } from "antd";
import { checkOriginCache, writeOriginCache } from "utils/sn_utils";
import getObject, { getThumb } from "@newSdk/service/api/s3Client/getObject";
import { shell } from "electron";
import { writeFileToLocalIfAbsent, isExistFile } from "utils/fs_helper";
import { calcSizeByRate, parseDuration } from "./helper";
import { VideoStart } from "../../../../../../../icons";
import { ipcRenderer } from "../../../../../../../../platform";
import chatVideo from "images/icons/chat_vedio.png";
import styles from "./index.less";
import { renderMessageStatus } from "../../../../../index";
import classNames from "classnames";
import { fileModalStore } from "components/TmmFileListModal/fileModalStore";
export default class VideoMsg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: "", // video path
            error: undefined,
            downloadProgress: 0,
            isStart: false,
            poster: "",
        };
    }

    componentDidMount() {
        this.initTheVideo();
        this.initThePoster();
    }
    handleOnDrag = (e) => {
        e.preventDefault();
        const { poster } = this.state;
        // fileModalStore.dragOut();
        const {
            objectId,
            fileType,
            intl: { formatMessage },
        } = this.props;
        const fullPath = isExistFile(`${objectId}.${fileType}` || "");
        const videoIcon = `/src/assets/images/filetypes/shrinkfile/video.png`;
        if (!fullPath) return message.info(formatMessage({ id: "video_download_tip" }));
        console.log(fullPath, videoIcon);
        ipcRenderer.send("ondragstart", fullPath, videoIcon);
    };
    onDownloadPoster = async () => {
        const { poster = {}, bucketId } = this.props;
        const videoHeight = poster.height,
            videoWith = poster.width;
        const filePath = poster.objectId.split("/");
        try {
            const binary = await getThumb(
                {
                    filename: poster.objectId,
                    fileType: poster.fileType,
                    bucketID: poster.bucketId ? poster.bucketId : bucketId, //22 5/31 Compatible mobile terminal
                },
                { width: videoWith, height: videoHeight }
            );
            if (!binary) return;
            const { fullPath } = await writeFileToLocalIfAbsent(
                { type: "t_img", fileType: poster.fileType },
                binary,
                { dir: filePath[1], filename: filePath[2] }
            );
            this.setState({ poster: fullPath });
        } catch (e) {}
    };

    onDownloadVideo = async () => {
        const { objectId, fileType, bucketId } = this.props;
        try {
            this.setState({ error: undefined, isStart: true });
            const binary = await getObject(
                {
                    filename: objectId,
                    fileType: fileType,
                    bucketID: bucketId,
                },
                ({ loaded, total }) => {
                    this.setState({ downloadProgress: ((loaded / total) * 100).toFixed(0) });
                }
            );
            if (!binary) return;
            let path = await writeOriginCache(binary, objectId, fileType);
            this.setState({ path, isStart: false });
        } catch (e) {
            this.setState({ error: "exception" });
            console.log(e);
        }
    };

    initTheVideo = () => {
        const { objectId, fileType } = this.props;
        checkOriginCache(objectId, fileType).then((path) => {
            this.setState({ path });
            if (!path) {
                this.onDownloadVideo();
            }
        });
    };

    initThePoster = () => {
        const { poster } = this.props;
        try {
            // only check thumb file exists
            const fullPath = isExistFile(`t_${poster.objectId}.${poster.fileType}` || "");
            this.setState({ poster: fullPath });
        } catch (e) {
            this.onDownloadPoster();
        }
    };

    openVideo = async () => {
        const { objectId, fileType } = this.props;
        try {
            const fullPath = isExistFile(`${objectId}.${fileType}` || "");
            shell.openItem(fullPath);
        } catch (e) {
            await this.onDownloadVideo();
            const { path } = this.state;
            if (path) return shell.openItem(path);
        }
    };

    render() {
        const {
            poster: videoPoster = {},
            timeToShow,
            status,
            intl,
            message,
            isMe,
            uploadingRate,
            content,
        } = this.props;
        const { path, downloadProgress, isStart, error, poster } = this.state;
        const videoHeight = videoPoster.height,
            videoWith = videoPoster.width;
        const [defaultWidth, defaultHeight] = calcSizeByRate(videoWith, videoHeight);
        return (
            <div
                className={styles.tmm_video_msg}
                onClick={this.openVideo}
                draggable={true}
                onDragStart={this.handleOnDrag}
                style={{ width: defaultWidth, height: defaultHeight }}
            >
                <div className={styles.mask_loading}>
                    {poster && (
                        <img
                            alt={"poster"}
                            src={poster}
                            draggable={false}
                            className={styles.poster}
                            style={{ width: defaultWidth, height: defaultHeight }}
                        />
                    )}
                    {!isStart && uploadingRate === undefined && (
                        <div className={styles.mask_center}>
                            <VideoStart />
                        </div>
                    )}

                    {uploadingRate !== undefined && (
                        <Progress
                            className={styles.mask_center}
                            type="circle"
                            percent={uploadingRate}
                            width={50}
                            status={error}
                        />
                    )}

                    {isStart && (
                        <Progress
                            className={styles.mask_center}
                            type="circle"
                            percent={downloadProgress}
                            width={50}
                            status={error}
                        />
                    )}

                    <div className={styles.msgInfo}>
                        <div className={styles.msgContent}>
                            <span className={styles.msgLabel}>{timeToShow}</span>
                            {isMe && (
                                <span className={styles.msgStatus} data-status={status}>
                                    {renderMessageStatus(message, intl.formatMessage)}
                                </span>
                            )}
                        </div>
                    </div>

                    {!!content.duration && (
                        <div className={classNames(styles.msgInfoDuration)}>
                            <div className={styles.duration}>
                                <img className={styles.durationIcon} src={chatVideo} />
                                <span className={styles.msgLabel}>
                                    {parseDuration(content.duration)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
