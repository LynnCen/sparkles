/**
 * @Author Pull
 * @Date 2021-06-02 19:14
 * @project sn_utils
 * @description dont use alias to import module, case the main process also use some method in here,and not suport
 */

/*
 *
 * */
import osenv from "osenv";
import nodeFs, { fstat } from "fs";
import nodeCrypto from "crypto";
import nodePath from "path";
import CalcSize from "@newSdk/utils/ImageSource";
import mimeTypes from "mime-types";
import Compressor from "compressorjs";
import pinyin from "pinyin";
import { notification, Progress as AntProgress } from "antd";
import React from "react";
import ImageMessageContent from "@newSdk/model/message/ImageMessageContent";
import { CropImgBizType } from "@newSdk/base/consts";

// region  cache about

export const encryptSha1 = (binary) =>
    nodeCrypto.createHash("sha1").update(binary).digest("hex").toLowerCase();
export const createSha1Hash = async (source) => {
    try {
        const binary = await formatSource(source);
        const contentHash = encryptSha1(binary);
        return contentHash;
    } catch (e) {
        console.error(e);
        return "";
    }
};

// generate img objectId
export const createBucketHash = async (source, prefix) => {
    try {
        if (!prefix) {
            return "";
        }
        const sha1 = await createSha1Hash(source);
        if (!sha1) return "";

        return `${prefix}/${sha1.slice(0, 2)}/${sha1}`;
    } catch (e) {
        console.error("--------------> create error", e);
        return "";
    }
};

export const formatSource = async (source) => {
    let binary;
    try {
        if (typeof source === "string") {
            binary = await nodeFs.promises.readFile(source);
        } else if (source instanceof Uint8Array || source instanceof Buffer) binary = source;
        else if (source instanceof Blob) {
            const buf = await source.arrayBuffer();
            binary = new Uint8Array(buf);
        } else return false;
    } catch (e) {}

    return binary;
};

export const cacheRoot = nodePath.join(osenv.home(), `./Documents/TmmTmm Files`);

export const checkRootDir = async () => {
    if (!nodeFs.existsSync(cacheRoot)) await nodeFs.promises.mkdir(cacheRoot, { recursive: true });
};

/**
 * @description input origin image source, write origin and compress to local
 * @param source string | Unit8Array | Buffer | Blob
 * @param size { {width, height, type?,} }
 * @param compressOptions { {limitSize: number, maxWidth: number, maxHeight: number}  }
 */
export async function createImageCache(
    source,
    size,
    compressOptions = {},
    bizType = CropImgBizType.BizTypeDef
) {
    await checkRootDir();
    try {
        const binary = await formatSource(source);
        if (!binary) return false;

        const binarySize = binary.length || binary.size || binary.byteLength || 0;
        // create sha1 abstract
        const sha1 = await createSha1Hash(binary);
        // sh1 dir name
        const dir = sha1.slice(0, 2);
        const bucketPath = `img/${dir}/${sha1}`;

        // origin cache dir path
        const originCacheDir = nodePath.join(cacheRoot, `img/${dir}`);
        if (!nodeFs.existsSync(originCacheDir))
            await nodeFs.promises.mkdir(originCacheDir, { recursive: true });
        // origin image path
        const originPath = await nodePath.join(originCacheDir, `${sha1}.${size.type}`);
        // is exist
        if (!nodeFs.existsSync(originPath)) await nodeFs.promises.writeFile(originPath, binary);
        if (ImageMessageContent.unSupportCompressType.includes(size.type))
            return {
                originPath,
                compressPath: originPath,
                size,
                ext: size.type,
                contentHash: bucketPath,
                fileSize: binarySize,
            };

        // compress cache dir path
        const compressCacheDir = nodePath.join(cacheRoot, `img/${dir}`);
        if (!nodeFs.existsSync(compressCacheDir))
            await nodeFs.promises.mkdir(compressCacheDir, { recursive: true });
        // get scale size
        const { width, height } = CalcSize.setThumb(size.width, size.height);
        // compress image path
        const compressPath = await nodePath.join(
            compressCacheDir,
            `${sha1}_${width}_${height}_${bizType}.${size.type}`
        );
        // is_exist
        if (!nodeFs.existsSync(compressPath)) console.log(`to build compress`, compressPath, size);
        await buildCompressImg({
            compressPath,
            buf: binary,
            mime: mimeTypes.lookup(size.type),
            compressOptions,
        });

        return {
            originPath,
            compressPath,
            size,
            ext: size.type,
            contentHash: bucketPath,
            fileSize: binarySize,
        };
    } catch (e) {
        console.log(e);
    }
}

export async function createFileCache(source, prefix = `attachment`) {
    await checkRootDir();

    try {
        const binary = await formatSource(source);
        if (!binary) return false;

        let { name, ext } = nodePath.parse(source);
        if (ext) ext = ext.slice(1);

        const size = (await nodeFs.promises.stat(source)).size;
        const hash = encryptSha1(binary);
        const dir = hash.slice(0, 2);
        const bucketText = `${prefix}/${dir}/${hash}`;

        const localPath = await writeOriginCache(binary, `${prefix}/${dir}/${hash}`, ext);

        return {
            localPath,
            text: bucketText,
            name,
            ext,
            size,
            isFile: true,
        };
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const createDir = async (fullPath) => {
    const { dir } = nodePath.parse(fullPath);
    if (nodeFs.existsSync(fullPath)) return fullPath;
    if (!nodeFs.existsSync(dir)) await nodeFs.promises.mkdir(dir, { recursive: true });
};

/**
 * @param source string | Unit8Array | Buffer | Blob
 * @param path sha1Text
 * @param size { {width, height, type,} }
 */
export async function writeCompressCache(source, path, size, bizType = CropImgBizType.BizTypeDef) {
    await checkRootDir();
    try {
        const binary = await formatSource(source);
        if (!binary) return false;
        const { width, height, type } = size;
        // const fullPath = nodePath.join(cacheRoot, `t_${path}_${width}x${height}.${type}`);
        const fullPath = nodePath.join(cacheRoot, `${path}_${width}_${height}_${bizType}.${type}`);
        await createDir(fullPath);
        await nodeFs.promises.writeFile(fullPath, binary);
        return fullPath;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * @param source string | Unit8Array | Buffer | Blob
 * @param path sha1Path
 * @param type string
 */
export async function writeOriginCache(source, path, type) {
    if (!path || !type || !source) return false;

    const exist = await checkOriginCache(path, type);
    if (exist) return exist;
    await checkRootDir();
    try {
        const fullPath = nodePath.join(cacheRoot, `${path}.${type}`);

        await createDir(fullPath);
        const binary = await formatSource(source);

        if (!binary) return false;
        await nodeFs.promises.writeFile(fullPath, binary);
        return fullPath;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function writeAvatarCache(source, fileType) {
    try {
        await checkRootDir();
        const binary = await formatSource(source);
        if (!binary) return false;

        const contentHash = encryptSha1(binary);
        const fullPath = nodePath.join(cacheRoot, `img/${contentHash}.${fileType}`);
        await createDir(fullPath);

        await nodeFs.promises.writeFile(fullPath, binary);

        // const cachePath =
        return fullPath;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function checkCompressCache({
    path,
    width,
    height,
    type,
    bizType = CropImgBizType.BizTypeDef,
}) {
    const compressPath = nodePath.join(cacheRoot, `${path}_${width}_${height}_${bizType}.${type}`);
    if (nodeFs.existsSync(compressPath) && (await nodeFs.promises.stat(compressPath)).size > 0)
        return compressPath;

    return false;
}

export async function checkOriginCache(path, type) {
    try {
        const originPath = await nodePath.join(cacheRoot, `${path}.${type}`);
        if (nodeFs.existsSync(originPath)) return originPath;
        else return false;
    } catch (e) {
        console.error(e);
        return false;
    }
}

// download
// TODO refactor check [style]
export async function saveFile(sourcePath, savePath) {
    const info = nodeFs.statSync(sourcePath);
    if (!info) return false;

    const { size } = info;
    const { name, ext } = nodePath.parse(savePath);

    const ws = nodeFs.createWriteStream(savePath);
    const rs = nodeFs.createReadStream(sourcePath);

    rs.pipe(ws);

    let len = 0;
    rs.on("data", (chunk) => {
        len += chunk.length;
        const ratio = ((len / size).toFixed(2) * 100).toFixed(0);
        notification.info({
            key: savePath,
            placement: "bottomRight",
            message: `save as ${name}${ext}`,
            description: <AntProgress percent={ratio} />,
            duration: 2,
        });
    });

    rs.on("end", () => {
        rs.close();
        notification.close(savePath);
    });
}

export async function createImageCompress({
    source,
    path,
    width,
    height,
    type,
    bizType = CropImgBizType.BizTypeDef,
}) {
    const binary = await formatSource(source);

    const compressPath = nodePath.join(cacheRoot, `${path}_${width}_${height}_${bizType}.${type}`);
    if (!nodeFs.existsSync(compressPath)) {
        const { dir } = nodePath.parse(compressPath);
        await nodeFs.promises.mkdir(dir, { recursive: true });
    }
    return await buildCompressImg({
        compressPath,
        buf: binary,
        mime: mimeTypes.lookup(type),
    });
}
//
const compressImg = (bold, ops) =>
    new Promise((resolve, reject) => {
        new Compressor(bold, {
            maxHeight: 240,
            maxWidth: 240,
            ...ops,
            success(result) {
                console.log("clip success", ops);
                resolve(result);
            },
            error(e) {
                console.log(e);
                resolve(false);
            },
        });
    });

const compareLoop = async (blob, limitSize, options = { quality: 0.6 }) => {
    if (!blob) return false;

    const maxLoopTime = 3;
    try {
        let currentLoopTime = 0;
        let autoSizeBlob = blob;
        let currentSize = blob.size / 1024;
        while (currentSize > limitSize) {
            // const ops = {
            //     quality: quality,
            //     convertSize: Infinity,
            // };
            // if (maxWidth) ops.maxWidth = maxWidth;
            // if (maxHeight) ops.maxHeight = maxHeight;
            console.log("each ops", options);
            const res = await compressImg(autoSizeBlob, options);

            if (!res) return autoSizeBlob;

            let size = autoSizeBlob.size / 1024;

            // b1:
            if (currentSize.toFixed(0) === size.toFixed(0)) return autoSizeBlob;
            currentSize = size;
            currentLoopTime += 1;
            // b2
            if (currentLoopTime > maxLoopTime) return autoSizeBlob;
        }
    } catch (e) {
        return false;
    }
};
export const buildCompressImg = async (options, autoWriteLocal = true) => {
    try {
        const {
            buf,
            mime,
            compressOptions: {
                limitSize = 10,
                maxHeight = 540,
                maxWidth = 540,
                eachQuality = 0.6,
            } = {},
        } = options;

        let blob = new Blob([buf], { type: mime });
        if (!blob || !blob.size) return false;

        // clip size
        // console.log(`clip size`, {
        //     maxHeight,
        //     maxWidth,
        //     // mi
        //     mimeType: mime,
        //     convertSize: Infinity,
        // });

        // 裁剪尺寸
        let autoSizeBlob = await compressImg(blob, {
            maxHeight,
            maxWidth,
            quality: 1,
            // mi
            mimeType: mime,
            convertSize: Infinity,
        });

        if (!autoSizeBlob) return false;

        // calculate quality
        const size = autoSizeBlob.size;
        let kb = size / 1024;

        if (kb >= limitSize) {
            // console.log("target loop");
            // compress quality
            // const ratio = Number((3 / (kb - 10)).toFixed(2)) || 0.1;
            autoSizeBlob = await compareLoop(blob, limitSize, {
                mimeType: mime,
                quality: eachQuality,
                maxWidth,
                maxHeight,
            });
        }

        // to binary
        const arrBuf = await autoSizeBlob.arrayBuffer();
        const binary = new Uint8Array(arrBuf);

        if (!autoWriteLocal) return binary;
        // write
        const { compressPath } = options;
        await nodeFs.promises.writeFile(compressPath, binary);
        return compressPath;
    } catch (e) {
        console.error(e);
        return false;
    }
};
// endregion

export function splitFstName(listMapOb, item, name = "") {
    const key = name.toLocaleUpperCase();
    if (listMapOb[key]) {
        // 已存在 直接添加
        listMapOb[key].push(item);
    } else {
        const code = key.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            // A-Z
            listMapOb[key] = [item];
        } else {
            let p = "";
            try {
                p = (
                    pinyin(name, { style: pinyin.STYLE_FIRST_LETTER })[0][0] || "#"
                ).toLocaleUpperCase();
            } catch (e) {
                p = "#";
            }
            const code = p.charCodeAt();
            const le = code >= 65 && code <= 90 ? p : "#";
            // #
            if (listMapOb[le]) {
                listMapOb[le].push(item);
            } else listMapOb[le] = [item];
        }
    }
}
