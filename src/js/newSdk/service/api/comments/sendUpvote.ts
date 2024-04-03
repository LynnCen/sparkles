import axios from "@newSdk/service/apiCore/tmmMomentsCore";
import ErrorStatus from "@newSdk/service/api/Error/ErrorStatus";

const REQUEST_API_UPVOTE = "upvoteComment";
const REQUEST_API_UPVOTE_CANCEL = "cancelUpvoteComment";

type RequestOfUpvoteType = {
    id: string;
    mid: string;
    pid: string;
};

const sendUpvoteComment = async (data: RequestOfUpvoteType) => {
    try {
        const res = await axios({
            url: REQUEST_API_UPVOTE,
            method: "post",
            data: data,
        });
        if (res.data.status === 100006) {
            const {
                // @ts-ignore
                msg,
                data: { status },
            } = res;
            throw new ErrorStatus(msg, status);
        }
        return res.data.items || [];
    } catch (e) {
        throw e;
    }
};

const sendCancelUpvoteComment = async (data: RequestOfUpvoteType) => {
    try {
        const res = await axios({
            url: REQUEST_API_UPVOTE_CANCEL,
            method: "post",
            data: data,
        });
        if (res.data.status === 100006) {
            const {
                // @ts-ignore
                msg,
                data: { status },
            } = res;
            throw new ErrorStatus(msg, status);
        }
        return res.data.items || [];
    } catch (e) {
        throw e;
    }
};

export { sendUpvoteComment, sendCancelUpvoteComment };
