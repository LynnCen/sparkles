import Dexie, { Table } from "dexie";
import getBasicBucketInfo from "@newSdk/service/api/getBasicBucketInfo";

type CloudType = string;
type Region = string;
type ExpireTime = string;

export type BucketInfoType = {
    base_host: string;
    region: Region;
    bucket_name: string;
    sts: StsType;
    expire: ExpireTime;
    crop_host: string;
};

export type StsType = {
    access_key_id: string;
    access_key_secret: string;
    expire: number;
    session_token: string;
};

export type AwsBasicInfo = {
    s3_bucket: string;
    s3_region: string;
    s3_bucket_id: string;
};

class BucketInfo {
    public db?: Dexie;
    public bucketInfo?: Table<BucketInfoType>;
    private validBucket: BucketInfoType | null = null;
    private basicAwsInfo: AwsBasicInfo | null = null;
    static authorize = false;
    private bufferTime = 300000;

    async init(db: Dexie) {
        this.db = db;
        this.bucketInfo = db.table("bucketInfos");
        BucketInfo.authorize = true;
        await this.initBucketInfo();
    }

    isExpired(num: number) {
        return Date.now() + this.bufferTime > num;
    }

    get bucket() {
        if (
            !this.basicBucketInfo ||
            (this.validBucket && this.isExpired(Number(this.validBucket.expire)))
        )
            return null;
        return this.validBucket;
    }

    lastBucketInfo(id: string) {
        // Todo need performance optimize
        return this.bucketInfo
            ?.where("bucket_id")
            .equals(id)
            .last()
            .then((bucket) => {
                if (!bucket) return (this.validBucket = null);
                const isExpire = this.isExpired(Number(bucket.expire));
                this.validBucket = isExpire ? null : bucket;
            });
    }

    addNewBucketInfo(data: BucketInfoType) {
        return this.bucketInfo?.put(data).then(() => {
            this.validBucket = data;
        });
    }

    async initBucketInfo() {
        const response = await getBasicBucketInfo();
        this.setAwsBasicInfo(response);
        await this.lastBucketInfo(response.s3_bucket_id);
    }

    setAwsBasicInfo(info: AwsBasicInfo) {
        this.basicAwsInfo = info;
    }

    get basicBucketInfo() {
        return this.basicAwsInfo;
    }
}

const bucketInfo = new BucketInfo();

export default bucketInfo;
