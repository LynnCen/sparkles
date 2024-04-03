import { base64toBlob } from "utils/sn_image";
import { checkOriginCache, createBucketHash, writeOriginCache } from "utils/sn_utils";
import { device } from "utils/tools";

const SIZE = device.isMac() ? 16 : 256;
const CanvasSize = device.isMac() ? 24 : 256;

const position = (CanvasSize - SIZE) / 2;

export const createRoundAvatar = (filePath: string) =>
    new Promise((resolve) => {
        if (!filePath) resolve(false);
        const $canvas = document.createElement("canvas");

        $canvas.width = CanvasSize;
        $canvas.height = CanvasSize;

        const $img = new Image();
        $img.setAttribute("crossOrigin", "Anonymous");
        $img.onload = async () => {
            const ctx = $canvas.getContext("2d");

            ctx?.arc(CanvasSize / 2, CanvasSize / 2, SIZE / 2, 0, Math.PI * 2, false);
            ctx?.clip();
            ctx?.drawImage($img, position, position, SIZE, SIZE);
            ctx?.closePath();
            // document.body.appendChild($canvas)

            const base64 = $canvas.toDataURL("image/png");
            // 转 blob
            const blob = base64toBlob(base64);
            // 生成 本地 hash 路径
            const hashPath = await createBucketHash(blob, "avatar_round");

            const existPath = await checkOriginCache(hashPath, "png");
            if (existPath) return resolve(existPath);
            // 本地写入
            const localPath = await writeOriginCache(blob, hashPath, "png");
            resolve(localPath);
        };
        $img.onerror = () => resolve(false);
        $img.src = filePath;
    });
