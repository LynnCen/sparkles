import getContactsIds from "@newSdk/service/api/getContactsIds";
import updateUserInfo from "@newSdk/logic/updateFriendsInfo";
import UserInfo from "@newSdk/model/UserInfo";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
import { initPercentChange } from "@newSdk/logic/initScript/firstInitLoadingPercent";
// init contacts friends list
export default async ({ isSyncCurrent = false, isInit = false } = {}) => {
    // sync login user
    if (isSyncCurrent && UserInfo._id) getUserListInfo([UserInfo._id]);

    // sync friends info
    const items = await getContactsIds();

    if (isInit) {
        initPercentChange.percentChange(initPercentChange.PercentRatioEnum.ContactIds);
        initPercentChange.calcContactsPercent(items.length);
        initPercentChange.setPublishAble();
    }
    return updateUserInfo(items, { isInit });
};
