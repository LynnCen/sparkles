import { action, computed, observable } from "mobx";
import withDrawBillDetailModal from "@newSdk/model/payment/WithDrawal";
import load_coinWithdrawDetail_throttle from "@newSdk/logic/payment/load_coinWithdrawDetail_throttle";
import nc from "@newSdk/notification";
import { TransitionType } from "@newSdk/model/MessageType";
import rechargeDetailModal from "@newSdk/model/payment/Recharge";
import load_rechargeDetail_throttle from "@newSdk/logic/payment/load_rechargeDetail_throttle";

class TmmPayProxy {
    @observable billDetails = {};

    // keep value and key equals, for validate is aspect key. line: 40
    billEnum = {
        CoinWithDraw: "CoinWithDraw", // 提现
        Recharge: "Recharge", // 充值
        CoinTransferDetail: "CoinTransferDetail", // 转账
    };

    pending = new Map();
    throttleInterval = 200;
    throttleTimer = null;

    addObservers() {
        nc.addObserver(rechargeDetailModal.Event.change, self.setDetail);
        nc.addObserver(withDrawBillDetailModal.Event.change, self.setDetail);
    }

    removeObserver() {
        self.billDetails = {};
        nc.removeObserve(rechargeDetailModal.Event.change, self.setDetail);
        nc.removeObserve(withDrawBillDetailModal.Event.change, self.setDetail);
    }

    @action setDetail(items) {
        const newDetails = {};
        items.forEach((item) => {
            newDetails[item.id] = item;
        });

        self.billDetails = {
            ...self.billDetails,
            ...newDetails,
        };
    }

    @computed get getBillDetailsByTradeNo() {
        const info = self.billDetails;

        return (tradeNo) => {
            return info[tradeNo] || {};
        };
    }

    // todo::
    getBillTypeByAct(act) {
        const map = {
            [self.billEnum.CoinWithDraw]: [
                TransitionType.WithDrawCost,
                TransitionType.WithDrawBack,
                TransitionType.WithDrawServices,
                TransitionType.WithDrawServicesBack,
            ],
            [self.billEnum.Recharge]: [TransitionType.Recharge],
            // [self.billEnum.CoinTransferDetail]: [
            //     TransitionType.Transition,
            //     TransitionType.ScanAndQrCode,
            // ],
        };

        for (let k in map) {
            const v = map[k];

            if (v.includes(act)) return k;
        }
    }

    getDetails(id, act) {
        const aspectKeys = Object.keys(self.billEnum);

        const billType = self.getBillTypeByAct(act);

        if (!billType) return console.error("----------->> invalid bill act");
        if (!aspectKeys.includes(billType) || !id) return;

        if (self.billDetails[id]) return;
        self.billDetails[id] = {};

        const billSet = self.pending.get(billType);
        if (!billSet) self.pending.set(billType, new Set());

        self.addThrottleQueue(id, billType);
    }

    addThrottleQueue(id, billType) {
        self.pending.get(billType).add(id);

        if (self.throttleTimer) clearTimeout(self.throttleInterval);

        self.throttleTimer = setTimeout(self.fetchDetails, self.throttleInterval);
    }

    fetchDetails() {
        // todo::
        const handlers = {
            [self.billEnum.CoinWithDraw]: self.fetchCoinWithdrawDetail,
            [self.billEnum.Recharge]: self.fetchRechargeDetail,
        };

        self.pending.forEach((value, key) => {
            const handle = handlers[key];
            const ids = Array.from(value || []);
            if (handle && ids.length) {
                handle(ids);
            }
        });
        self.pending.clear();
    }

    // pull withdraw detail
    async fetchCoinWithdrawDetail(ids) {
        const details = await withDrawBillDetailModal.bulkGet(ids);

        if (details.length === ids.length) return self.setDetail(details);

        // not exist
        const existIds = details.map((item) => item.id);
        const unExistIds = ids.filter((id) => !existIds.includes(id));

        // fetch
        if (unExistIds.length) return load_coinWithdrawDetail_throttle(unExistIds);
    }

    // pull recharge detail
    async fetchRechargeDetail(ids) {
        const details = await rechargeDetailModal.bulkGet(ids);
        if (details.length === ids.length) return self.setDetail(details);

        // not exist
        const existIds = details.map((item) => item.id);
        const unExistIds = ids.filter((id) => !existIds.includes(id));

        // fetch
        if (unExistIds.length) return load_rechargeDetail_throttle(unExistIds);
    }
}

const self = new TmmPayProxy();
export default self;
