/**
 * @Author Pull
 * @Date 2021-08-21 15:05
 * @project actions
 */

const ActionType = {
    INIT_SOURCE: "init_source",
    DOWNLOAD_THUMBNAIL: "download_thumbnail",
    DOWNLOAD_ORIGIN: "download_origin",
    VIEW_CHANGE: "view_change",
    SYNC_STORE: "sync_store",

    UPDATE_PATH: "update_path",
};
export default ActionType;

class InitAction {
    type = ActionType.INIT_SOURCE;
    data = {
        list: [],
        forceIndex: 0,
    };
    constructor(data) {
        this.data = data;
    }
}

class ViewChangeAction {
    type = ActionType.VIEW_CHANGE;
    data = { index: 0 };

    constructor(index) {
        this.data = { index };
    }
}
class UpdateAction {
    type = ActionType.UPDATE_PATH;
    data = {
        mid: "",
        path: "",
    };
    constructor(data) {
        this.data = data;
    }
}
class SyncAction {
    type = ActionType.INIT_SOURCE;
    data = {};
    constructor(data) {
        this.data = data;
    }
}

export { InitAction, SyncAction, ViewChangeAction, UpdateAction };
