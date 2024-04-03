import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";
import { ResponseWithdrawBillProps } from "@newSdk/service/api/payment/coinWithdrawDetail";
import { TABLE_NAME } from "@newSdk/model/config";

export type WithDrawBillProps = {
    id: string;
    fromId: string;
    address: string;
    coinId: string;
    amount: number;
    serAmount: number;
    outSerAmount: number;
    txId: string;
    description: string;
    refundDesc: string;
    refundTime: number;
    status: number;
    createTime: number;
};
class WithDraw {
    static authorize = false;
    static dbName = TABLE_NAME.WITHDRAW_BILL;
    private db?: Dexie;
    private store?: Table<WithDrawBillProps, string>;
    Event = {
        change: "withDrawBill_change",
    };

    init(db: Dexie) {
        this.db = db;
        this.store = db.table(WithDraw.dbName);
        WithDraw.authorize = true;
    }

    bulkPut(list: WithDrawBillProps[]) {
        this.store?.bulkPut(list).then(() => withDrawBillDetailModal.publish(list));
    }

    async bulkGet(ids: string[]) {
        const data = await this.store?.where("id").anyOf(ids).toArray();
        return data || [];
    }

    billTransfer(item: ResponseWithdrawBillProps): WithDrawBillProps {
        return {
            id: item.out_trade_no,
            fromId: item.from_id,
            address: item.address,
            coinId: item.coin_id,
            amount: item.amount,
            serAmount: item.service_amount,
            outSerAmount: item.out_service_amount,
            txId: item.txid,
            description: item.description,
            refundDesc: item.refund_desc,
            refundTime: item.refund_time,
            status: item.status,
            createTime: item.create_time,
        };
    }

    publish(list: WithDrawBillProps[]) {
        nc.publish(this.Event.change, list);
    }
}

export const withDrawBillDetailModal = new WithDraw();

export default withDrawBillDetailModal;
