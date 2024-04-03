import getGroupList from "@newSdk/service/api/group/getGroupList";
import getGroupListName from "@newSdk/service/api/group/getGroupListName";

export default async function getGroupInfos(ids: string[]) {
    try {
        const items = await getGroupList(ids);

        if (items.length === ids.length) return;

        // filter no permission id
        const existIds = items.map(({ id }: any) => id);

        // to get baseInfo
        const baseIds = ids.filter((item) => !existIds.includes(item));
        return getGroupListName(baseIds);
    } catch (e) {}
}
