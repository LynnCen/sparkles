import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";
import { ResponseRechargeDetail } from "@newSdk/service/api/payment/getCoinRechargeDetail";
import { TABLE_NAME } from "@newSdk/model/config";

export type RechargeBillProps = {
    id: string;
    // address: string;
    txid: string;
};
class Recharge {
    static authorize = false;
    static dbName = TABLE_NAME.RECHARGE_BILL;
    private db?: Dexie;
    private store?: Table<RechargeBillProps, string>;
    Event = {
        change: `${TABLE_NAME.RECHARGE_BILL}_change`,
    };

    init(db: Dexie) {
        this.db = db;
        this.store = db.table(Recharge.dbName);
        Recharge.authorize = true;
    }

    bulkPut(list: RechargeBillProps[]) {
        this.store?.bulkPut(list).then(() => {
            rechargeDetailModal.publish(list);
        });
    }

    async bulkGet(ids: string[]) {
        const data = await this.store?.where("id").anyOf(ids).toArray();
        return data || [];
    }

    rechargeTransfer(item: ResponseRechargeDetail): RechargeBillProps {
        return {
            id: item.out_trade_no,
            txid: item.txid,
        };
    }

    publish(list: RechargeBillProps[]) {
        nc.publish(this.Event.change, list);
    }
}

export const rechargeDetailModal = new Recharge();

export default rechargeDetailModal;
