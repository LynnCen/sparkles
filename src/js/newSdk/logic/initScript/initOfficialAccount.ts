// official

import { OfficialServices } from "@newSdk/index";
import getUserListInfo_pure from "@newSdk/service/api/getUserLIstInfo_pure";
import Members, { IMember } from "@newSdk/model/Members";
import { mergeObArray } from "@newSdk/utils";

export const initOfficialAccount = async () => {
    const list = await getUserListInfo_pure(OfficialServices);

    list.forEach((item: IMember) => {
        const { id, avatar } = item;
        if (id && avatar) {
            Members.checkAvatarCache(id, avatar);
        }
    });

    const oldInfo = await Members.getMemberByIds(OfficialServices);
    const officialInfo = mergeObArray(list, oldInfo, "id");
    Members.bulkPutMemberInfo(officialInfo);
};

export default initOfficialAccount;
