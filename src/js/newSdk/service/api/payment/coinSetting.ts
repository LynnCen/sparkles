import { tmmPaymentAxios } from "@newSdk/service/apiCore/tmmPaymentCore";

export type CoinSettingItemProps = {
    id: string;
    service_amount: number;
    pla_service_amount: number;
    min_withdraw_amount: number;
    max_withdraw_amount: number;
    max_gift_amount: number;
    max_transfer_amount: number;
    price: number;
};

export const coinSetting = (coin_ids: string[]) =>
    tmmPaymentAxios<Array<CoinSettingItemProps>>({
        url: "/coinSetting",
        method: "post",
        data: {
            coin_ids,
        },
    });

export default coinSetting;
