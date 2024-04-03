import { BucketInfoType } from "../model/BucketInfo";
import bucketInfo from "../model/BucketInfo";
import nc from "../notification/index";
import eventTypes from "../notification/eventTypes";
import getBucketInfoFromApi from "../service/api/getBucketInfo";
import getBasicBucketInfo from "@newSdk/logic/getBasicBucketInfo";

async function getBucketInfo(): Promise<BucketInfoType> {
    /**
     *
     * 1、if bucket is valid, return directly
     *
     * 2、else add event listener and resolve the result
     *
     * 3、get the bucketFromApi
     */
    if (bucketInfo.bucket) return Promise.resolve(bucketInfo.bucket);

    return await new Promise(async (resolve, reject) => {
        /**
         * resolve
         */
        nc.removeObserve(eventTypes.BucketChanged, resolve);
        nc.addObserver(eventTypes.BucketChanged, resolve);
        try {
            const { s3_bucket_id } = await getBasicBucketInfo();
            await getBucketInfoFromApi(s3_bucket_id);
        } catch (e) {
            reject(e);
        }
    });
}

export default getBucketInfo;
