/*
 * getBucketBasicInfo from server
 */

import axios from "../apiCore/tmmNoTokenCore";
import bucketInfo, { AwsBasicInfo } from "../../model/BucketInfo";
import nc from "../../notification";
import eventTypes from "../../notification/eventTypes";

const REQUEST_API = "/startBucket";

let isRequest = false;

async function getBasicBucketInfo() {
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
        });
        // add response to Model
        bucketInfo.setAwsBasicInfo((response as unknown) as AwsBasicInfo);
        nc.publish(eventTypes.BasicBucketChanged, response);
        return response;
    } catch (e) {
        console.log(e);
    } finally {
        isRequest = false;
    }
}
export default getBasicBucketInfo;
