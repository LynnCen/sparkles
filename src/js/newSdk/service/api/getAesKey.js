import axios from "../apiCore/tmmCore";
import { encrypt } from "../../../ui/utils/encryp_util";
import allNets from "@newSdk/service/nets/Nets";
import { tmmBase } from "@newSdk/service/apiBase/tmmBase";

const REQUEST_API = "/getKey";
const os = process.platform === "darwin" ? 1 : 2;

async function getAesKey() {
    try {
        const { data } = await axios({
            url: REQUEST_API,
            method: "POST",
        });
        const netInfo = allNets.getNetByBaseUrl(tmmBase.baseUrl);
        const token = await netInfo.getNetToken();
        const delimiter = "|";
        const { key, opening_uid, expire } = data;
        return {
            expire: expire,
            code: window.btoa(
                [opening_uid, os, encrypt([token, Date.now()].join(delimiter), key)].join(delimiter)
            ),
        };
    } catch (e) {
        console.log(e);
    }
}
export default getAesKey;
