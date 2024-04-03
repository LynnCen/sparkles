import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";
import SupportDBKey from "@newSdk/model/keyValues/SupportDBKey";

interface KeyValues {
    key: string;
    val: string;
}

class KeyValueModel {
    static authorize = false;
    private db?: Dexie;
    private userId?: string;
    private store?: Table<KeyValues, string>;

    public Event = {
        keyValueModelChange: "key_value_modal_change",
        lastEmojiModelChange: "lastEmojiModelChange",
    };

    init(db: Dexie) {
        this.db = db;
        this.userId = db.name;
        this.store = db.table("keyValues");
        KeyValueModel.authorize = true;
    }

    async getValueByKey(k: string) {
        try {
            const item = await this.store!.where("key").equals(k).first();
            if (item) return JSON.parse(item.val);
            return null;
        } catch (e) {
            console.error("error in heyValueByKey", k);
            return null;
        }
    }

    bulkPut(list: KeyValues[], key?: string) {
        this.store
            ?.bulkPut(list)
            .then(async (res) => {
                if (key === SupportDBKey.LastEmoji) {
                    let emojiList = (await this.getValueByKey(key)) || [];
                    if (emojiList.length > 10) emojiList = emojiList.slice(-10);
                    return nc.publish(this.Event.lastEmojiModelChange, emojiList.reverse());
                }
                this.handlePublish(list);
            })
            .catch((e) => console.log("error in keyValue modal", e));
    }

    handlePublish(list: KeyValues[]) {
        nc.publish(this.Event.keyValueModelChange, list);
    }
}

export const keyValueModel = new KeyValueModel();
export default keyValueModel;
