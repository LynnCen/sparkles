/**
 * @Author Pull
 * @Date 2021-08-03 10:44
 * @project userInfoProxy
 * @desc: sync db cache about user info include groupMember info
 **************************************************************************
 * ************************* legacy **************************************
 **************************************************************************
 */
import { observable, action, computed } from "mobx";
import membersModel from "@newSdk/model/Members";
import groupMemberModel from "@newSdk/model/GroupMembers";
import nc from "@newSdk/notification";

const splitListToSingle = (listPromise, primaryKey, value) =>
    new Promise((resolve) => {
        listPromise.then((listInfo) => {
            const item = listInfo.find((item) => item[primaryKey] === value) || {};
            // there is very Weird, if you just resolve item, the promise result will all the last one
            resolve({ ...item, [primaryKey]: value });
            // return listInfo;
        });
    });

class UserInfoProxy {
    // @observable userInfo = new Map();
    @observable userInfo = {};
    @observable groupUserInfo = {};

    pendingMap = new Map();

    userInfoGc = new Map();
    groupInfoGc = new Map();

    constructor() {
        nc.on(membersModel.Event.MemberInfoChanged, (memberList) => {
            const ob = {};
            memberList.forEach((item) => (ob[item.id] = item));

            self.userInfo = {
                ...self.userInfo,
                ...ob,
            };
        });

        nc.on(groupMemberModel.Event.MemberInfoChanged, (memberList, gid) => {
            if (!gid) return;
            const ob = {};
            memberList.forEach((item) => (ob[`${gid}_${item.uid}`] = item));
            self.groupUserInfo = {
                ...self.groupUserInfo,
                ...ob,
            };
        });
    }

    @action setUserInfo(key, value) {
        self.userInfo[key] = value;
    }

    @action setGroupUserInfo(key, value) {
        // console.log(`set groupUser`, key, value);
        // self.groupUserInfo[key] = value;
    }

    @computed get proxyInfo() {
        const userInfo = self.userInfo;
        const groupUserInfo = self.groupUserInfo;
        return (uid, chatId) => {
            if (chatId && chatId.startsWith("g_")) {
                return {
                    ...(groupUserInfo[`${chatId}_${uid}`] || {}),
                    ...(userInfo[uid] || {}),
                };
            }

            // console.log("----------->>> >>> >>>", user[uid]);
            return { ...(userInfo[uid] || {}) };
        };
    }

    //
    @action async getAllUserInfo(uid, chatId) {
        const promiseArr = [];
        if (chatId.startsWith("g_")) promiseArr.push(self.getGroupMemberInfo(chatId, uid));
        promiseArr.push(self.getBaseInfo(uid));

        const [groupInfo, userInfo] = await Promise.all(promiseArr);
        // console.log("---------->", { ...groupInfo, ...userInfo });
        return { ...groupInfo, ...userInfo };
    }

    // cache base info in db memberInfos
    @action async getBaseInfo(uid) {
        const item = self.userInfo[uid] || self.pendingMap.get(uid);
        if (item) {
            self.setGcTag(true, uid);
            return item;
        }
        const p = membersModel.getMemberById(uid, true);
        // set promise
        self.pendingMap.set(uid, p);

        // update
        const userInfo = await p;
        // self.userInfo[uid] = userInfo;
        self.setUserInfo(uid, userInfo);
        self.pendingMap.delete(uid);

        self.setGcTag(true, uid);

        return userInfo;
    }

    @action async getBaseInfoByIds(uids) {
        const res = [];
        const notExist = [];

        // check cache
        uids.forEach((uid) => {
            // mark
            self.setGcTag(true, uid);

            const item = self.userInfo[uid] || self.pendingMap.get(uid);
            if (item) res.push(item);
            else notExist.push(uid);
        });

        // query local db
        if (notExist.length) {
            const infosPromise = membersModel.getMemberByIds(notExist);

            // split groups ids
            notExist.forEach((uid) => {
                const pendingInfo = splitListToSingle(infosPromise, "id", uid);
                self.pendingMap.set(uid, pendingInfo);
                res.push(pendingInfo);
                pendingInfo.then((info) => {
                    // self.userInfo[info.id] = info;
                    self.setUserInfo(info.id, info);
                    self.pendingMap.delete(info.id);
                });
            });
        }
        const infos = await Promise.allSettled(res);
        return infos.map((item) => item.value);
    }

    // cache session cache
    @action async getGroupMemberInfo(gid, uid) {
        const key = `${gid}_${uid}`;

        if (self.groupUserInfo[key]) {
            // console.log("target");
            self.setGcTag(false, key);
            return self.groupUserInfo[key];
        }

        // set pro
        const p = groupMemberModel.getGroupMember(gid, uid);
        self.pendingMap.set(key, p);

        // update
        const info = await p;
        // console.log("refresh", info);
        // self.groupUserInfo[key] = info;
        self.setGroupUserInfo(key, info);
        self.pendingMap.delete(key);
        self.setGcTag(false, key);
        return info;
    }
    @action async getBulkGroupMember(gid, uidList) {
        if (!gid || !gid.startsWith("g_") || !uidList || !uidList.length) return [];
        const res = [];
        const notExist = [];
        // check cache
        uidList.forEach((uid) => {
            // mark
            self.setGcTag(false, uid);
            const key = `${gid}_${uid}`;
            const item = self.groupUserInfo[key] || self.pendingMap.get(key);
            if (item) res.push(item);
            else notExist.push(uid);
        });

        const infosPromise = groupMemberModel.getBulkGroupMember(gid, notExist);
        // query local db
        if (notExist.length) {
            // split groups ids
            notExist.forEach((uid) => {
                const key = `${gid}_${uid}`;
                const pendingInfo = splitListToSingle(infosPromise, "uid", uid);
                self.pendingMap.set(key, pendingInfo);
                res.push(pendingInfo);
                pendingInfo.then((info) => {
                    // self.groupUserInfo[key] = info;
                    self.setGroupUserInfo(key, info);
                    self.pendingMap.delete(key);
                });
            });
        }
        const infos = await Promise.allSettled(res);
        return infos.map((item) => item.value);
    }
    @action async getGroupMembers(gid, isRefresh) {
        const members = await groupMemberModel.getGroupMembers(gid, isRefresh);
        members.forEach((item) => {
            self.setGcTag(false, `${gid}_${item.uid}`);
            // self.groupUserInfo[`${gid}_${item.uid}`] = item;
            self.setGroupUserInfo(`${gid}_${item.uid}`, item);
        });
        return members;
    }

    // @computed get userInfo() {
    //     return (uid) => self.userInfo.get(uid) || {};
    // }
    //
    // @computed get groupMemberInfo() {
    //     return (gid, uid) => {
    //         self.setGcTag(false, `${gid}_${uid}`);
    //         return Object.assign(
    //             self.userInfo.get(uid) || {},
    //             self.groupUserInfo.get(`${gid}_${uid}`) || {}
    //         );
    //     };
    // }
    setGcTag(isBase, key) {
        if (isBase) return self.userInfoGc.set(key, (self.userInfoGc.get(key) || 0) + 1);

        self.groupInfoGc.set(key, (self.groupInfoGc.get(key) || 0) + 1);
    }

    @action
    clearCache() {
        self.userInfo = {};
        self.groupUserInfo = {};
        self.pendingMap = new Map();
        self.userInfoGc = new Map();
        self.groupInfoGc = new Map();
    }
}

const self = new UserInfoProxy();

export default self;
