import { getFilename, getFileType, writeFileToLocalIfAbsent } from "utils/fs_helper";
import { calcSizeByRate } from "../../pages/Home/NewChat/components/Message/MessageContent/M_VideoMessage/helper";
import upload from "@newSdk/service/api/s3Client/upload";
import { base64toBlob } from "utils/sn_image";

export const generateVideoInfo = (localfilePath: string) =>
    new Promise(async (resolve) => {
        const video = document.createElement("video");
        // video.setAttribute("crossOrigin", "anonymous"); //处理跨域
        video.src = localfilePath;
        video.autoplay;
        video.currentTime = 1;
        video.onloadeddata = async () => {
            const { videoWidth, videoHeight } = video;
            const [width, height] = calcSizeByRate(videoWidth, videoHeight);

            const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.drawImage(video, 0, 0, width, height); //draw canvas
            // const data = base64toBlob(canvas.toDataURL("image/png"));

            canvas.toBlob(
                async (data) => {
                    if (!data) return;
                    // default image upload

                    const { filePath, filePathUnType, fullPath } = await writeFileToLocalIfAbsent(
                        { type: "img", fileType: "jpeg" },
                        data
                    );
                    upload(data, filePath);
                    return resolve({
                        duration: (video.duration * 1000) | 0,
                        poster: { width, height, objectId: filePathUnType, fileType: "jpeg" },
                        posterFullPath: canvas.toDataURL("image/png"),
                    });
                },
                "image/jpeg",
                0.5
            );
        };

        video.onerror = () => resolve({});
    });
