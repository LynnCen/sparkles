import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client";
import getBucketInfoById from "@newSdk/service/api/getBucketInfoById";
import axios from "axios";
import getBasicBucketInfo from "@newSdk/logic/getBasicBucketInfo";
import getBucketInfo from "@newSdk/logic/getBucketInfo";
import nodeFs, { fstat } from "fs";
import nodePath from "path";
import osenv from "osenv";
import { checkRootDir, createDir, formatSource } from "utils/sn_utils";
let md5 = require("md5");
type ProgressHandler = (progressEvent: any) => void;

export type FileInfo = {
    filename: string;
    fileType: string;
    bucketID?: string;
    objectId?: string;
    name?: string;
};

type ThumbInfo = {
    width: number;
    height: number;
    isBig?: boolean;
};

// get img from aws s3 after received msg
const getObjectByKey = async (
    key: FileInfo,
    handler?: ProgressHandler,
    isThumb: boolean = false
) => {
    if (!key.filename || !key.fileType) return false;

    const { s3_bucket_id } = await getBasicBucketInfo();

    let bucketInfo;
    if (key.bucketID && key.bucketID !== s3_bucket_id) {
        bucketInfo = await getBucketInfoById(key.bucketID as string);
    } else {
        bucketInfo = await getBucketInfo();
    }
    const s3 = await s3Client(bucketInfo.region);

    //bucket Accelerate
    const params = {
        AccelerateConfiguration: {
            /* required */ Status: "Enabled",
        },
        Bucket: bucketInfo.bucket_name,
    };
    await s3.putBucketAccelerateConfiguration(params);
    // const validKey = isThumb
    //     ? `${key.filename}.${key.fileType}`
    //     : `${key.filename}.${key.fileType}`;
    const validKey = `${key.filename}.${key.fileType}`;
    // const cacheRoot = nodePath.join(osenv.home(), `./Documents/TmmTmm Files`);
    // const savePath = nodePath.join(cacheRoot, `${key.filename}.${key.fileType}`);
    // let tmpPath = cacheRoot + `/tmp/` + md5(key.filename);
    // if (nodeFs.existsSync(tmpPath)) {
    //     nodeFs.unlink(tmpPath, (e) => {
    //         console.log("unlink", e);
    //     });
    // }

    // let downloadLength = 0;
    // @ts-ignore
    const streamToBuffer = (stream, total) => {
        return new Promise((resolve, reject) => {
            if (!(stream instanceof ReadableStream)) {
                reject(
                    "Expected stream to be instance of ReadableStream, but got " + typeof stream
                );
            }
            let chunks: Uint8Array[] = [];
            const reader = stream.getReader();
            // @ts-ignore
            const processRead = ({ done, value }) => {
                if (done) {
                    resolve(Buffer.concat(chunks));
                    // nodeFs.rename(tmpPath, savePath, function (err) {});
                    // return savePath;
                    return;
                }
                chunks.push(value);

                // nodeFs.appendFile(tmpPath, Buffer.concat(value) , function (err) {
                //     downloadLength += value.length;
                //     console.log("download  append file , ", err);
                // });
                handler && handler({ total, loaded: Buffer.concat(chunks).length });
                // handler && handler({ total, loaded: downloadLength });
                reader.read().then(processRead);
            };
            reader.read().then(processRead);
        });
    };

    try {
        const response = await s3.send(
            new GetObjectCommand({ Bucket: bucketInfo.bucket_name, Key: validKey })
        );
        const binary = await streamToBuffer(response.Body, response.ContentLength);

        // @ts-ignore, compatible old code (The old code response with binary of Blob Object, now response with Buffer)
        binary.size = binary.length;

        return binary;
    } catch (e) {
        console.error(e);
        if (!isThumb) return false;
        const token = sessionStorage.getItem("apiToken");
        const baseUrl = bucketInfo.crop_host;
        const originalUrl =
            (baseUrl + validKey).replace(/\\/g, "/") +
            "&bucket=" +
            bucketInfo.bucket_name +
            "&ver=2";
        try {
            await axios(originalUrl, {
                headers: { token },
                responseType: "blob",
            });
            const response = await s3.send(
                new GetObjectCommand({ Bucket: bucketInfo.bucket_name, Key: validKey })
            );
            // @ts-ignore
            const binary = streamToBuffer(response.Body);
            // @ts-ignore, compatible old code (The old code response with binary of Blob Object, now response with Buffer)
            binary.size = binary.length;
            return binary;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
};

const getThumb = (fileInfo: FileInfo, thumbInfo: ThumbInfo, handler = () => {}) => {
    const thumbKey = `${fileInfo.filename}_${thumbInfo.width}_${thumbInfo.height}_${
        thumbInfo.isBig === undefined ? 1 : 2
    }`;

    return getObjectByKey({ ...fileInfo, filename: thumbKey }, handler, true);
};

const getFileObject = async (key: FileInfo, handler?: ProgressHandler) => {
    console.log("getFileObject");
    if (!key.filename || !key.fileType) return false;

    const { s3_bucket_id } = await getBasicBucketInfo();

    let bucketInfo;
    if (key.bucketID && key.bucketID !== s3_bucket_id) {
        bucketInfo = await getBucketInfoById(key.bucketID as string);
    } else {
        bucketInfo = await getBucketInfo();
    }
    const s3 = await s3Client(bucketInfo.region);
    const validKey = `${key.filename}.${key.fileType}`;
    const cacheRoot = nodePath.join(osenv.home(), `./Documents/TmmTmm Files`);
    const fullPath = nodePath.join(cacheRoot, `${key.filename}.${key.fileType}`);
    let tmpFilePath = cacheRoot + `/tmp/` + md5(key.filename);
    await createDir(tmpFilePath);
    if (nodeFs.existsSync(tmpFilePath)) {
        nodeFs.unlink(tmpFilePath, (e) => {
            console.log("unlink", e);
        });
    }

    let downloadLength = 0;
    // @ts-ignore
    const streamToBuffer = (stream, total) => {
        return new Promise((resolve, reject) => {
            if (!(stream instanceof ReadableStream)) {
                reject(
                    "Expected stream to be instance of ReadableStream, but got " + typeof stream
                );
            }
            const reader = stream.getReader();
            // @ts-ignore
            const processRead = async ({ done, value }) => {
                if (done) {
                    try {
                        await checkRootDir();
                        await createDir(fullPath);
                        nodeFs.promises.rename(tmpFilePath, fullPath);
                        resolve(fullPath);
                        return;
                    } catch (error) {
                        console.log(error);
                    }
                }
                // chunks.push(value);
                try {
                    let chunk: Uint8Array[] = [];
                    chunk.push(value);
                    const binary = await formatSource(Buffer.concat(chunk));
                    if (binary) await nodeFs.promises.appendFile(tmpFilePath, binary);
                    if (value) downloadLength += value.length;
                    handler && handler({ total, loaded: downloadLength });
                    // console.log(
                    //     "download  append file , ",
                    //     parseInt((downloadLength / total) * 100 + "")
                    // );
                    chunk = [];
                    reader.read().then(processRead);
                } catch (error) {
                    console.log("getFileObject", error);
                }
            };
            reader.read().then(processRead);
        });
    };

    try {
        const response = await s3.send(
            new GetObjectCommand({ Bucket: bucketInfo.bucket_name, Key: validKey })
        );

        const savePath = await streamToBuffer(response.Body, response.ContentLength);
        const params = {
            Bucket: bucketInfo.bucket_name,
            Key: validKey,
        };
        // let readStream = s3.getObject(params);
        // readStream.c
        // let writeStream = fs.createWriteStream(path.join(__dirname, 's3data.txt'));
        // readStream.pipe(writeStream);

        return savePath;
    } catch (error) {
        console.log(error);
    }
};

export { getThumb, getObjectByKey, getFileObject };

export default getObjectByKey;
