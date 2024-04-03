import axios from "@newSdk/service/apiCore/tmmCore";
import { Switch } from "@newSdk/model/types";

export default async (gid: string, uids: string[]) => {
    try {
        const {
            data: { items },
        } = await axios({
            url: "/getGroupMemberInfoList",
            method: "post",
            data: {
                id: gid,
                uids,
            },
        });

        if (!items) return;

        const data = apiDataTrans(items || []);

        return data;
    } catch (e) {
        console.error(`api method of group/getGroupMemberInfoList`, e);
    }
};

const apiDataTrans = (source: any[]) =>
    source.map(({ uid, gid, id, role, create_time, my_alias, admin_time }, i) => ({
        id,
        uid,
        gid,
        isAdmin: role === 2 ? 1 : (0 as Switch),
        isOwner: role === 1 ? 1 : (0 as Switch),
        alias: my_alias,
        createTime: create_time,
        deleted: false,
        adminTime: admin_time,
    }));
