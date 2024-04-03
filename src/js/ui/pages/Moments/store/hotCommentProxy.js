/**
 * @Author Pull
 * @Date 2021-10-28 13:42
 * @project hotCommentProxy
 */
import { observable, action, computed } from "mobx";
import loadHotComment from "@newSdk/logic/moments/loadHotComment";
import nc from "@newSdk/notification";
import hotComment from "@newSdk/model/moments/HotComment";
import UiEventCenter from "utils/sn_event_center";

class HotCommentProxy {
    @observable fetchList = [];
    debounceTime = null;
    debounceTimeout = 600;
    @observable commentMap = {};

    event = {
        updated: "hot_comment_proxy_updated",
    };
    constructor() {
        nc.on(hotComment.Event.hotCommentChange, async (ids) => {
            // ids.filter()
            if (ids && ids.length) {
                // await self.getCommentMap(ids, false);
                // 刷新
                loadHotComment(ids, false).then(self.uploadCommentMap);
            }
        });
    }

    @action uploadCommentMap(map = {}) {
        self.commentMap = { ...self.commentMap, ...map };

        // console.log(self.commentMap);
        setTimeout(() => {
            UiEventCenter.emit(self.event.updated);
        }, 16);
    }

    @computed get getHotComment() {
        const hotMap = self.commentMap;
        return (id) => hotMap[id] || [];
    }

    @action handleFetch() {
        if (self.fetchList.length) {
            loadHotComment(self.fetchList, true).then(self.uploadCommentMap);
            self.fetchList = [];
        }
    }

    async getCommentMap(ids, refresh = true) {
        self.fetchList = Array.from(new Set([...self.fetchList, ...ids]));

        if (self.debounceTime) clearTimeout(self.debounceTime);
        self.debounceTime = setTimeout(() => {
            self.handleFetch();
        }, self.debounceTimeout);
        //
    }

    @action
    clearCache() {
        self.commentMap = {};
        self.fetchList = [];
    }
}

export const self = new HotCommentProxy();
export default self;
