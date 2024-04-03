import feedNotification, { FeedNotificationType } from "@newSdk/model/moments/FeedNotification";
import getFeedNotification from "@newSdk/service/api/moments/getFeedNotification";
import dealNotificationRead from "@newSdk/service/api/moments/dealNotificationRead";
import nc from "@newSdk/notification";
import { partition, flattenDeep } from "lodash";

async function fetchNotifications(page?: number) {
    try {
        const notifications = await allNotification(page);
        fetchFromRemote();
        return notifications;
    } catch (e) {
        //
    }
}

async function fetchNoticesPerPage(page?: number) {
    return await allNotification(page);
}

async function fetchFromRemote() {
    const seq = await feedNotification.getSequence();
    const data = await getFeedNotification(seq);
    insertTo(data);
}

async function receiveFromWS(seqNew?: number) {
    const seq = await feedNotification.getSequence();
    // console.log(seq, seqNew);
    if (seqNew && seq < seqNew) {
        const data = await getFeedNotification(seq);
        // console.log(data);
        insertTo(data);
    }
}

async function insertTo(data: FeedNotificationType[]) {
    // console.log(data);
    if (!data || !data.length) return;
    const [normalNotification, reads] = partition(data, function (item) {
        return item.action !== 82;
    });
    if (reads.length) {
        const readIds = flattenDeep(
            reads.filter((item) => item.extra).map((item) => item.extra.ids || [])
        );
        feedNotification.bulkPutRead(reads);
        await feedNotification.readNotification(readIds);
    }
    feedNotification.bulkPut(normalNotification);
}

async function clearNotification() {
    const ids = await feedNotification.markAllRead();
    dealNotificationRead(ids);
}

async function allNotification(page?: number) {
    return await feedNotification.bulkGet(page);
}

async function getUnReadCount() {
    return await feedNotification.getUnReadNotifications();
}

async function getCounts() {
    return await feedNotification.getCounts();
}

async function readNotification(id: string) {
    await dealNotificationRead([id]);
    return await feedNotification.readNotification([id]);
}

function addNewNotification(fn: (data: any) => void) {
    nc.addObserver("newNotifications", fn);
}

function removeNewNotification(fn: (data: any) => void) {
    nc.removeObserve("newNotifications", fn);
}

export {
    fetchNotifications,
    clearNotification,
    getUnReadCount,
    getCounts,
    readNotification,
    addNewNotification,
    removeNewNotification,
    fetchNoticesPerPage,
    fetchFromRemote,
    receiveFromWS,
};
