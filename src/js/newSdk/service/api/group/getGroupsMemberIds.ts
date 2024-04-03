import axios from "@newSdk/service/apiCore/tmmCore";

interface Reponse {
    id: string;
    uids: string[];
}

// 批量获取 组成员
export const getGroupsMemberIds = async (ids: string[]): Promise<Reponse[]> => {
    try {
        const {
            data: { items },
        } = await axios({
            url: "/getGroupsMemberIds",
            method: "post",
            data: { ids },
        });

        return items;
    } catch (e) {
        return [];
    }
};

export default getGroupsMemberIds;
