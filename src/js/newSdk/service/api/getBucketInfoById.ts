import axios from "@newSdk/service/apiCore/tmmNoTokenCore";
import bucketInfoModel, { BucketInfoType } from "@newSdk/model/BucketInfo";

async function getBucketInfo(bucket_id: string) {
    const REQUEST_API = "/bucketInfo";
    try {
        const {
            data: { items: response },
        } = await axios({
            url: REQUEST_API,
            method: "POST",
            data: { bucket_id },
        });
        return response;
    } catch (e) {
        console.error(e);
        return false;
    }
}

const memorize = (func: Function) => {
    const memorized: Record<string, object> = {};
    return async (id: string) => {
        const source = memorized[id];
        if (source) {
            // pending
            if (source instanceof Promise) return source;

            // check expiry
            try {
                const { expire } = source as BucketInfoType;
                // target
                if (!bucketInfoModel.isExpired(parseInt(expire))) return source;
                else delete memorized[id];
            } catch (e) {
                console.error(e);
                // refresh
            }
        }

        // refresh cache
        const res = func(id);

        // set promise
        memorized[id] = res;

        // update info
        return await res.then((info: any) => {
            memorized[id] = info;
            return info;
        });
    };
};

export default memorize(getBucketInfo);
