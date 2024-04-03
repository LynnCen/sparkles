import { S3 } from "@aws-sdk/client-s3";
import getBucketInfo from "@newSdk/logic/getBucketInfo";

async function s3Client(region: string = "") {
    // get basic info first
    const data = await getBucketInfo();
    const { sts } = data;
    if (!data || !sts) throw Error("init failed");

    const client = new S3({
        region: region || data.region,
        endpoint: {
            hostname: `s3-accelerate.amazonaws.com`,
            protocol: "https",
            path: "",
        },
        credentials: {
            accessKeyId: sts.access_key_id,
            secretAccessKey: sts.access_key_secret,
            sessionToken: sts.session_token,
        },
    });

    return client;
}

export { s3Client };
