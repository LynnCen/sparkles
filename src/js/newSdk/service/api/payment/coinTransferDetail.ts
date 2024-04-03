import { tmmPaymentAxios } from "@newSdk/service/apiCore";

export type ResponseCoinTransferDetailProps = {
    out_trade_no: string;
    from_id: string;
    to_id: string;
    coin_id: string;
    amount: number;
    description: string;
};

export const coinWithdrawDetail = (out_trade_no: string[]) => {
    return tmmPaymentAxios<Array<ResponseCoinTransferDetailProps>>({
        url: "/coinTransferDetail",
        method: "post",
        data: {
            out_trade_no,
        },
    });
};

export default coinWithdrawDetail;
