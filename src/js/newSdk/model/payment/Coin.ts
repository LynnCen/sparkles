import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";
import { CoinListItemProps } from "@newSdk/service/api/payment/coinList";
import { CoinSettingItemProps } from "@newSdk/service/api/payment/coinSetting";
import { TABLE_NAME } from "@newSdk/model/config";

export type CoinItemProps = {
    id: string;
    decimal: number;
    status: number;
    price: number;
};
class Coin {
    static authorize = false;
    static dbName = TABLE_NAME.COIN_CONFIG;
    private db?: Dexie;
    private store?: Table<CoinItemProps, string>;
    Event = {
        change: "coinConfig_change",
    };

    init(db: Dexie) {
        coinModal.db = db;
        coinModal.store = db.table(Coin.dbName);
        Coin.authorize = true;
    }

    bulkPut(list: CoinItemProps[]) {
        coinModal.store
            ?.bulkPut(list)
            .then(() => {
                coinModal.publish(list);
            })
            .catch((e) => {
                console.log("fa");
            });
    }

    async bulkGetCoinDetail(ids: string[]) {
        try {
            const coin = await coinModal.store?.where("id").anyOf(ids).toArray();
            return coin || [];
        } catch (e) {
            return [];
        }
    }

    publish(list: CoinItemProps[]) {
        nc.publish(coinModal.Event.change, list, "publish");
    }

    transformCoinItemProps(item: CoinListItemProps & CoinSettingItemProps): CoinItemProps {
        const { id, status, price, decimal } = item;

        return {
            id,
            status,
            price,
            decimal,
        };
    }
}

export const coinModal = new Coin();

export default coinModal;
