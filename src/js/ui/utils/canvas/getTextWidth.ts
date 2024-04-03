interface configOpts {
    font: string;
    width?: number;
    height?: number;
}

export const getTextWidth = (() => {
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;

    return (text: string, { font, width = 800, height = 200 }: configOpts) => {
        if (!canvas || !ctx) {
            canvas = document.createElement("canvas");
            // canvas.width = width;
            // canvas.height = height;
            ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        }

        ctx.font = font;
        const bounds = ctx.measureText(text);
        return Math.round(bounds.width);
    };
})();

export default getTextWidth;
