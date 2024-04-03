import nodePath from "path";
import nodeFs from "fs";

export const isDir = async (filePath: string): Promise<boolean> => {
    try {
        const doc = await nodeFs.promises.stat(filePath);

        return doc.isDirectory();
    } catch (e) {
        return false;
    }
};

export const Mb = (mb: number): number => mb * 1024 * 1024;
