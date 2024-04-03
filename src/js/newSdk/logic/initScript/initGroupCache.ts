import axios from "@newSdk/service/apiCore/tmmCore";
import getGroupIdList from "@newSdk/service/api/group/getGroupIdList";
import getGroupList from "@newSdk/service/api/group/getGroupList";

export default async () => {
    const ids = await getGroupIdList();
    if (!ids || !ids.length) return;

    return getGroupList(ids);
};
