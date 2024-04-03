import axios from "../apiCore/tmmNoTokenCore";

export default async () => {
    try {
        const res: any = await axios({
            url: "/start",
            data: {},
            method: "post",
        });

        return res.data.items;
    } catch (e) {
        return {};
    }
};
