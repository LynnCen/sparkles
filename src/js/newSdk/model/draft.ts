import Dexie, { Table } from "dexie";
import nc from "@newSdk/notification";
import { Message } from "./Message";

export interface draft extends Message {}

export enum EventType {
    DraftChange = "draft_Change",
}
class DraftTable {
    private draftTable?: Table<draft>;
    public Event = {
        DraftChange: "draft_Change",
    };
    init(db: Dexie) {
        this.draftTable = db.table("draft");
    }

    async putMsg(item: draft) {
        try {
            this.draftTable?.put(item).then(() => {});
        } catch (e) {
            console.log(e);
        }
    }
    async updateMsg(chatId: string, Itme: Partial<draft>) {
        try {
            this.draftTable?.update(chatId, Itme);
        } catch (error) {
            console.log("updateMsg", error);
        }
    }
    async deleteMsg(chatId: string) {
        try {
            await this.draftTable
                ?.where("chatId")
                .equals(chatId)
                .delete()
                .then((res) => {
                    if (res) this.publishNC(chatId);
                });
        } catch (e) {
            console.log(e);
            //
        }
    }

    async getMsg(chatId: string): Promise<draft | undefined> {
        try {
            const data = await this.draftTable?.where("chatId").equals(chatId).first();
            return data;
        } catch (e) {
            console.log(e, "getDraftMsg");
        }
    }
    async getAllDraftMsg(filter: { (item: draft): boolean } = () => true): Promise<draft[]> {
        try {
            const draftList = (await this.draftTable?.filter(filter).toArray()) || [];
            return draftList;
        } catch (error) {
            console.log(error, "getAllDraftMsg");
            return [];
        }
    }
    publishNC(chatId: string) {
        nc.publish(EventType.DraftChange, chatId);
    }
}

const DraftModel = new DraftTable();

export default DraftModel;
