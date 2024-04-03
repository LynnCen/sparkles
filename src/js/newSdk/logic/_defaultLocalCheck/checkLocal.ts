import SourceMap from "@newSdk/logic/_defaultLocalCheck/_sourceMap";
import { writeCompressCache, writeOriginCache } from "utils/sn_utils";
import nodeFs from "fs";
import { remote } from "electron";
import nodePath from "path";
type SourceProps = {
    bucketId: string;
    width: number;
    height: number;
    objectId: string;
    fileType: string;
};

const FLAG = "local";
export const checkLocal = async (props: SourceProps, isOrigin: boolean) => {
    const { bucketId, width, height, objectId, fileType } = props;
    const matchPathItem = SourceMap[objectId];
    if (bucketId !== FLAG || !matchPathItem) return false;
    // if (!objectId.includes("avatar/default")) return false;

    try {
        const buf = await nodeFs.promises.readFile(
            nodePath.resolve(remote.app.getAppPath(), matchPathItem)
        );

        if (isOrigin) {
            return await writeOriginCache(buf, objectId, fileType);
        }

        return await writeCompressCache(buf, objectId, {
            width,
            height,
            type: fileType,
        });
    } catch (e) {
        console.error("--------->>>> copy default error", e);
        return false;
    }
};

export default checkLocal;
