import Dexie from "dexie";
import template from "./IntlTemplate";
import { dbVersion, publicSchema } from "../config";
import bucketInfo from "@newSdk/model/BucketInfo";
import getBucketInfo from "@newSdk/logic/getBucketInfo";

const db = new Dexie("public");

export const initPublicDB = async () => {
    try {
        if (!db.isOpen()) {
            db.version(dbVersion).stores(publicSchema);
            await template.init(db);
            await bucketInfo.init(db as Dexie);
            await getBucketInfo();
        }
    } catch (e) {
        console.error(e);
    }
};
