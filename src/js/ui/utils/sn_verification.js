/**
 * @Author Pull
 * @Date 2021-10-22 19:13
 * @project sn_verification
 */
import sizeOf from "image-size";
import nodeFs from "fs";

export const fileSize = (path) =>
    new Promise((resolve) => {
        if (!path) return 0;

        nodeFs.stat(path, (err, res) => {
            if (err) return resolve(0);

            resolve(res.size);
        });
    });

export const overThanLimitWithFile = async (path, limitSize) =>
    new Promise(async (resolve) => {
        const limitOfMb = 1024 * 1024 * limitSize;

        const size = await fileSize(path);

        if (size > limitOfMb) return resolve(true);

        return resolve(false);
    });
