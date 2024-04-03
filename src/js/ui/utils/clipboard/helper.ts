import { clipboard } from "electron";
import nodeFs from "fs";
import { createImageCache } from "utils/sn_utils";
import sizeOf from "image-size";

export const readLocalPathFromClipboard = (): string | false => {
    let filePath = "";

    try {
        const { platform } = process;
        if (platform === "win32") {
            const rawPath = clipboard.readBuffer("FileNameW").toString("ucs2");
            filePath = rawPath.replace(new RegExp(String.fromCharCode(0), "g"), "");
        } else if (platform === "darwin") {
            filePath = clipboard.read("public.file-url").replace("file://", "");
        }
        filePath = decodeURI(filePath);
    } catch (e) {
        console.error("error syntax clipboard ", e);
    }

    if (filePath && nodeFs.existsSync(filePath)) return filePath;
    return false;
};

type localInfo = ReturnType<typeof createImageCache>;
export const readImageFromClipboard = async (): Promise<localInfo> => {
    const image = clipboard.readImage();
    if (image.isEmpty()) return false;

    const buf = image.toPNG();
    return await createImageCache(buf, sizeOf(buf));
};
