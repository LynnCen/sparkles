import { Avatar } from "@newSdk/model/types";
import {
    checkOriginCache,
    writeOriginCache,
    checkCompressCache,
    writeCompressCache,
    createImageCompress,
} from "utils/sn_utils";
import getObject, { getThumb } from "@newSdk/service/api/s3Client/getObject";
import { ImageMedia } from "@newSdk/typings";
import checkLocal from "@newSdk/logic/_defaultLocalCheck/checkLocal";

const MIN = 240;
const MAX = 540;

const ops = {
    minWidth: MIN,
    minHeight: MIN,
    maxWidth: MAX,
    maxHeight: MAX,
};
function setThumb(
    reqWidth?: number,
    reqHeight?: number,
    { minHeight = MIN, minWidth = MIN, maxWidth = MAX, maxHeight = MAX } = ops
) {
    let requestWidth = 0;
    let requestHeight = 0;
    let tempWidth = 0;
    let tempHeight = 0;
    let width = parseInt(`${reqWidth}`) || maxWidth;
    let height = parseInt(`${reqHeight}`) || maxHeight;
    if (width == 0) {
        width = maxWidth;
    }
    if (height == 0) {
        height = maxHeight;
    }

    if (width <= minWidth && height <= minHeight) {
        if (width * 9 <= height * 4) {
            //1
            requestWidth = minWidth;
            tempHeight = (height * minWidth) / width;
            requestHeight = tempHeight > maxHeight ? maxHeight : tempHeight;
        } else if (height * 9 <= width * 4) {
            //4
            requestHeight = minHeight;
            tempWidth = (width * minHeight) / height;
            requestWidth = tempWidth > maxWidth ? maxWidth : tempWidth;
        } else if (width * 9 > height * 4 && height >= width) {
            //2
            requestWidth = minWidth;
            tempHeight = (height * minWidth) / width;
            requestHeight = tempHeight > maxHeight ? maxHeight : tempHeight;
        } else if (height * 9 > width * 4 && height < width) {
            //3
            requestHeight = minHeight;
            tempWidth = (width * minHeight) / height;
            requestWidth = tempWidth > maxWidth ? maxWidth : tempWidth;
        }
    } else if (minWidth < width && width < maxWidth && height <= minHeight) {
        if (height * 9 <= width * 4) {
            //5
            requestHeight = minHeight;
            tempWidth = (width * minHeight) / height;
            requestWidth = tempWidth > maxWidth ? maxWidth : tempWidth;
        } else {
            //6
            requestHeight = minHeight;
            tempWidth = (width * minHeight) / height;
            requestWidth = tempWidth > maxWidth ? maxWidth : tempWidth;
        }
    } else if (minHeight < height && height < maxHeight && width <= minWidth) {
        if (width * 9 <= height * 4) {
            //10
            requestWidth = minWidth;
            tempHeight = (height * minWidth) / width;
            requestHeight = tempHeight > maxHeight ? maxHeight : tempHeight;
        } else {
            //9
            requestWidth = minWidth;
            tempHeight = (height * minWidth) / width;
            requestHeight = tempHeight > maxHeight ? maxHeight : tempHeight;
        }
    } else if (
        minWidth <= width &&
        width <= maxWidth &&
        minHeight <= height &&
        height <= maxHeight
    ) {
        //7/8
        requestWidth = width;
        requestHeight = height;
    } else if (width <= minWidth && height >= maxHeight) {
        //11
        requestWidth = minWidth;
        requestHeight = maxHeight;
    } else if (height <= minHeight && width >= maxWidth) {
        //18
        requestHeight = minHeight;
        requestWidth = maxWidth;
    } else if (
        width > minWidth &&
        width < maxWidth &&
        height > maxHeight &&
        width * 9 <= height * 4
    ) {
        //12
        requestWidth = minWidth;
        tempHeight = (height * minWidth) / width;
        requestHeight = tempHeight > maxHeight ? maxHeight : tempHeight;
    } else if (
        height > minHeight &&
        height < maxHeight &&
        width > maxWidth &&
        height * 9 <= width * 4
    ) {
        //17
        requestHeight = minHeight;
        tempWidth = (width * minHeight) / height;
        requestWidth = tempWidth > maxWidth ? maxWidth : tempWidth;
    } else if (minWidth < width && width < maxWidth && height > maxHeight) {
        //13
        requestHeight = maxHeight;
        tempWidth = (width * maxHeight) / height;
        requestWidth = tempWidth > maxWidth ? maxWidth : tempWidth;
    } else if (minHeight < height && height < maxHeight && width > maxWidth) {
        //16
        requestWidth = maxWidth;
        tempHeight = (height * maxWidth) / width;
        requestHeight = tempHeight > maxHeight ? maxHeight : tempHeight;
    } else if (width >= maxWidth && height >= maxHeight && height >= width) {
        //14
        requestHeight = maxHeight;
        tempWidth = (width * maxHeight) / height;
        requestWidth = tempWidth > maxWidth ? maxWidth : tempWidth;
    } else if (width >= maxWidth && height >= maxHeight && width >= height) {
        //15
        requestWidth = maxWidth;
        tempHeight = (height * maxWidth) / width;
        requestHeight = tempHeight > maxHeight ? maxHeight : tempHeight;
    }

    return { width: parseInt(`${requestWidth}`), height: parseInt(`${requestHeight}`) };
}

function preViewSize(width: number | string, height: number | string) {
    if (typeof width === "string") width = parseInt(width);
    if (typeof height === "string") height = parseInt(height);

    const limitOption = {
        max: 240,
        min: 100,
    };

    let scale = 1;

    const max = Math.max(width, height);
    const min = Math.min(width, height);
    if (max > limitOption.max) {
        scale = limitOption.max / max;
    } else if (min < limitOption.min) {
        scale = limitOption.min / min;
    }

    return {
        width: parseInt(`${width * scale}`),
        height: parseInt(`${height * scale}`),
        // height: 240,
    };
}

// download compress image
const downloadAvatar = (() => {
    const memory = new Map();

    const download = async (avatar?: Avatar) => {
        if (!avatar) return false;
        try {
            const {
                file_type,
                text,
                bucketId,
                width: nativeW = 240,
                height: nativeH = 240,
            } = avatar;
            const { width, height } = setThumb(nativeW, nativeH);
            // check compress cache
            const isExist = await checkCompressCache({
                path: text,
                type: file_type,
                height,
                width,
            });
            // done
            if (isExist) return isExist;

            const defaultLocal = await checkLocal(
                { fileType: file_type, height, width, bucketId, objectId: text },
                false
            );
            if (defaultLocal) return defaultLocal;

            // get compress cache
            let binary = await getThumb(
                {
                    filename: text,
                    fileType: file_type,
                    bucketID: bucketId,
                },
                { width, height }
            );
            if (binary) {
                // write compress cache
                const fullPath = await writeCompressCache(binary, text, {
                    width,
                    height,
                    type: file_type,
                });
                if (fullPath) return fullPath;
            } // download compress avatar fail

            // crop fail, check origin
            const originPath = await downloadOriginAvatarAndCompress(avatar);
            if (originPath) return originPath;
            return false;
        } catch (e) {
            return false;
        }
    };

    return async (avatar?: Avatar) => {
        if (!avatar) return false;

        const { file_type, text, bucketId } = avatar;

        const key = `${text}${file_type}${bucketId}`;

        if (memory.has(key)) return memory.get(key);
        else {
            const p = download(avatar);

            p.then(
                (res) => {
                    memory.set(key, res);
                },
                (err) => {
                    memory.set(key, false);
                }
            );

            // two min later try able
            // p.finally(() => {
            //     setTimeout(() => {
            //         memory.delete(key);
            //     }, 1000 * 120);
            // });
            memory.set(key, p);
            return p;
        }
    };
})();

// download origin avatar then compress
const downloadOriginAvatarAndCompress = async (avatar: Avatar) => {
    const { text, file_type, height, width } = avatar;

    // download origin path
    const fullPath = await downloadOriginImage(avatar);

    const compressPath = await createImageCompress({
        source: fullPath,
        width,
        height,
        type: file_type,
        path: text,
    });
    return compressPath || fullPath || false;
};

// download origin
const downloadOriginImage = async (avatar: Avatar) => {
    const { text, file_type, bucketId, height, width } = avatar;
    const isExist = await checkOriginCache(text, file_type);
    if (isExist) return isExist;

    // local
    const defaultLocal = await checkLocal(
        { fileType: file_type, height, width, bucketId, objectId: text },
        false
    );
    if (defaultLocal) return defaultLocal;

    const binary = await getObject({
        filename: text,
        fileType: file_type,
        bucketID: bucketId,
    });
    if (!binary) return false;
    const fullPath = await writeOriginCache(binary, text, file_type);
    return fullPath || false;
};

export const transformMediaSource = (avatar: Avatar): ImageMedia => {
    const { text, file_type, width, height, bucketId } = avatar;

    return {
        objectId: text,
        fileType: file_type,
        width,
        height,
        bucketId,
    };
};

export default {
    setThumb,
    preViewSize,
    downloadAvatar,
    downloadOriginAvatarAndCompress,
    downloadOriginImage,
};
