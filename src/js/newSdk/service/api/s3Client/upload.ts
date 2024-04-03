import { s3Client as S3 } from "./libs/s3Client";
// @ts-ignore
import fs from "fs";
import getBasicBucketInfo from "@newSdk/logic/getBasicBucketInfo";
import { Upload } from "@aws-sdk/lib-storage";
import isKeyExists from "./isExist";

const upload = async (file: string | Blob, savedname: string, onProgress?: Function) => {
    const s3Client = await S3();
    const s3Basic = await getBasicBucketInfo();
    const fileStream = file instanceof Blob ? file.stream() : fs.createReadStream(file);

    // if it exist
    try {
        const res = await isKeyExists(savedname);
        if (res) return s3Basic.s3_bucket_id;
    } catch (e) {
        //
    }

    try {
        const createParams = {
            Bucket: s3Basic.s3_bucket,
            Key: savedname,
            Body: fileStream,
        };

        let upload = new Upload({
            // @ts-ignore
            client: s3Client,
            params: createParams,
        });

        // @ts-ignore
        upload.on("httpUploadProgress", (progress: ProgressEvent) => {
            onProgress && onProgress(progress);
            // console.log(progress);
        });

        const uploadResult = await upload.done();
        return s3Basic.s3_bucket_id;
    } catch (err) {
        console.log("Error", err);
        return false;
    }
};

export default upload;
