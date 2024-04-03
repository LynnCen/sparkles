import getCoinRechargeDetail from "@newSdk/service/api/payment/getCoinRechargeDetail";
import rechargeDetailModal from "@newSdk/model/payment/Recharge";

export const load_coinWithdrawDetail_throttle = (() => {
    let throttleTimer: any = null;
    const throttleInterval = 200;
    const orderSet = new Set<string>();

    return (orderList: string[]) =>
        new Promise((resolve) => {
            if (throttleTimer) clearTimeout(throttleTimer);

            orderList.forEach((no) => orderSet.add(no));

            throttleTimer = setTimeout(() => {
                const list = Array.from(orderSet);
                orderSet.clear();
                throttleTimer = null;
                resolve(_handleFetchRechargeDetail(list));
            }, throttleInterval);
        });
})();

const _handleFetchRechargeDetail = async (list: string[]) => {
    try {
        const {
            data: { items },
        } = await getCoinRechargeDetail(list);

        const formatData = items.map(rechargeDetailModal.rechargeTransfer);
        console.log(formatData);
        rechargeDetailModal.bulkPut(formatData);
    } catch (e) {
        console.log("throw error ---->>", e);
        return [];
    }
};

export default load_coinWithdrawDetail_throttle;
