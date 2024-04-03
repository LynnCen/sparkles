const SUCCESS_CODE = 0;

export const isSuccess = (reponse: { data: { status?: number; [attr: string]: any } }) => {
    try {
        const { data: { status } = {} } = reponse;
        if (status !== SUCCESS_CODE) return false;

        return true;
    } catch (e) {
        return false;
    }
};
