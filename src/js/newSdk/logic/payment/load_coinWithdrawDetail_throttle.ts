import coinWithdrawDetail from "@newSdk/service/api/payment/coinWithdrawDetail";
import withDrawBillDetailModal from "@newSdk/model/payment/WithDrawal";

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
                resolve(_handleFetchBillDetail(list));
            }, throttleInterval);
        });
})();

const _handleFetchBillDetail = async (list: string[]) => {
    try {
        const {
            data: { items },
        } = await coinWithdrawDetail(list);

        const formatData = items.map(withDrawBillDetailModal.billTransfer);
        withDrawBillDetailModal.bulkPut(formatData);
    } catch (e) {
        return [];
    }
};

export default load_coinWithdrawDetail_throttle;
