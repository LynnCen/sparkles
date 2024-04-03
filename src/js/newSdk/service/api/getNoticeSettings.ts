import axios from "@newSdk/service/apiCore/tmmNoTokenCore";

export default async function getNoticeSettings() {
    const res = await axios({
        url: "/getNoticeSettings",
        method: "post",
        data: {},
    });
    return res.data.items || [];
}
