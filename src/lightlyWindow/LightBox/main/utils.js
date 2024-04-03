import {
    checkCompressCache,
    checkOriginCache,
    writeCompressCache,
    writeOriginCache,
} from "utils/sn_utils";
import calcSize from "@newSdk/utils/ImageSource";
import getObjectByKey, { getThumb } from "@newSdk/service/api/s3Client/getObject";
import ImageMessageContent from "@newSdk/model/message/ImageMessageContent";

/**
 * @Author Pull
 * @Date 2021-08-21 15:04
 * @project utils
 */

const getThumbnail = async (
    { width, height, fileType, objectId, bucketId },
    mid,
    autoDownload = false
) => {
    const fileInfo = {
        filename: objectId,
        fileType,
        bucketID: bucketId,
    };
    const size = calcSize.setThumb(width, height);

    const isUnSupportCompressType = ImageMessageContent.unSupportCompressType.includes(fileType);

    let compressPath = "";

    if (isUnSupportCompressType) {
        compressPath = await checkOriginCache(objectId, fileType);
        if (compressPath) return compressPath;
    }

    /* check compress  */
    compressPath = await checkCompressCache({
        path: objectId,
        type: fileType,
        ...size,
    });
    if (compressPath) return compressPath;

    if (!autoDownload) return false;

    /* download source */
    if (!isUnSupportCompressType) {
        const source = await getThumb(fileInfo, size);
        // const source = await getThumb(fileInfo, size, info => this.progress(mid, info))
        if (source)
            return await writeCompressCache(source, objectId, {
                ...size,
                type: fileType,
            });
    }
    return false;
};

const checkIndex = (list, forceIndex) => {
    let prevAble = false;
    let nextAble = false;

    if (forceIndex < list.length - 1) prevAble = true;
    if (forceIndex > 0) nextAble = true;

    return {
        prevAble,
        nextAble,
    };
};
const initSource = async (messageList, initForceMid) => {
    let forceIndex = 0;
    const list = await Promise.all(
        messageList.map(async (message, i) => {
            const { content } = message;

            let compressPath = false;

            if (message.mid === initForceMid) {
                forceIndex = i;
                // check origin, origin first
                const { objectId, fileType } = content;
                compressPath = await checkOriginCache(objectId, fileType);

                // show thumbnail;
                if (!compressPath) compressPath = await getThumbnail(content, message.mid, true);
            } else compressPath = await getThumbnail(content, message.mid);

            return {
                mid: message.mid,
                content: content,
                path: compressPath,
                load: false,
            };
        })
    );

    return { list, forceIndex };
};

const initMomentsSource = async (mediaList, initForceMid) => {
    let forceIndex = 0;
    const list = await Promise.all(
        mediaList.map(async (item, i) => {
            // const { content } = message;
            //
            let compressPath = false;

            if (item.mid === initForceMid) {
                forceIndex = i;
            }
            if (item.localPath) compressPath = item.localPath;

            return {
                mid: item.mid,
                content: item,
                path: compressPath,
                load: false,
            };
        })
    );

    return { list, forceIndex };
};

const downloadOriginSource = async (content, progressHandler) => {
    const { objectId, fileType, bucketId } = content;
    let path = await checkOriginCache(objectId, fileType);
    // target in cache
    if (path) return path;

    // download
    const fileInfo = {
        filename: objectId,
        fileType,
        bucketID: bucketId,
    };
    const source = await getObjectByKey(fileInfo, progressHandler);
    if (source) {
        path = await writeOriginCache(source, objectId, fileType);
        return path;
    }
    return false;
};

const compressCurrent = async (source, content) => {
    try {
        const { width, height, fileType, objectId, bucketId } = content;
        const size = calcSize.setThumb(width, height);

        /* check compress  */
        let compressPath = await checkCompressCache({
            path: objectId,
            type: fileType,
            ...size,
        });

        if (compressPath) return;

        return await writeCompressCache(source, objectId, {
            ...size,
            type: fileType,
        });
    } catch (e) {
        console.error(e);
    }
};

const getImageDownloadKey = ({ objectId, fileType, bucketId } = {}) =>
    `${objectId}_${bucketId}_${fileType}`;

export {
    initSource,
    initMomentsSource,
    getThumbnail,
    checkIndex,
    downloadOriginSource,
    compressCurrent,
    getImageDownloadKey,
};
