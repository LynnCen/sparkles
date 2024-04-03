import getObject from "@newSdk/service/api/s3Client/getObject";
import { writeOriginCache } from "utils/sn_utils";
import { writeFileToLocalIfAbsent } from "utils/fs_helper";

export async function downloadToLocal(awsObj, dirName = "t_img") {
    try {
        const { bucketId } = awsObj;
        const filename = awsObj.objectId || awsObj.text;
        const fileType = awsObj.fileType || awsObj.file_type;
        const binary = await getObject({
            filename,
            fileType,
            bucketID: bucketId,
        });
        if (!binary) return;
        const filePath = filename.split("/");

        const { fullPath } = await writeFileToLocalIfAbsent({ type: dirName, fileType }, binary, {
            dir: filePath[1],
            filename: filePath[2],
        });
        return fullPath;
    } catch (e) {
        // console.log(e);
        return "";
    }
}
