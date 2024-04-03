import allBase from "@newSdk/service/apiBase/allBase";
import { Net } from "@newSdk/service/nets/Net";
import TokenModel from "@newSdk/model/Token";
import nc from "@newSdk/notification";
class Nets {
    allNets: Record<string, Net> = {};

    constructor() {
        allBase.forEach((baseUrl) => {
            this.allNets[baseUrl] = new Net(baseUrl);
        });
    }

    getNetByBaseUrl(baseUrl: string) {
        const res = this.allNets[baseUrl];
        if (!res) {
            const net = new Net(baseUrl);
            this.allNets[baseUrl] = net;
            return net;
        }

        return res;
    }

    public clearCache() {
        this.allNets = {};
    }
}

const allNets = new Nets();
export default allNets;
