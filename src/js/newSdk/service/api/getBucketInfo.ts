/*
 * getBucketInfo from server
 */

import axios from "../apiCore/tmmNoTokenCore";
import bucketInfo, { BucketInfoType } from "../../model/BucketInfo";
import nc from "../../notification";
import eventTypes from "../../notification/eventTypes";

const REQUEST_API = "/bucketInfo";

let isRequest = false;

async function getBucketInfo(bucket_id: string) {
    // if is requesting, return directly
    if (isRequest) return;
    //request from server
    try {
        isRequest = true;

        const {
            data: { items: response },
        } = await axios({
            url: REQUEST_API,
            method: "POST",
            data: { bucket_id },
        });
        // add response to DB
        bucketInfo.addNewBucketInfo(response as any)?.then(() => {
            nc.publish(eventTypes.BucketChanged, response);
        });
    } catch (e) {
        console.log(e);
    } finally {
        isRequest = false;
    }
}
export default getBucketInfo;
