/**
 * @Author Pull
 * @Date 2021-02-07 14:14
 * @project tools
 */
import React from "react";

class Device {
    static isMac() {
        return process && process.platform === "darwin";
    }
}

class MsgTools {
    static createFile({
        icon,
        width,
        height,
        icon_w = 45,
        icon_h = 45,
        margin_top = 5,
        text = "123456789",
        background_color = "#fff",
        color = "#46536f",
    }) {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = background_color;
            ctx.fillRect(0, 0, width, height);

            canvas.style.backgroundColor = `#aaa6`;
            // document.body.append(canvas);

            const img = new Image(width, height);
            const w_space = (width - icon_w) / 2;
            img.onload = () => {
                ctx.drawImage(img, w_space, margin_top, icon_w, icon_h);
                const native_w = ctx.measureText(text).width;
                const optimum_w = width - 15;
                const top = margin_top + icon_h;

                const font_size = 12;
                ctx.font = `${12}px menu`;
                ctx.fillStyle = color;
                ctx.textAlign = "left";
                try {
                    if (native_w > optimum_w) {
                        const ratio = optimum_w / native_w;
                        const chartLen = text.length * ratio;
                        const optimum_str = text.slice(0, chartLen) + "...";

                        const optimum_chat_w = ctx.measureText(optimum_str).width;
                        const optimum_margin = (width - optimum_chat_w) / 2;

                        const optimum_top = (height - top) / 2 + top + font_size / 2;
                        ctx.fillText(optimum_str, optimum_margin, optimum_top);
                        resolve(canvas.toDataURL("image/jpg"));
                    } else {
                        const optimum_top = (height - top) / 2 + top + font_size / 2;
                        const optimum_margin = (width - native_w) / 2;
                        ctx.fillText(text, optimum_margin, optimum_top);
                        resolve(canvas.toDataURL("image/jpg"));
                    }
                } catch (e) {
                    resolve(false);
                }
            };
            img.onerror = () => resolve(false);
            img.src = icon;
        });
    }
}

export const device = Device;
export { MsgTools };
