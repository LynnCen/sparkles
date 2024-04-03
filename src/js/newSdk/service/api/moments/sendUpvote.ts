import axios from "@newSdk/service/apiCore/tmmMomentsCore";
import ErrorStatus from "@newSdk/service/api/Error/ErrorStatus";

const REQUEST_API_UPVOTE = "upvoteMoment";
const REQUEST_API_UPVOTE_CANCEL = "cancelUpvoteMoment";

type ParamsOfUpvoteType = {
    id: string;
};

const sendUpvote = async (data: ParamsOfUpvoteType) => {
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

const sendCancelUpvote = async (data: ParamsOfUpvoteType) => {
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

export { sendUpvote, sendCancelUpvote };
