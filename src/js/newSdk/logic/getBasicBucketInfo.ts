import { AwsBasicInfo } from "../model/BucketInfo";
import bucketInfo from "../model/BucketInfo";
import nc from "../notification/index";
import eventTypes from "../notification/eventTypes";
import getBasicBucketInfoFromApi from "@newSdk/service/api/getBasicBucketInfo";

async function getBasicBucketInfo(): Promise<AwsBasicInfo> {
    /**
     *
     * 1、if basicBucketInfo is valid, return directly
     *
     * 2、else add event listener and resolve the result
     *
     * 3、get the bucketFromApi
     */
    if (bucketInfo.basicBucketInfo) return Promise.resolve(bucketInfo.basicBucketInfo);

    return await new Promise((resolve, reject) => {
        /**
         * resolve 放入事件回调逻辑
         */
        nc.addObserver(eventTypes.BasicBucketChanged, (response) => {
            resolve(response);
        });

        getBasicBucketInfoFromApi();
    });
}

export default getBasicBucketInfo;
