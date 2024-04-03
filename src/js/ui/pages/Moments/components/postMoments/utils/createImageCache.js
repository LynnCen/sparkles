/**
 * @Author Pull
 * @Date 2021-10-24 14:21
 * @project createImageCache
 */
import {
    formatSource,
    cacheRoot,
    checkRootDir,
    buildCompressImg,
    writeOriginCache,
    checkOriginCache,
    encryptSha1,
} from "utils/sn_utils";
import ImageMessageContent from "@newSdk/model/message/ImageMessageContent";
import mimeTypes from "mime-types";
import DefaultMomentsImgCompressOptions from "../../../constants/media";
import sizeOf from "image-size";
import clipUtils from "@newSdk/utils/ImageSource";

export const createImageCache = async (source, size) => {
    await checkRootDir();
    const binary = await formatSource(source);
    if (!binary) return false;

    //压缩

    // 1 不支持压缩类型，上传原图
    if (ImageMessageContent.unSupportCompressType.includes(size.type)) {
        const sha1 = encryptSha1(binary);
        const bucketPath = `img/${sha1.slice(0, 2)}/${sha1}`;
        // 缓存文件
        let originPath = "";
        // 检查是否存在
        originPath = await checkOriginCache(bucketPath, size.type);
        // 写入文件
        if (!originPath) originPath = await writeOriginCache(source, bucketPath, size.type);

        const binarySize = binary.length || binary.size || binary.byteLength || 0;
        return {
            originPath,
            compressPath: originPath,
            size,
            ext: size.type,
            contentHash: bucketPath,
            fileSize: binarySize,
        };
    }

    //  2 支持压缩类型

    // 2.1 压缩 大图
    const largeSizeBinary = await buildCompressImg(
        {
            buf: binary,
            mime: mimeTypes.lookup(size.type),
            compressOptions: DefaultMomentsImgCompressOptions,
        },
        false
    );

    // 生成缩略图

    // 2.2 将大图写入
    const sha1 = encryptSha1(largeSizeBinary);
    const bucketPath = `img/${sha1.slice(0, 2)}/${sha1}`;
    // 缓存文件
    let originPath = "";
    // 检查是否存在
    originPath = await checkOriginCache(bucketPath, size.type);
    // 写入文件
    if (!originPath) originPath = await writeOriginCache(largeSizeBinary, bucketPath, size.type);

    // 3.获取大图 size
    const largeSize = sizeOf(originPath);

    return {
        originPath,
        compressPath: originPath,
        size: largeSize,
        ext: largeSize.type,
        contentHash: bucketPath,
        fileSize: largeSizeBinary.byteLength,
    };
};

export const createImageCompress = async (source, size) => {
    clipUtils.setThumb();
};

export default createImageCache;
