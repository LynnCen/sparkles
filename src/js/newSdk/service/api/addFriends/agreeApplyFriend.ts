import axios from "@newSdk/service/apiCore/tmmCore";

export default (uid: string) =>
    axios({
        url: "/agreeApplyFriend",
        method: "post",
        data: {
            uid,
        },
    });
