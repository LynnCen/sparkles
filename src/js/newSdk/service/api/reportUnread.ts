import axios from "../apiCore/tmmCore";
import UserInfo from "@newSdk/model/UserInfo";

export default (count: number) => {
    const sequence = (() => {
        const cacheSeq = localStorage.getItem("cacheSequence");

        let num = 0;
        try {
            if (cacheSeq) num = JSON.parse(cacheSeq)[UserInfo._id];
        } catch (e) {}

        return parseInt(`${num || "0"}`);
    })();

    return axios({
        url: "/updateUnreadStock",
        method: "post",
        data: {
            num: count,
            sequence,
        },
    });
};
