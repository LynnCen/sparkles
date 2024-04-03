/**
 * @Author Pull
 * @Date 2021-08-21 15:03
 * @project reducer
 */

import actions from "./actions";
import { checkIndex, initSource, compressCurrent } from "./utils";

export default function (store, action) {
    const { type, data } = action;

    switch (type) {
        case actions.INIT_SOURCE: {
            const { list, forceIndex } = data;

            const { prevAble, nextAble } = checkIndex(list, forceIndex);

            return {
                ...store,
                list,
                forceIndex,
                prevAble,
                nextAble,
                initDone: true,
            };
        }
        case actions.VIEW_CHANGE:
            const { index } = data;

            const { prevAble, nextAble } = checkIndex(store.list, index);
            return {
                ...store,
                prevAble,
                nextAble,
                forceIndex: index,
            };
        case actions.SYNC_STORE: {
            return { ...store, ...data };
        }
        case actions.UPDATE_PATH: {
            const { mid, path } = data;
            const list = store.list;
            const item = list.find((item) => item.mid === mid);

            item.load = true;
            if (path) {
                // compress download error, create compress
                if (!item.path) {
                    compressCurrent(path, item.content);
                }

                item.path = path;
            }
            return { ...store, list: [...list] };
        }
        default:
            return store;
    }
}
