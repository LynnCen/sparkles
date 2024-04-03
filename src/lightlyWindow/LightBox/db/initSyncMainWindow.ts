import Dexie from "dexie";
import { UserInfoProps } from "@newSdk/model/UserInfo";

// dependency
import MessageModel from "@newSdk/model/Message";
import BucketInfoModel from "@newSdk/model/BucketInfo";
import { dbVersion, Schema } from "@newSdk/model/config";
import init from "@newSdk/model/index";
import { initPublicDB } from "@newSdk/model/public/index";

export default async (UserInfo: UserInfoProps) => {
    try {
        if (!UserInfo || !UserInfo._id) return false;

        // const db = await new Dexie(UserInfo._id).open();
        // db.version(dbVersion).stores(Schema);
        // await MessageModel.init(db);
        // await BucketInfoModel.init(db);
        await initPublicDB();
        await init(UserInfo._id);

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};
