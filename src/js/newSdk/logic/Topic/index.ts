import topicDetail, { TopicID } from "@newSdk/model/moments/TopicDetail";
import getTopicDetails from "@newSdk/service/api/moments/getTopicDetails";
import nc from "@newSdk/notification";
import _loadMomentsInfoSyncRemote from "@newSdk/logic/moments/_loadMomentsInfoSyncRemote";

// get moment Comments / level1 reply
async function fetchTopics(ids?: string[]) {
    try {
        const allTopic = await getTopics(ids);
        if (ids) {
            getTopicDetails(ids).then((topics) => {
                topicDetail.putTopic(topics);
            });
        }
        return allTopic;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function getTopicFeeds() {
    return await topicDetail.bulkGetRecentMonth();
}

async function getMomentIdByTid(tid: string) {
    const feeds = await topicDetail.getMomentByTid(tid);
    if (!feeds) return [];
    const feedArr = feeds.map(({ mid }) => mid);
    return await _loadMomentsInfoSyncRemote(feedArr);
}

async function searchByName(name: string) {
    return await topicDetail.searchTopic(name);
}

function addTopicObserver(fn: (data: any) => void) {
    nc.addObserver("topicUpdate", fn);
}

function removeTopicObserver(fn: (data: any) => void) {
    nc.addObserver("topicUpdate", fn);
}

async function getTopics(ids?: string[]) {
    try {
        return await topicDetail.getTopic(ids);
    } catch (e) {
        return [];
    }
}

export {
    fetchTopics,
    getTopics,
    addTopicObserver,
    removeTopicObserver,
    getMomentIdByTid,
    searchByName,
    getTopicFeeds,
};
