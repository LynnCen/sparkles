import { action, observable } from "mobx";
import getBasicBucketInfo from "@newSdk/logic/getBasicBucketInfo";
import ImageMessageContent from "@newSdk/model/message/ImageMessageContent";
import session from "../../stores_new/session";
import AttachmentMessageContent from "@newSdk/model/message/AttachmentMessageContent";
import VideoMessageContent from "@newSdk/model/message/VideoMessageContent";
import chat from "../../stores_new/chat";
/**
 * @typedef {Object} fileItemBaseAttr
 * @property {string} objectId
 * @property {string} ext
 * @property {number} size
 *
 */

/**
 * @typedef {fileItemBaseAttr} ImageItem
 * @property {string} localPath
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {fileItemBaseAttr} FileItem
 * @property {string} name
 */

/**
 * @typedef {fileItemBaseAttr} VideoItem
 * @property {string} name
 * @property {number} duration
 * @property {string} localPath
 * @property {string} posterFullPath
 * @property {Object} poster
 * @property {number} poster.width
 * @property {number} poster.height
 * @property {string} poster.object
 * @property {string} poster.fileType
 */

/**
 * @typedef {Object} ListItem
 * @property {String} type
 * @property {ImageItem | FileItem | VideoItem} dataset
 */

class FileModalStore {
    MEDIA_TYPE = {
        Image: "NativeImg",
        File: "NativeFile",
        Video: "NativeVideo",
    };

    @observable fileList = [];
    @observable visible = false;
    @observable dragOutVisible = false;
    @observable isLoading = false;

    /**
     *
     * @param fileList {ListItem[]}
     */
    @action open(fileList = []) {
        self.visible = true;
        const _fileList = fileList.map((item, i) => ({
            key: `${Date.now()}_${item.dataset.objectId}_${Math.random()}`,
            ...item,
        }));
        self.fileList = self.fileList.concat(_fileList);
    }
    @action dragOut() {
        self.dragOutVisible = true;
    }
    @action closeDragOut() {
        self.dragOutVisible = false;
    }
    @action close() {
        self.fileList = [];
        self.visible = false;
    }

    @action delete(index) {
        self.fileList.splice(index, 1);
    }

    // todo;
    async send() {
        if (!self.fileList.length) return;

        const { s3_bucket_id: bucketId } = await getBasicBucketInfo();
        const { focusSessionId } = session;

        if (!focusSessionId) return self.close();

        self.fileList.forEach((item) => {
            const { objectId, ext: fileType, size } = item.dataset;
            let message = null;
            if (item.type === self.MEDIA_TYPE.Image) {
                const { width, height } = item.dataset;
                message = new ImageMessageContent(focusSessionId, {
                    objectId,
                    fileType,
                    size,
                    width,
                    height,
                    bucketId,
                    isOrigin: 1,
                });
            }

            if (item.type === self.MEDIA_TYPE.File) {
                const { name } = item.dataset;
                message = new AttachmentMessageContent(focusSessionId, {
                    objectId,
                    name,
                    fileType,
                    size,
                    bucketId,
                });
            }

            if (item.type === self.MEDIA_TYPE.Video) {
                const { name, duration, poster } = item.dataset;
                message = new VideoMessageContent(focusSessionId, {
                    objectId,
                    name,
                    fileType,
                    duration,
                    bucketId,
                    poster,
                });
            }

            if (message) {
                chat.sendMessage(message);
            }
        });

        self.close();
    }
}

const self = new FileModalStore();

export const fileModalStore = self;
export default self;
