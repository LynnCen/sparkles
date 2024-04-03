/**
 * @Author Pull
 * @Date 2021-11-02 19:08
 * @project commentCountProxy
 */
import { observable, action, computed } from "mobx";
import getCommentsCountBulk from "@newSdk/logic/moments/getCommentsCountBulk";

class CommentCountProxy {
    @observable commentMap = {};
    @action uploadCommentMap(map = {}) {
        self.commentMap = { ...self.commentMap, ...map };
    }

    @computed get getCount() {
        const hotMap = self.commentMap;
        return (id) => hotMap[id] || [];
    }

    async getCommentCountMap(ids) {
        await getCommentsCountBulk(ids).then(self.uploadCommentMap);
    }

    @action
    clearCache() {
        self.commentMap = {};
    }
}

export const self = new CommentCountProxy();
export default self;
