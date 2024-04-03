import coinList, { CoinListItemProps } from "@newSdk/service/api/payment/coinList";
import coinModal, { CoinItemProps } from "@newSdk/model/payment/Coin";
import coinSetting, { CoinSettingItemProps } from "@newSdk/service/api/payment/coinSetting";
import { mergeObArray } from "@newSdk/utils";

export const initCoinConfig = async () => {
    try {
        const coins = await coinList();
        const {
            data: { items },
        } = coins;

        const coinIds = items.map((item) => item.id);

        const {
            data: { items: coinDetails },
        } = await coinSetting(coinIds);

        const data: Array<CoinListItemProps & CoinSettingItemProps> = mergeObArray(
            items,
            coinDetails,
            "id"
        );

        const formatItems = data.map(coinModal.transformCoinItemProps);

        coinModal.bulkPut(formatItems);
    } catch (e) {
        console.dir(e);
    }
};

export default initCoinConfig;
