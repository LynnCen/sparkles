import axios from "@newSdk/service/apiCore/tmmCore";
import { Switch } from "@newSdk/model/types";
import { db } from "@newSdk/model";
import groupMemberModel from "@newSdk/model/GroupMembers";
import getGroupMemberIds from "@newSdk/service/api/group/getGroupMemberIds";
import _ from "lodash";
import GroupInfo from "@newSdk/model/GroupInfo";

export default async (gid: string) => {
    try {
        const uids = await getGroupMemberIds(gid);

        if (!uids) return;
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
        db?.transaction("rw", db?.groupMembers, db?.groupInfo, async () => {
            const oldGroupMembers = await groupMemberModel.getGroupMembers(gid);
            const mark = oldGroupMembers.map((item) => {
                if (!uids.includes(item.uid)) return { ...item, deleted: true };
                else return { ...item, deleted: false };
            });
            const markMap = _.keyBy(mark, "uid");

            data.forEach((item) => (markMap[item.uid] = item));

            // await db?.groupMembers?.where("gid").equals(gid).delete();
            const memberList = Object.values(markMap) || [];
            await db?.groupMembers?.bulkPut(memberList);
            await db?.groupInfo
                .where("id")
                .equals(gid)
                .modify({ memberCount: memberList.filter((item) => !item.deleted).length });
            return memberList;
        })
            .then((memberList) => {
                groupMemberModel.handlePublish(memberList, gid);
                GroupInfo.getGroupInfoByIds([gid]).then((list) => {
                    if (list.length) GroupInfo.handlePublish(list);
                });
            })
            .catch((e) => console.error(e));
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
