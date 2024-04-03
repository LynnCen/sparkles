import { Message } from "@newSdk/model/Message";
import MessageType, { MessageContent, MediaDownloadStatus } from "@newSdk/model/MessageType";
import {
    checkCompressCache,
    createImageCache,
    writeCompressCache,
    checkOriginCache,
} from "utils/sn_utils";
import CalcSize from "./ImageSource";
import { messageModel } from "@newSdk/model";
import getObject, { getThumb } from "../service/api/s3Client/getObject";
import nodePath from "path";

const MIN_SIZE = 444;

export const encode = (content: any) => {
    if (typeof content !== "string") {
        try {
            return JSON.stringify(content);
        } catch (e) {
            return JSON.stringify({});
        }
    } else return JSON.stringify({});
};

export const decode = <T = any>(content: any): T => {
    if (!content) return {} as T;

    if (typeof content === "string") {
        try {
            return JSON.parse(content);
        } catch (e) {
            return {} as T;
        }
    }

    return content;
};

export const decodeList = (messages: Message[] | Message) => {
    const decodeItem = (msg: Message) => {
        if (!msg) return msg;
        const m = { ...msg };
        m.content = decode(m.content);
        if (m.extra) m.extra = decode(m.extra);
        return m;
    };

    if (Array.isArray(messages)) return messages.map(decodeItem);
    else {
        return decodeItem(messages);
    }
};

/*

/!**
 *
 * @param messages
 * @return normalMessage
 *!/
export const handleMediaMessage = async (
    messages: Message<MessageContent.ImageMessageContent | any>[]
) => {
    //
    const normalMessage: Message[] = [];

    // download img to local cache
    const imageList: Message<MessageContent.ImageMessageContent>[] = [];

    // audio list
    const audioList: Message<MessageContent.AudioMessageContent>[] = [];

    // filter
    for (const item of messages) {
        // image Message
        if (item.type === MessageType.ImgMessage && !item.extra.mediaStatus) imageList.push(item);
        else if (item.type === MessageType.AudioMessage && !item.extra.mediaStatus)
            audioList.push(item);
        else normalMessage.push(item);
    }

    // handle image
    if (imageList.length) loadImageMessage(imageList);
    // handle audio
    if (audioList.length) loadAudioMessage(audioList);

    return normalMessage;
};
export default {};

const loadImageMessage = (messageList: Message<MessageContent.ImageMessageContent>[]) => {
    for (const msg of messageList) {
        Promise.resolve()
            .then(async () => {
                const { width, height, file_type, text, bucketId } = msg.content;
                // const text = msg.content.text.split("/").pop() as string;
                const { width: w, height: h } = CalcSize.setThumb(width, height);

                //download source
                const isNeedThumb = width > MIN_SIZE && height > MIN_SIZE && file_type !== "gif";

                try {
                    const res = isNeedThumb
                        ? await getThumb(
                              { filename: text, fileType: file_type, bucketID: bucketId },
                              { width: w, height: h }
                          )
                        : await getObject({
                              filename: text,
                              fileType: file_type,
                              bucketID: bucketId,
                          });

                    // @ts-ignore
                    if (res && res.size > 0) {
                        isNeedThumb
                            ? await writeCompressCache(res, text, {
                                  width: w,
                                  height: h,
                                  type: file_type,
                              })
                            : await createImageCache(res, { width, height, type: file_type });
                        msg.extra.mediaStatus = MediaDownloadStatus.cached;
                    } else msg.extra.mediaStatus = MediaDownloadStatus.downloadError; // fail
                } catch (e) {
                    // fail
                    msg.extra.mediaStatus = MediaDownloadStatus.downloadError;
                }
                await messageModel.deleteItemInertNewPosition(msg);
            })
            .then(() => console.log(`write down, ${msg.mid}`));
    }
};

const loadAudioMessage = (messageList: Message<MessageContent.AudioMessageContent>[]) => {
    for (const msg of messageList) {
        Promise.resolve().then(async () => {
            const { text, file_type, bucketId } = msg.content;
            try {
                await getObject({ filename: text, fileType: file_type, bucketID: bucketId });
                msg.extra.mediaStatus = MediaDownloadStatus.cached;
            } catch (e) {
                msg.extra.mediaStatus = MediaDownloadStatus.downloadError;
            }

            await messageModel.deleteItemInertNewPosition(msg);
        });
    }
};
*/
