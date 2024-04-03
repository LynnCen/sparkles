import { observable, action, computed } from "mobx";
import nc from "@newSdk/notification";
import coinModal from "@newSdk/model/payment/Coin";

class CoinConfig {
    @observable coinConfig = {};

    pending = new Set();
    throttleTimer = null;
    throttleInterval = 200;

    addObservers() {
        nc.addObserver(coinModal.Event.change, self.setCoinConfig);
    }

    removeObservers() {
        nc.removeObserve(coinModal.Event.change, self.setCoinConfig);
    }

    @action
    setCoinConfig(configs, fn = "event") {
        let ob = {};

        configs.forEach((item) => (ob[item.id] = item));

        self.coinConfig = {
            ...self.coinConfig,
            ...ob,
        };
    }

    @computed get getTruthyAmount() {
        const configs = self.coinConfig;

        return (amount, coinId) => {
            const coinInfo = configs[coinId];
            const { decimal } = coinInfo;
            if (decimal == undefined) return amount;

            console.log(`-----> str`, str);
            const str = (amount / 10 ** decimal).toFixed(decimal);

            // 去掉末尾的0
            return str.replace(/([\.]0+)$/gi, "");
        };
    }

    getCoinConfig(coinId) {
        if (self.coinConfig[coinId]) return;

        self.coinConfig[coinId] = {};
        self.pending.add(coinId);

        self.handleFetch();
    }

    handleFetch() {
        if (self.throttleTimer) clearTimeout(self.throttleTimer);

        self.throttleTimer = setTimeout(self.fetch, self.throttleInterval);
    }

    async fetch() {
        const idList = Array.from(self.pending);
        if (!idList.length) return;

        const configs = await coinModal.bulkGetCoinDetail(idList);
        self.setCoinConfig(configs, "fetch");
    }
}

const self = new CoinConfig();
export default self;
