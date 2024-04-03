import axios from "@newSdk/service/apiCore/tmmMomentsCore";

export const getFeedNotification = async (sequence: number) => {
    try {
        const res = await axios({
            url: "/getFeedNotification",
            method: "post",
            data: {
                sequence,
            },
        });
        return res.data.items || [];
    } catch (e) {
        return [];
    }
};

export default getFeedNotification;
