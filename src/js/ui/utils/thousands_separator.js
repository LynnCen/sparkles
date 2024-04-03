/**
 * @Author Pull
 * @Date 2021-10-14 16:04
 * @project thousands_separator
 */
export const thousandsSeparator = (num) => {
    if (!num) return num;

    const reg = /\d{1,3}(?=(\d{3})+$)/g;
    return `${num}`.replace(reg, "$&,");
};
