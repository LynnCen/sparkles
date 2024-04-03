import Dexie, { Table } from "dexie";
import messageTable from "./Message";
import chatTable from "./Chat";
import { dbVersion, Schema } from "./config";
import memberModel from "./Members";
import groupModel from "./GroupInfo";
import groupMembers from "./GroupMembers";
import tokenModel from "./Token";
import FriendsReq from "../logic/friendReq";
import momentsDetailsModel from "@newSdk/model/moments/FeedDetails";
import feedsModel from "@newSdk/model/moments/FeedsModel";
import keyValueModel from "@newSdk/model/keyValues/KeyValue";
import momentLikes from "@newSdk/model/moments/Likes";
import hotComment from "@newSdk/model/moments/HotComment";
import momentUserFeeds from "@newSdk/model/moments/UserFeeds";
import topicDetail from "@newSdk/model/moments/TopicDetail";
import feedNotification from "@newSdk/model/moments/FeedNotification";
import commentIdsStore from "@newSdk/model/comment/CommentId";
import commentItemStore from "@newSdk/model/comment/CommentItem";
import commentLikeTable from "@newSdk/model/comment/CommentLikes";
import draftModel from "@newSdk/model/draft";
import withDrawBillDetailModal from "@newSdk/model/payment/WithDrawal";
import coinModal from "@newSdk/model/payment/Coin";
import rechargeDetailModal from "@newSdk/model/payment/Recharge";

interface IDexie extends Dexie {
    [db: string]: any;
}

export let db: IDexie | null = null;

const init = async (userId: string) => {
    // 是否为初始化 db
    const isExist = await Dexie.exists(userId);

    // ---->>>
    db = new Dexie(userId);
    db.version(dbVersion).stores(Schema);
    await messageTable.init(db);
    await chatTable.init(db);
    await memberModel.init(db);
    await groupModel.init(db);
    await groupMembers.init(db);
    await FriendsReq.init(db);
    await tokenModel.init(db);
    await feedsModel.init(db);
    await momentsDetailsModel.init(db);
    await keyValueModel.init(db);
    await momentLikes.init(db);
    await hotComment.init(db);
    await momentUserFeeds.init(db);
    await topicDetail.init(db);
    await feedNotification.init(db);
    await commentIdsStore.init(db);
    await commentItemStore.init(db);
    await commentLikeTable.init(db);
    await draftModel.init(db);
    await withDrawBillDetailModal.init(db);
    await coinModal.init(db);
    await rechargeDetailModal.init(db);

    return isExist;
    // db.table("chat").hook("creating", () => console.log("chat creating"));
    // db.table("chat").hook("reading", () => console.log("chat reading"));
    // db.table("chat").hook("deleting", () => console.log("chat deleting"));
    // db.table("chat").hook("updating", () => console.log("chat updating"));
};

export const closeDb = () => db?.close();
export const deletedDb = () =>
    db
        ?.delete()
        .then(() => {
            console.log("Database successfully deleted");
        })
        .catch((err) => {
            console.error("Could not delete database");
        })
        .finally(() => {
            // Do what should be done next...
        });
export default init;
export const messageModel = messageTable;
export const chatModel = chatTable;
