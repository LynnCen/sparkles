import React from "react";
import { observer, inject } from "mobx-react";
import { calcSizeByRate } from "../../Message/MessageContent/M_VideoMessage/helper";
import { getFilename, getFileType, writeFileToLocalIfAbsent } from "utils/fs_helper";
import upload from "@newSdk/service/api/s3Client/upload";
import MessageType from "@newSdk/model/MessageType";
import VideoMessageContent from "@newSdk/model/message/VideoMessageContent";
import getBasicBucketInfo from "@newSdk/logic/getBasicBucketInfo";
const refVideo = React.createRef();

@inject((stores) => ({
    sendMessage: stores.NewChat.sendMessage,
    focusSessionId: stores.NewSession.focusSessionId,
    file: stores.Common.videoFile,
    updateUploadFile: stores.Common.updateUploadFile,
}))
@observer
class VideoUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoSrc: "",
            videoInfo: {},
            file: {},
        };
    }

    componentDidMount() {
        refVideo.current.addEventListener("loadeddata", this.onVideoLoad);
    }

    componentWillUnmount() {
        refVideo.current.removeEventListener("loadeddata", this.onVideoLoad);
    }

    handleSendFile = async ({ dataset }) => {
        const chatId = this.props.focusSessionId;
        this.setState({ videoSrc: "", videoInfo: {} });

        const { s3_bucket_id } = await getBasicBucketInfo();
        const message = new VideoMessageContent(chatId, { ...dataset, bucketId: s3_bucket_id });
        await this.props.sendMessage(message);
        this.props.updateUploadFile(null);
    };

    onVideoLoad = () => {
        const { videoWidth, videoHeight } = refVideo.current;
        const [width, height] = calcSizeByRate(videoWidth, videoHeight);
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(refVideo.current, 0, 0, width, height); //draw canvas
        canvas.toBlob(
            async (data) => {
                if (!data) return;

                // default image upload
                const { filePath, filePathUnType } = await writeFileToLocalIfAbsent(
                    { type: "img", fileType: "jpeg" },
                    data
                );
                upload(data, filePath);
                const {
                    videoInfo: { videoId, name, ext },
                } = this.state;

                if (!videoId) {
                    const { filePathUnType } = await writeFileToLocalIfAbsent(
                        { type: "video", fileType: getFileType(this.state.file.name) },
                        this.state.file
                    );
                    this.setState({
                        videoInfo: {
                            videoId: filePathUnType,
                            name: getFilename(this.state.file.name),
                            ext: getFileType(this.state.file.name),
                        },
                    });
                }

                this.handleSendFile({
                    dataset: {
                        objectId: videoId,
                        name,
                        fileType: ext,
                        duration: (refVideo.current.duration * 1000) | 0,
                        poster: { width, height, objectId: filePathUnType, fileType: "jpeg" },
                    },
                });
            },
            "image/jpeg",
            0.5
        );
    };

    async componentDidUpdate(prevProps) {
        const { file } = this.props;
        if (prevProps.file !== file && file) {
            this.setState({
                file: file,
            });
            refVideo.current.src = window.URL.createObjectURL(file);
            const { filePathUnType } = await writeFileToLocalIfAbsent(
                { type: "video", fileType: getFileType(file.name) },
                file
            );
            this.setState({
                videoInfo: {
                    videoId: filePathUnType,
                    name: getFilename(file.name),
                    ext: getFileType(file.name),
                },
            });
        }
    }

    render() {
        return <video style={{ width: 0 }} autoPlay={true} muted={true} ref={refVideo} />;
    }
}

export default VideoUpload;
