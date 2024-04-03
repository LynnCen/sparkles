/**
 * @Author Pull
 * @Date 2021-10-24 15:14
 * @project createVideoCache
 */
import clipTools from "@newSdk/utils/ImageSource";
import { createImageCache } from "./createImageCache";
export const setAttribute = (domRef, attrs) => {
    Object.keys(attrs).forEach((key) => {
        domRef.setAttribute(key, attrs[key]);
        // domRef[key] = attrs[key];
    });
};

export async function* getVideoPosterGen(path, compressOptions) {
    if (!path) return "";

    // 创建 video
    let $Video = document.createElement("video");

    const listener = new Promise((resolve, reject) => {
        $Video.onloadeddata = resolve;
        $Video.onerror = reject;
    });
    const props = {
        src: path,
        autoPlay: true,
        muted: true,
    };
    setAttribute($Video, props);

    await listener;
    const { videoWidth, videoHeight, duration } = $Video;
    $Video.muted = true;
    const next = yield duration;

    // 时长超过限制 返回
    if (!next) {
        $Video.src = "";
        $Video = null;
        return;
    }
    // 绘制 Poster 帧
    const $Canvas = document.createElement("canvas");
    $Canvas.width = videoWidth;
    $Canvas.height = videoHeight;
    $Canvas.getContext("2d").drawImage($Video, 0, 0, videoWidth, videoHeight);

    const infos = await new Promise((resolve) => {
        $Canvas.toBlob(async (data) => {
            if (!data) return resolve(false);
            const localInfo = await createImageCache(data, {
                videoWidth,
                videoHeight,
                type: "jpg",
            });
            $Video.src = "";
            return resolve({
                ...localInfo,
                videoDuration: duration,
            });
        });
    });

    yield infos;
}

export default getVideoPosterGen;
