/**
 * @Author Pull
 * @Date 2021-08-05 14:24
 * @project intersectionObserver
 */

import { observable, action } from "mobx";
import sessionStore from "./session";
import MessageStatus from "@newSdk/model/MessageStatus";
import ACKReadMessageContent from "@newSdk/model/message/ACKReadMessageContent";
import messageModel from "@newSdk/model/Message";
import chatStore from "./chat";
import { chatModel } from "@newSdk/model";

class ACKReadOb {
    constructor() {
        this.midSet = new Set();
        this.sending = false;
    }
}

class IntersectionWatcher {
    // DOM异步注册 交叉监听 缓存
    asyncStage = [];

    threshold = [Number.MIN_VALUE, 0.8]; // 比率触发阈值
    prevRatio = 0.25; // 回调触发比值
    root = null; // 根结点
    // 监听对象
    observer = null;

    // 上报消息列表： [chatid => {sending: bool, midSet: Set }]
    readList = new Map();

    reportThrottle = {
        timeout: 444,
        timer: null,
    };

    initObserver(root) {
        self.observer = new IntersectionObserver(self.handleResponseOb, {
            root: root || self.root,
            threshold: self.threshold,
        });

        if (!self.asyncStage.length) return false;

        self.asyncStage.forEach((item) => {
            self.observer.observe(item);
        });
    }

    resetObserve() {
        if (self.observer) {
            self.observer.disconnect();
            self.observer = null;
        }

        self.initObserver(self.root);
    }

    // 添加元素
    addObserve(element, chatId) {
        if (chatId.startsWith("g_")) return;
        if (chatId !== sessionStore.focusSessionId) return;
        // Tag newSdk
        if (self.observer) {
            if (element) self.observer.observe(element);
        } else {
            if (element) self.asyncStage.push(element);
        }
    }

    handleResponseOb(entries, observer) {
        entries.forEach((entry, i) => {
            if (entry.intersectionRatio > self.prevRatio) {
                // 出现在视图
                const { mid, status, cid } = entry.target.dataset;
                if (status !== MessageStatus.ACKRead) self.handleReportRead(mid, cid);
            }
        });
        // self.cb
    }

    handleReportRead(mid, chatId) {
        const info = self.readList.get(chatId);

        let toReport = false;
        if (info && info.midSet) {
            info.midSet.add(mid);
            toReport = true;
        } else {
            const ackOb = new ACKReadOb();
            ackOb.midSet.add(mid);
            self.readList.set(chatId, ackOb);
            toReport = true;
        }

        if (toReport) self.reportThrottleHandler();
    }

    reportThrottleHandler() {
        const { timer, timeout } = self.reportThrottle;
        if (timer) clearTimeout(timer);

        self.reportThrottle.timer = setTimeout(self.report, timeout);
    }

    report() {
        self.readList.forEach((ackOb, chatId) => {
            if (ackOb.sending) return;
            // todo
            const ls = Array.from(ackOb.midSet);
            if (ls && ls.length) {
                const message = new ACKReadMessageContent(chatId, { mids: ls });
                // to report
                console.log(message);

                // report flag
                ackOb.sending = true;
                self.readList.set(chatId, ackOb);

                chatStore.sendMessage(message).then(async () => {
                    // gc
                    await messageModel.updateAckRead(ls);
                    // await chatModel.maskLastMessageRead(chatId, ls);
                    self.reportedCollection(chatId, ls);
                    // update local status
                    // return messageModel.updateAckRead(ls);
                });
            }
        });
    }

    reportedCollection(chatId, ls) {
        const ackOb = self.readList.get(chatId);
        const set = ackOb.midSet;
        if (ackOb && set) {
            ls.forEach((item) => set.delete(item));
            if (set.size === 0) self.readList.delete(chatId);
            else {
                ackOb.sending = false;
                self.readList.set(chatId, ackOb);
            }
        }
    }

    @action
    clearCache() {
        self.root = null; // 根结点
        // 监听对象
        self.observer = null;
        self.asyncStage = [];
        self.readList = new Map();
    }
}

const self = new IntersectionWatcher();
export default self;
