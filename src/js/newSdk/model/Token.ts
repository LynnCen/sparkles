import Dexie, { Table } from "dexie";

type TokenPrototype = {
    baseUrl: string;
    token: string;
};

const EMPTY_TOKEN = "";

class Token {
    private store?: Table<TokenPrototype, string>;

    private tokenCacheMap = new Map();

    init(db: Dexie) {
        this.store = db.table("token");
        this.tokenCacheMap.clear();
    }

    async getToken(baseUrl: string) {
        let token = this.tokenCacheMap.get(baseUrl);
        if (!token) token = (await this.store?.get(baseUrl))?.token || EMPTY_TOKEN;
        return token;
    }

    async setToken(baseUrl: string, token: string) {
        try {
            if (!this.store) return false;
            await this.store.put({ baseUrl, token }).then(() => {
                this.tokenCacheMap.set(baseUrl, token);
            });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async cleanTokenByKey(baseUrl: string) {
        this.store
            ?.update(baseUrl, { token: EMPTY_TOKEN })
            .then(() => this.tokenCacheMap.set(baseUrl, EMPTY_TOKEN));
    }
}

const self = new Token();

export default self;
