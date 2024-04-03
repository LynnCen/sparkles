import axios from "axios";

export const CANCEL_MESSAGE_FLAG = `tmm_cancel_request`;
export default (cancelMessage = CANCEL_MESSAGE_FLAG) => {
    const cancelToken = axios.CancelToken.source();

    return {
        token: cancelToken.token,
        cancel: () => cancelToken.cancel(cancelMessage),
    };
};

export const requestMan = (function () {
    let source = axios.CancelToken.source();

    return {
        getCancelToken: () => source.token,
        cancelAll() {
            const newSource = axios.CancelToken;
            source.cancel("reject");
            source = newSource.source();
        },
    };
})();
