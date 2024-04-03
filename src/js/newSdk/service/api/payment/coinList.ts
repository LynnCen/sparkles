import { tmmPaymentAxios } from "@newSdk/service/apiCore/tmmPaymentCore";
import { AvatarPropsCom } from "@newSdk/typings";

export type CoinListItemProps = {
    id: string;
    name: string;
    logo: AvatarPropsCom;
    chain: string;
    description: string;
    decimal: number;
    is_def: number;
    status: number;
};
export const coinList = async () =>
    tmmPaymentAxios<Array<CoinListItemProps>>({
        url: "/coinList",
        method: "post",
        data: {},
    });

export default coinList;
