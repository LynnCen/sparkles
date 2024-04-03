import Dexie, { Table } from "dexie";
import FriendReqModel, { FriendReq } from "../../model/FriendsReqModel";
import Members from "@newSdk/model/Members";
import moment from "moment";
import { sortBy } from "lodash";

class FriendsReq {
    storeDB?: Table<FriendReq, string>;
    changes: Function[] = [];
    init(db: Dexie) {
        this.storeDB = db.table("friendReqs");
    }

    bulkPut(vals: FriendReq[]) {
        this.storeDB?.bulkPut(vals).then(this.inform);
    }

    async getApplyWithinOneMonth() {
        const dayBefore30 = moment().subtract(30, "day").valueOf();
        try {
            return (await this.storeDB?.where("createTime").above(dayBefore30).toArray()) || [];
        } catch (e) {
            console.error("---> get friends request fail", e);
            return [];
        }
    }
    async bulkGet() {
        const dayBefore30 = moment().subtract(30, "day").valueOf();
        try {
            let allItem = await this.storeDB?.where("createTime").above(dayBefore30).toArray();
            if (allItem && allItem.length) {
                return await Promise.all(
                    sortBy(allItem, ["createTime"])
                        .reverse()
                        .map(async (data) => {
                            const { uid, createTime, applyId, status } = data;
                            const user = await Members.getMemberById(uid);

                            return new FriendReqModel(applyId, uid, createTime, status, user);
                        })
                );
            }
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    update(id: string, changes: { [k in keyof FriendReq]?: FriendReq[k] }) {
        return this.storeDB?.update(id, changes);
    }

    inform() {
        this.changes.forEach((item: Function) => item());
    }

    subscribe(fn: Function) {
        this.changes.push(fn);
    }

    unsubscribe(fn: Function) {
        this.changes = this.changes.filter((item) => item !== fn);
    }
}

export default new FriendsReq();
