/**
 * @Author Pull
 * @Date 2021-10-28 13:42
 * @project hotCommentProxy
 */
import { observable, action, computed } from "mobx";
import { getRepostListCount } from "@newSdk/logic/moments/getRepostLists";

class ForwardCountProxy {
    @observable forwardMap = {};
    @action uploadForwardMap(map = {}) {
        self.forwardMap = { ...self.forwardMap, ...map };
    }

    @computed get getCount() {
        const hotMap = self.forwardMap;
        return (id) => hotMap[id] || [];
    }

    async getForwardCountMap(ids) {
        await getRepostListCount(ids).then(self.uploadForwardMap);
    }

    @action
    clearCache() {
        self.forwardMap = {};
    }
}

export const self = new ForwardCountProxy();
export default self;
