export function formatNumber(num) {
    const type = typeof num;
    if (type !== "number") throw new Error("must be number type");

    if (num === 0) {
        return "";
    } else if (num < 1000) {
        return num.toFixed();
    } else if (num < 1000000) {
        const showNum = num / 1000;
        return `${showNum.toFixed(1)}K`;
    } else {
        const showNum = num / 1000000;
        return `${showNum.toFixed(1)}m`;
    }
}
