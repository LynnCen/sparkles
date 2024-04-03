import axios from "@newSdk/service/apiCore/tmmCore";

export default async () => {
    const {
        data: { items = [] },
    } = await axios({
        url: "/getContactsIds",
        method: "post",
        data: {},
    });

    return items;
};
