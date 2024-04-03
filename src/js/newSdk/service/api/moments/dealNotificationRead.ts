import axios from "@newSdk/service/apiCore/tmmMomentsCore";

export const dealNotificationRead = async (ids: string[]) => {
    try {
        const res = await axios({
            url: "/dealNotificationRead",
            method: "post",
            data: {
                ids,
            },
        });
        return res.data.items || [];
    } catch (e) {
        return [];
    }
};

export default dealNotificationRead;
