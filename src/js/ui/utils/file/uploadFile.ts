import nodeFs from "fs";
import nodePath from "path";
import { Mb } from "utils/file/helper";
import { message } from "antd";
import localeFormat from "utils/localeFormat";
import { createFileCache, createImageCache } from "utils/sn_utils";
import sizeOf from "image-size";
import { fileModalStore } from "components/TmmFileListModal/fileModalStore";
import file_type from "@newSdk/utils/file_type";
import { generateVideoInfo } from "utils/file/generateVideoInfo";
import mime from "mime-types";

export const limitImageMb = 25;
export const limitGifMb = 10;
export const limitFileMb = 500;

export const limitGifSize = 10 * 1024 * 1024;
export const limitImageSize = limitImageMb * 1024 * 1024;
export const limitFileSize = 500 * 1024 * 1024;
const MediaOpt = {
    ImgType: [".png", ".jpg", ".gif", ".jpeg", ".bmp", ".webp"],
    ImgSize: limitImageMb,
    dir: false,
    gifLimit: limitGifMb,
    fileLimit: limitFileMb,
};

export const handleLocalMedia = async (path: string) => {
    const doc = await nodeFs.promises.stat(path);
    if (doc.isDirectory()) return false;
    // support type check;
    const ext = nodePath.extname(path).toLowerCase();

    const { ImgType } = MediaOpt;
    // handle normal image
    if (ImgType.includes(ext)) return handleImageMedia(path);
    else return handleFileMedia(path);
};

export const handleImageMedia = async (path: string) => {
    const doc = await nodeFs.promises.stat(path);
    const { ImgSize, gifLimit } = MediaOpt;
    const ext = nodePath.extname(path).toLowerCase();
    if (ext === ".gif" && doc.size > Mb(gifLimit)) {
        message.error(localeFormat({ id: "gifImgLimitSizeMb" }, { size: gifLimit }));
        return false;
    } else if (doc.size > Mb(ImgSize)) {
        message.error(localeFormat({ id: "staticImgLimitSizeMb" }, { size: ImgSize }));
        return false;
    } else {
        // compress
        fileModalStore.visible = true;
        const name = nodePath.basename(path);
        const buf = await nodeFs.promises.readFile(path);
        const info = await createImageCache(buf, sizeOf(buf));
        return _handleMediaSource({ name, ...info }, true);
    }
};

export const handleFileMedia = async (path: string, skipCheckIsVideo = false) => {
    const doc = await nodeFs.promises.stat(path);
    const ext = nodePath.extname(path).toLowerCase();
    const { fileLimit } = MediaOpt;
    const isVideo = skipCheckIsVideo ? false : file_type.isVideo(mime.extension(ext) as string);

    if (doc.size > Mb(fileLimit)) {
        const textId = isVideo ? "videoLimitSizeMb" : "fileLimitSizeMb";
        message.error(localeFormat({ id: textId }, { size: fileLimit }));
        return false;
    }
    fileModalStore.visible = true;
    const info = await createFileCache(path);
    let isImage = ext === ".gif";
    return _handleMediaSource(info, false, skipCheckIsVideo);
};

const _handleMediaSource = async (info: any, isImage: any, skipCheckIsVideo = false) => {
    if (isImage) {
        const { compressPath, originPath, size, contentHash, ext, fileSize, name } = info;

        return {
            type: fileModalStore.MEDIA_TYPE.Image,
            dataset: {
                // @ts-ignore
                localPath: compressPath || originPath,
                width: size.width,
                height: size.height,
                name,
                objectId: contentHash,
                ext,
                size: fileSize,
            },
        };
    } else {
        const { size, name, ext, text, localPath } = info;
        const isVideo = skipCheckIsVideo ? false : file_type.isVideo(ext);

        if (isVideo) {
            // 生成poster
            const { duration, poster, posterFullPath } = (await generateVideoInfo(
                localPath
            )) as any;
            console.log(
                duration,
                poster,
                posterFullPath,
                "---------------------duration, poster, posterFullPath"
            );
            return {
                type: fileModalStore.MEDIA_TYPE.Video,
                dataset: {
                    size,
                    // @ts-ignore
                    name: `${name}.${ext}`,
                    ext,
                    duration,
                    poster,
                    localPath,
                    objectId: text,
                    posterFullPath,
                },
            };
        }

        return {
            type: fileModalStore.MEDIA_TYPE.File,
            dataset: {
                size,
                // @ts-ignore
                name: `${name}.${ext}`,
                ext,
                objectId: text,
            },
        };
    }
};

export default handleLocalMedia;
