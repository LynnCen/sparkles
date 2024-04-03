import axios from "@newSdk/service/apiCore/tmmCore";

export default async () => {
    try {
        const {
            data: { items },
        } = await axios({
            url: "/getGroupIdList",
            method: "post",
            data: {},
        });

        return items || [];
    } catch (e) {
        console.error(`api method of group/getGroupIdList`, e);
        return [];
    }
};
