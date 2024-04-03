import { tmmPaymentAxios } from "@newSdk/service/apiCore/tmmPaymentCore";

export type ResponseRechargeDetail = {
    out_trade_no: string;
    txid: string;
    tx_index: string;
    address: string;
    coin_id: string;
    chain: string;
    uid: string;
    amount: number;
    pay_time: number;
};
export const getCoinRechargeDetail = (out_trade_no: string[]) =>
    tmmPaymentAxios<Array<ResponseRechargeDetail>>({
        url: "/getCoinRechargeDetail",
        method: "post",
        data: {
            out_trade_no,
        },
    });

export default getCoinRechargeDetail;
