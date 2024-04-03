import axios from "@newSdk/service/apiCore/tmmCore";
import friendReq from "@newSdk/logic/friendReq";
import getUserListInfo from "@newSdk/service/api/getUserListInfo";
import memberInfoModel from "@newSdk/model/Members";

export interface Item {
    id: string;
    uid: string;
    create_time: number;
    update_time: number;
    status: number;
}

export default async () => {
    const {
        data: { items = [] },
    } = await axios({
        url: "/getApplyList",
        method: "post",
        data: {},
    });

    const users: Set<string> = new Set();
    const data = items.map((item: Item) => {
        users.add(item.uid);
        return dataTransfer(item);
    });

    friendReq.bulkPut(data);

    const ids = await memberInfoModel.getUnExistIdsByUid(Array.from(users));
    if (ids.length) return getUserListInfo(ids);
};

export const dataTransfer = ({ id, uid, update_time, status, create_time }: Item) => ({
    applyId: id,
    uid,
    createTime: create_time,
    status,
});
