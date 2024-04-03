/**
 * @Author Pull
 * @Date 2021-10-22 14:41
 * @project sn_vidoe
 */
import clipTools from "@newSdk/utils/ImageSource";
import { createImageCache } from "utils/sn_utils";

export const setAttribute = (domRef, attrs) => {
    Object.keys(attrs).forEach((key) => {
        domRef.setAttribute(key, attrs[key]);
        // domRef[key] = attrs[key];
    });
};

export const getVideoPoster = (path, compressOptions) =>
    new Promise((resolve) => {
        if (!path) return "";

        // 创建 video
        let $Video = document.createElement("video");

        $Video.onloadeddata = () => {
            const { videoWidth, videoHeight, duration } = $Video;
            const { width, height } = clipTools.setThumb(videoWidth, videoHeight, {
                maxHeight: compressOptions.maxHeight,
                maxWidth: compressOptions.maxWidth,
            });

            // 绘制 Poster 帧
            const $Canvas = document.createElement("canvas");
            $Canvas.width = width;
            $Canvas.height = height;
            $Canvas.getContext("2d").drawImage($Video, 0, 0, width, height);
            $Canvas.toBlob(async (data) => {
                if (!data) return resolve(false);
                const localInfo = await createImageCache(
                    data,
                    { width, height, type: "jpg" },
                    compressOptions
                );
                $Video.src = "";
                return resolve({
                    ...localInfo,
                    videoDuration: duration,
                });
            });
        };

        const props = {
            src: path,
            autoPlay: true,
            muted: true,
        };
        setAttribute($Video, props);
    });
