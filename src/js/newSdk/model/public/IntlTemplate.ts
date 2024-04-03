import Dexie, { Table } from "dexie";
import { Message } from "@newSdk/model/Message";

interface IntlTemp {
    lang: string;
    id: string;
    content: {
        target: string;
        operator: string;
        other: string;
        [key: string]: string;
    };
}

interface IntlParseData {
    tmp_id: string;
    inviter?: string[];
    target?: string[];
    [props: string]: any;
}

class IntlTemplate {
    private db?: Dexie;
    private store?: Table<IntlTemp, number>;

    private supportLanguage = {
        "ZH-TW": "cn",
        "zh-CN": "cn",
        en: "en",
        tr: "tr",
    };

    private defaultLanguage = "en";

    // constructor(db: Dexie) {
    //     this.db = db;
    //     this.store = db.table("intlTemplate");
    // }

    init(db: Dexie) {
        this.db = db;
        this.store = db.table("intlTemplate");
    }

    async bulkPutData(list: IntlTemp[]) {
        await this.store?.bulkPut(list).catch(console.error);
    }

    async getTempByIdAndLang(action: string, lang: string) {
        if (!action) return false;
        const { supportLanguage, defaultLanguage } = this;
        const formatLang = Object.values(supportLanguage).includes(lang)
            ? lang
            : (supportLanguage as any)[lang] || defaultLanguage;

        try {
            return await this.store?.where("[action+lang]").equals([action, formatLang]).first();
        } catch (e) {
            console.error(e);
        }
    }
}

const template = new IntlTemplate();
export default template;
