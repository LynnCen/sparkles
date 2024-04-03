import nodeFs, { constants } from "fs";

export const isAccess = async (avatarPath: string) => {
    if (!avatarPath) return false;
    try {
        if (avatarPath) {
            await nodeFs.promises.access(avatarPath, constants.F_OK | constants.R_OK);
            return true;
        }
    } catch (e) {
        return false;
    }
};

export const decorateLink = (path: string) =>
    path.includes("?") ? `${path}&_t=${Date.now()}` : `${path}?_t=${Date.now()}`;
