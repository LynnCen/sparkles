import { s3Client as S3 } from "@newSdk/service/api/s3Client/libs/s3Client";
import getBucketInfo from "@newSdk/logic/getBucketInfo";

const isKeyExists = async (key: string, region: string = "", host: string = "") =>
    new Promise(async (resolve) => {
        try {
            const data = await getBucketInfo();

            const s3Client = await S3(region || data.region);

            const res = await s3Client.headObject({ Bucket: data.bucket_name, Key: key });
            resolve(res.$metadata.httpStatusCode === 200);
        } catch (e) {
            resolve(false);
        }
    });

export default isKeyExists;
