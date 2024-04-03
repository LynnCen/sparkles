import getTextWidth from "utils/canvas/getTextWidth";
import _ from "lodash";

const D_MAX_WIDTH = 146;
const D_FONT_SIZE = 13;
const D_RETAIN_LEN = 4;
const DEVIATION = 8;

export const renderFileName = (
    name: string,
    ext: string,
    { MAX_WIDTH = D_MAX_WIDTH, FONT_SIZE = D_FONT_SIZE, RETAIN_LEN = D_RETAIN_LEN }
) => {
    const FONT_STYLE = `${FONT_SIZE}px Helvetica, Arial, sans-serif`;

    console.log(name, ext);
    try {
        const getW = _.partial(getTextWidth, _, { font: FONT_STYLE });

        // 1。总长度未超出
        const text = `${name}${ext && "." + ext}`;
        const fullWidth = getW(text);
        if (fullWidth < MAX_WIDTH) return text;

        // 2. 文字超出
        const len = name.length;

        // 2.1 截取后缀+后四位字符 计算长度
        const suffix = `${name.slice(len - RETAIN_LEN)}${ext && "." + ext}`;
        const suffixWidth = getW(suffix);

        // 2.2 计算前面可容纳宽度
        const prefixWidth = MAX_WIDTH - suffixWidth - getW("...");

        // 3.3 计算源文本宽度
        const prefixFull = name.slice(0, len - RETAIN_LEN);
        const prefixFullWidth = getW(prefixFull);

        // 3.4 根据源文本宽度和可显示文本宽度 计算比值
        const ratio = prefixWidth / prefixFullWidth;

        // 3.5 根据比值找到初始化位置
        let pos = Math.round(len * ratio);
        let sliceName = name.slice(0, pos) + "...";

        // 3.6 检查宽度是否在误差内
        let sliceW = getW(sliceName);
        if (sliceW <= prefixWidth + DEVIATION) return sliceName + `${suffix}`;

        // 3.7 计算合适的长度
        let limit = 10;
        while (limit) {
            // 超出长度 裁剪
            if (sliceW > prefixWidth) {
                // 1. 计算超出长度
                const over = sliceW - prefixWidth;
                // 2. 转换字符长
                const subtractLen = Math.ceil((over / prefixFullWidth) * len);
                pos -= subtractLen;
                sliceName = name.slice(0, pos) + "...";
                // 3.6 检查宽度是否在误差内
                sliceW = getW(sliceName);
                if (sliceW <= prefixWidth + DEVIATION) return sliceName + `${suffix}`;
            }

            // 十次没有得到正确的结构则视为异常
            limit--;
            // else {
            //     // 低于长度 向上查找 暂不处理 ……^-^
            //
            // }
        }

        return sliceName + suffix;
    } catch (e) {
        console.log("clip text error", e);
        return `${name}.${ext}`;
    }
};

export default renderFileName;
