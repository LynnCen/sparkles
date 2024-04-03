/**
 * @Author Pull
 * @Date 2021-01-24 15:35
 * @project intlSystemNotification
 */
import { IntlConfig } from "../../config";
import settings from "../stores/settings";

export default (() => {
    const packageMap = new Map();
    IntlConfig.forEach(({ name, packages }) => {
        packageMap.set(name, packages);
    });

    return function formatMessage({ id, data = {} }, d2 = {}) {
        const locale = packageMap.get(settings.locale) || {};
        let localStr = locale[id] || "";

        const info = Object.assign(data, d2);
        for (let key in info) {
            const reg = new RegExp(`((?:{{|{)\\s*${key}\\s*(?:}}|}))`, "img");
            localStr = localStr.replace(reg, info[key]);
        }
        return localStr;
    };
})();
