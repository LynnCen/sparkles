/**
 * @Author Pull
 * @Date 2021-06-15 10:01
 * @project M_FileMessage
 */
import React, { Component } from "react";
import propType from "prop-types";
import classNames from "classnames";
import { shell } from "electron";
import { message, Progress } from "antd";
import file_size from "utils/file_size";
import { subString, subString_reverse, get_byte_length } from "utils/helper_string";
import { getFilename } from "utils/fs_helper";
import { inject, observer } from "mobx-react";
import { ipcRenderer } from "../../../../../../../../platform";
import nodePath from "path";
import styles from "./styles.less";
import osenv from "osenv";
import { renderMessageStatus } from "../../../../../index";
import nodeFs from "fs";
export const supportFile = {
    txt: "txt",
    doc: "doc",
    docx: "doc",
    xls: "xls",
    xlsx: "xls",
    ppt: "ppt",
    pdf: "pdf",
    zip: "zip",
    rar: "zip",
    mp3: "music",
    acc: "music",
    amr: "music",
    flac: "music",
    wav: "music",
    mp4: "video",
    MP4: "video",
    m4v: "video",
    M4V: "video",
    mov: "video",
    MOV: "video",
    jpg: "picture",
    jpeg: "picture",
    png: "picture",
    bmp: "picture",
    webp: "picture",
    gif: "picture",
};
@inject((store) => ({
    downloadOrigin: store.DownloadCenter.downloadOrigin,
    removeProgressSub: store.DownloadCenter.removeProgressSub,
}))
@observer
class FileMessage extends Component {
    static propType = {
        name: propType.string,
        size: propType.number,
        fileType: propType.string,
        objectId: propType.string,
        isMe: propType.bool,
    };

    state = {
        path: "",
        error: undefined,
        downloadProgress: 0,
        isStart: false,
    };

    componentDidMount() {
        this.handleDownload();
        // setTimeout(() => {
        //     this.ccreateWoker(this.handleDownload);
        // }, 500);
    }

    componentWillUnmount() {
        const { content, removeProgressSub } = this.props;
        removeProgressSub(content, this.handleProgress);
    }

    handleDownload = (isOpen) => {
        const { content, downloadOrigin } = this.props;
        const { isStart, downloadProgress, path } = this.state;
        this.setState({ isStart: true, error: null });
        const downFile = true;
        if (downloadProgress > 0) return;
        downloadOrigin(content, this.handleProgress, false, downFile)
            .then((path) => {
                if (!path) this.setState({ error: "exception" });
                else {
                    this.setState({ path });
                    if (isOpen) shell.showItemInFolder(path);
                }
            })
            .catch(() => {
                this.setState({ error: "exception" });
            })
            .finally(() => {
                this.setState({ isStart: false, downloadProgress: 0 });
            });
    };
    // 处理长任务
    createWoker = (fun) => {
        let blob = new Blob(["(" + fun + ")()"]);
        let url = window.URL.createObjectURL(blob);
        const woker = new Worker(url);
        return woker;
    };

    handleProgress = (percent) => {
        this.setState({
            downloadProgress: percent,
        });
    };

    previewHandler = async () => {
        this.handleDownload(true);
    };
    handleOnDrag = (e) => {
        try {
            e.preventDefault();
            const { path } = this.state;
            const {
                content: { name, size, fileType },
                intl: { formatMessage },
            } = this.props;
            const fileIcon = `/src/assets/images/filetypes/shrinkfile/${supportFile[fileType.toLowerCase()] || "unknown"
                }.png`;
            const cacheRoot = nodePath.join(osenv.home(), `./Documents/TmmTmm Files`);
            const tempFilePath = nodePath.join(`${cacheRoot}/tmp/`, name);
            nodeFs.copyFile(path, tempFilePath, 0, () => {
                if (!nodeFs.existsSync(tempFilePath)) {
                    return message.info(formatMessage({ id: "file_download_tip" }));
                }
                console.log(tempFilePath, fileIcon);
                ipcRenderer.send("ondragstart", tempFilePath, fileIcon);
                setTimeout(() => {
                    if (nodeFs.existsSync(tempFilePath))
                        nodeFs.unlink(tempFilePath, (e) => {
                            console.log("deleted tempFilePath", e);
                        });
                }, 30000);
            });
        } catch (error) {
            console.log("handleOnDrag", error);
        }
    };

    render() {
        const {
            isMe,
            content: { name, size, fileType },
            uploadingRate,
            timeToShow,
            status,
            message,
            intl,
        } = this.props;
        const { path, downloadProgress, error, isStart } = this.state;
        const disName =
            subString(getFilename(name), 44 - fileType.length) + "..." + subString_reverse(getFilename(name), 8);
        const resName = get_byte_length(name) < 53 ? getFilename(name) : disName;
        return (
            <div draggable="true" onClick={this.previewHandler} onDragStart={this.handleOnDrag}>
                <div
                    className={classNames(styles.fileContainer, {
                        [styles.me]: isMe,
                    })}
                // draggable="true"
                // onClick={this.previewHandler}
                // onDragStart={this.handleOnDrag}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            marginRight: 12,
                            flex: "none",
                            background: `center/contain url(assets/images/filetypes/${supportFile[fileType.toLowerCase()] || "unknown"
                                }.png)`,
                        }}
                    // draggable="true"
                    />
                    <div
                        className={styles.mainContent}
                    // draggable="true"
                    >
                        <article>
                            <p className={styles.name}>
                                {resName}
                                <span className={styles.fileType}>.{fileType}</span>
                            </p>
                            {uploadingRate === undefined && !isStart && (
                                <p className={styles.size}>{file_size(size)}</p>
                            )}
                            {uploadingRate !== undefined && (
                                <div className={styles.upload_progress}>
                                    <Progress
                                        size="small"
                                        percent={uploadingRate}
                                        strokeColor="var(--primary)"
                                        width={15}
                                        showInfo={false}
                                        strokeWidth={10}
                                        type={"circle"}
                                    />
                                    <span className={styles.upload_label}>Uploading...</span>
                                </div>
                            )}
                            {isStart && (
                                <Progress
                                    className={styles.progress}
                                    size="small"
                                    percent={downloadProgress}
                                    status={error}
                                    strokeColor="var(--primary)"
                                    width={15}
                                    showInfo={false}
                                    strokeWidth={10}
                                    type={"circle"}
                                />
                            )}
                        </article>
                    </div>

                    <div className={styles.msgInfo}>
                        <div className={styles.msgContent}>
                            <span className={styles.msgTime}>{timeToShow}</span>
                            {isMe && (
                                <span className={styles.msgStatus} data-status={status}>
                                    {renderMessageStatus(message, intl.formatMessage)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FileMessage;
