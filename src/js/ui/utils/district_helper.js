const CHINA = ["zh-CN", "zh-TW"];

export const formatDateTime = (local, short) => {
    // if (CHINA.includes(local)) {
    //     return !short ? "LL A hh:mm" : "A hh:mm";
    // }
    // return !short ? "LL hh:mm A" : "hh:mm A";

    return formatFor24Hours(local, short);
};

const formatFor12Hours = (local, short) => {
    if (CHINA.includes(local)) {
        return short ? "A hh:mm" : "LL A hh:mm";
    }
    return short ? "hh:mm A" : "LL hh:mm A";
};

const formatFor24Hours = (local, short) => {
    if (CHINA.includes(local)) {
        return short ? "HH:mm" : "LL HH:mm";
    }
    return short ? "HH:mm" : "LL HH:mm";
};

export default formatDateTime;
