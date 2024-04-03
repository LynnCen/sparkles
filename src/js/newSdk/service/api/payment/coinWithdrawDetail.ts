import { tmmPaymentAxios } from "@newSdk/service/apiCore/tmmPaymentCore";

export type ResponseWithdrawBillProps = {
    out_trade_no: string;
    from_id: string;
    address: string;
    coin_id: string;
    amount: number;
    service_amount: number;
    out_service_amount: number;
    txid: string;
    description: string;
    refund_desc: string;
    refund_time: number;
    status: number;
    create_time: number;
    update_time: number;
};

export const coinWithdrawDetail = (out_trade_no: string[]) => {
    return tmmPaymentAxios<Array<ResponseWithdrawBillProps>>({
        url: "/coinWithdrawDetail",
        method: "post",
        data: {
            out_trade_no,
        },
    });
};

export default coinWithdrawDetail;
