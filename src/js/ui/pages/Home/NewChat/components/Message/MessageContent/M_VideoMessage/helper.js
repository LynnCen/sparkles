import moment from "moment";

const MAX_SIZE = 220;
const MIN_SIZE = 80;

const calcSizeByRate = (width, height) => {
    const rate = width / height;

    if (width > height) {
        const validWidth = Math.max(MIN_SIZE, Math.min(MAX_SIZE, width));
        const validHeight = validWidth / rate;
        return [parseInt(validWidth), parseInt(validHeight)];
    }
    const validHeight = Math.max(MIN_SIZE, Math.min(MAX_SIZE, height));
    const validWidth = validHeight * rate;
    return [parseInt(validWidth), parseInt(validHeight)];
};

const parseDuration = (val) => {
    const duration = (val / 1000) | 0;
    let scaleList = [60, 1];
    let temp = duration;
    let res = [];

    for (let scale of scaleList) {
        let val = (temp / scale) | 0;
        temp = temp % scale;
        res.push(`${val}`.padStart(2, "0"));
    }

    return res.join(":");
};

export { calcSizeByRate, parseDuration };
