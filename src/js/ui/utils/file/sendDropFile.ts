import getBasicBucketInfo from "@newSdk/logic/getBasicBucketInfo";
import ImageMessageContent from "@newSdk/model/message/ImageMessageContent";
import { message } from "antd";
import { createFileCache, createImageCache } from "utils/sn_utils";
import sizeOf from "image-size";
import file_type from "@newSdk/utils/file_type";
import AttachmentMessageContent from "@newSdk/model/message/AttachmentMessageContent";
import localeFormat from "utils/localeFormat";
import mime from "mime-types";
import commonStore from "../../stores_new/common";
import chat from "../../stores_new/chat";
import { OfficialServices } from "@newSdk/index";
import { fileModalStore } from "components/TmmFileListModal/fileModalStore";
import handleLocalMedia from "utils/file/uploadFile";

export const limitImageMb = 25;
export const limitGifMb = 10;
export const limitFileMb = 500;

export const limitGifSize = 10 * 1024 * 1024;
export const limitImageSize = limitImageMb * 1024 * 1024;
export const limitFileSize = 500 * 1024 * 1024;

interface ResourceProps {
    file: File;
    // chatId: string;
    // s3_bucket_id: string;
}

interface DragInfo {
    chatId: string;
    files: File[];
}

export const sendMsgWithDrag = async ({ chatId, files }: DragInfo) => {
    const sendAble = verify({ chatId, files });
    if (!sendAble) return false;
    console.log(files, "files");

    try {
        // const { s3_bucket_id } = await getBasicBucketInfo();

        const fileList: any = [];
        if (files.length) {
            for await (const file of files) {
                // if (!file.type) continue;
                if (file.path.includes(".")) {
                    fileModalStore.isLoading = true;
                    const item = await handleLocalMedia(file.path);

                    if (item) {
                        fileList.push(item);
                        fileModalStore.isLoading = false;
                    }
                }

                // const ext = mime.extension(file.type) || "";
                // if (supportImg.includes(ext)) {
                //     // await handleImage({ file, chatId, s3_bucket_id });
                //     await handleImage({ file });
                // } else {
                //     // await handleFile({ file, chatId, s3_bucket_id });
                //     await handleFile({ file });
                // }
            }

            if (fileList.length) {
                fileModalStore.open(fileList); //open file
            }
        }
    } catch (e) {
        console.error(`parse error`, e);
    } finally {
    }
    return false;
};

const verify = ({ chatId, files }: DragInfo): boolean => {
    if (!chatId) return false;
    if (OfficialServices.includes(chatId)) return false;
    if (!files || !files.length) return false;

    return true;
};
/*
// const handleImage = async ({ file, chatId, s3_bucket_id }: ResourceProps) => {
const handleImage = async ({ file }: ResourceProps) => {
    const ext = mime.extension(file.type) || "";
    if (file.size > limitImageSize)
        message.error(localeFormat({ id: "staticImgLimitSizeMb" }, { size: limitImageMb }));
    else if (ext === "gif" && file.size > limitGifSize)
        message.error(localeFormat({ id: "gifImgLimitSizeMb" }, { size: limitGifMb }));
    else {
        const info = await createImageCache(file.path, sizeOf(file.path));
        if (!info) return;
        const {
            contentHash: objectId,
            size: { width, height },
            ext,
            fileSize,
        } = info;

        return {
            type: fileModalStore.MEDIA_TYPE.Image,
            dataset: {
                width,
                height,
                objectId,
                ext,
                size: fileSize,
                localPath: file.path,
            },
        };
        // const message = new ImageMessageContent(chatId, {
        //     objectId,
        //     width,
        //     height,
        //     fileType,
        //     isOrigin: 1,
        //     size: fileSize,
        //     bucketId: s3_bucket_id,
        // });
        //
        // await chat.sendMessage(message);
    }
};

// const handleFile = async ({ file, chatId, s3_bucket_id }: ResourceProps) => {
const handleFile = async ({ file }: ResourceProps) => {
    // file source
    const ext = mime.extension(file.type) || "";
    if (file.size > limitFileSize) {
        const isVideo = file_type.isVideo(ext);
        message.error(
            localeFormat(
                {
                    id: isVideo ? "videoLimitSizeMb" : "fileLimitSizeMb",
                },
                {
                    size: limitFileMb,
                }
            )
        );
    } else {
        const info = await createFileCache(file.path);
        if (!info) return;
        const { text, name, ext } = info;
        const isVideo = file_type.isVideo(ext);
        if (isVideo) {
            // this.props.commonStore.updateUploadFile(file);
            commonStore.updateUploadFile(file);
        } else {
            // const message = new AttachmentMessageContent(chatId, {
            //     objectId: text,
            //     name: `${name}.${ext}`,
            //     fileType: ext,
            //     size: `${file.size}`,
            //     bucketId: s3_bucket_id,
            // });
            await chat.sendMessage(message);
        }
    }
};*/
