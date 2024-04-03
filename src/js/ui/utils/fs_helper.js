import { cacheRoot, encryptSha1 } from "./sn_utils";
import crypto from "crypto";
import path from "path";
import fs, { promises as fsPromise } from "fs";

const splitAtPosition = (str, pos) => {
    if (typeof str !== "string") throw Error("argument must be string");
    const len = str.length;
    const validPos = Math.max(Math.min(len, pos), 0);
    return [str.slice(0, validPos), str];
};

const splitAtPositionAt2 = (str) => splitAtPosition(str, 2);

const getFileType = (filepath) => {
    if (!filepath) return "";
    return filepath.slice(filepath.lastIndexOf(".") + 1);
};

const getFilename = (filepath) => {
    if (!filepath) return "";
    return filepath.slice(0, filepath.lastIndexOf("."));
};

const makeDirIfAbsent = (path) => {
    try {
        fs.accessSync(path, fs.R_OK | fs.W_OK);
    } catch (e) {
        if (e.code === "ENOENT") {
            return fs.mkdirSync(path, { recursive: true });
        }
        throw e;
    }
};

const writeFile = async (dest, data) => {
    return await fsPromise.writeFile(dest, data);
};

const writeFileIfAbsent = (dest, data) => {
    try {
        fs.accessSync(dest, fs.R_OK);
    } catch (e) {
        if (e.code === "ENOENT") {
            return writeFile(dest, data);
        }
        throw e;
    }
};

// isFile exist
const isExistFile = (filePath) => {
    try {
        const fullPath = path.join(cacheRoot, filePath); // get the full path
        fs.accessSync(fullPath, fs.R_OK);
        return fullPath;
    } catch (e) {
        throw e;
    }
};

// generate Filename
const genFilename = async (data) => {
    const [str1, str2] = splitAtPositionAt2(encryptSha1(data));
    return [str1, str2];
};

// convertToBuffer
const convertToBuffer = async (data) => {
    let res = data;
    if (data instanceof Buffer) {
        res = data;
    }
    if (data instanceof Blob) {
        const resArrayBuffer = await data.arrayBuffer();
        res = Buffer.from(resArrayBuffer);
    }

    return res;
};

// return local path
const writeFileToLocalIfAbsent = async (fileInfo, data, savedPath) => {
    try {
        const rootDir = cacheRoot;
        makeDirIfAbsent(rootDir); // mkdir if it not exists
        const res = await convertToBuffer(data);
        let dir, filename;
        if (savedPath && savedPath.dir && savedPath.filename) {
            dir = savedPath.dir;
            filename = savedPath.filename;
        } else {
            const [str1, str2] = await genFilename(res);
            dir = str1;
            filename = str2;
        }
        const filePath = `${fileInfo.type}/${dir}`;
        const fullPath = path.join(rootDir, filePath); // get the full path
        makeDirIfAbsent(fullPath); // mkdir if it not exists
        // if full path not exist make file
        await writeFileIfAbsent(`${fullPath}/${filename}.${fileInfo.fileType}`, res);
        return {
            filePathUnType: `${filePath}/${filename}`,
            filePath: `${filePath}/${filename}.${fileInfo.fileType}`,
            fullPath: `${fullPath}/${filename}.${fileInfo.fileType}`,
        };
    } catch (e) {
        throw e;
    }
};

export { writeFileToLocalIfAbsent, isExistFile, getFileType, getFilename };
