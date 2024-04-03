import axios from "@newSdk/service/apiCore/tmmMomentsCore";

export const report = async (mid: string, content: string): Promise<boolean> => {
    try {
        const res = await axios({
            url: "/reportMoments",
            method: "post",
            data: {
                mid,
                action: "",
                content,
            },
        });
        if (res.data.err_code === 0) return true;

        return false;
    } catch (e) {
        return false;
    }
};

export default report;
