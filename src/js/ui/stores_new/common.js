import { observable, action } from "mobx";
import NewContactStore from "./contacts";
import { remote } from "electron";
const { nativeTheme } = remote.require("electron");
import { isNumber } from "lodash";
import { message } from "antd";

class Common {
    @observable isNewFriend = 0; // is receive new friends apply
    @observable videoFile = null; // upload video need poster
    @observable shouldUseDarkColors = false; // shouldUseDarkColors
    @observable followSystem = true; // only valid in mac

    @action updateApplyFriendMsgState(value) {
        commonStore.isNewFriend = value;
        if (value) {
            NewContactStore.getNewFriendsReq();
        }
    }

    // for video
    @action updateUploadFile(file) {
        commonStore.videoFile = file;
    }

    @action updateShouldUseDarkColors(val) {
        commonStore.shouldUseDarkColors = val;
        // if (!isNumber(val)) return (commonStore.shouldUseDarkColors = val);
        // if (val === 2) {
        //     commonStore.followSystem = true;
        //     commonStore.shouldUseDarkColors = nativeTheme.shouldUseDarkColors;
        // } else {
        //     commonStore.shouldUseDarkColors = val;
        //     commonStore.followSystem = false;
        // }
    }
}

const commonStore = new Common();
export default commonStore;
