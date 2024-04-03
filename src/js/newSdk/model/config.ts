export const TABLE_NAME = {
    COIN_CONFIG: "py_coinConfig",
    WITHDRAW_BILL: "py_withDrawBill",
    RECHARGE_BILL: "py_recharge",
};

export const Schema = {
    chat: "++&chatId, unreadCount",
    message: "++&id, &mid, chatId, status, sequence, type",

    memberInfos: "&id, isFriend , name,tmm_id",
    groupInfo: "++&id, uid",
    groupMembers: "++&id, uid, gid",
    friendReqs: "++&applyId, uid, status, createTime",
    token: "++&baseUrl",

    /* moments */
    momentsFeeds: "&mid, createTime, uid",
    momentsDetailsModel: "&id, contentType",
    momentsUserFeeds: "&mid, uid, contentType",
    commentIds: "&id, mid, pid",
    comments: "&id, mid, pid",
    commentLikes: "&id, cid",
    momentLikes: "&id, mid",
    topicFeeds: "&id, mid, tid, create_time",
    topicDetails: "&id, name",
    notifications: "&id, sequence, is_read, create_time",
    notificationRead: "&id, sequence",

    hotCommentFeeds: "&key",
    keyValues: "&key",
    draft: "&chatId",
    [TABLE_NAME.COIN_CONFIG]: "&id",
    [TABLE_NAME.WITHDRAW_BILL]: "&id",
    [TABLE_NAME.RECHARGE_BILL]: "&id",
};

export const publicSchema = {
    intlTemplate: "++&id, &[action+lang]",
    bucketInfos: "&bucket_id, expire",
};

// update bucketInfos schema
export const dbVersion = 39;
