import { message } from "antd";
import localFormat from "utils/localeFormat";
import { base64toBlob, mergeImages } from "utils/sn_image";
import { createSha1Hash, writeOriginCache } from "utils/sn_utils";
import createCancelToken, { CANCEL_MESSAGE_FLAG } from "@newSdk/service/apiCore/createCancelToken";
import { createGroupChatId } from "@newSdk/utils";
import tmmUserInfo from "@newSdk/model/UserInfo";
import createGroupChat from "@newSdk/service/api/group/createGroup";
import tmSession from "../../stores_new/session";
import upload from "@newSdk/service/api/s3Client/upload";
import { updateGroupAvatar } from "@newSdk/service/api/group/updateGroupAvatar";
import userProxy from "../../stores_new/userProxy";

export const GroupMaxMemberLimit = 100;
const separator = ",";
const nameLimitCount = 4;
export const chatNameLimitLen = 30;
export async function* createGroup(uidList: string[]) {
    if (uidList.length > GroupMaxMemberLimit)
        return message.warn(localFormat({ id: "overGroupMemberSize" }));

    const memberIds = uidList;

    // 添加当前登录用户
    if (!uidList.includes(tmmUserInfo._id)) uidList.unshift(tmmUserInfo._id);
    // 获取基本信息
    const userInfoList = uidList.map((uid) => ({ uid, ...userProxy.getProxyUserBaseInfo(uid) }));

    // 群名称
    let name = "";

    // 用户头像手机
    const imgList: string[] = [];
    let nameCount = 0;

    userInfoList.forEach((item, i) => {
        if (item.avatarPath) imgList.push(item.avatarPath);
        if (item.name && nameCount < nameLimitCount) {
            name += `${item.name}${separator}`;
            nameCount++;
        } else if (nameCount === nameLimitCount) name += "...";
    });

    // 小于 nameLimitCount 时，去除末尾分隔符
    if (name.endsWith(separator)) name = name.slice(0, name.length - separator.length);

    // 字符超出限制
    if (name.length > chatNameLimitLen) name = `${name.slice(0, chatNameLimitLen - 2)}...`;

    // 生成头像
    const ops = {
        file_type: "png",
        width: 240,
        height: 240,
    };

    // request
    const { token, cancel } = createCancelToken();

    // cancel request;
    yield cancel;

    let showErrorTip = true;
    try {
        const gAvatar = await mergeImages(imgList.slice(0, 4), {
            width: ops.width,
            height: ops.height,
        });
        // const blob = base64toBlob(gAvatar, "image/png");
        const blob = base64toBlob(gAvatar);
        // const buf = await blob.arrayBuffer();
        const contentHash = await createSha1Hash(blob);
        const bucketPath = `img/${contentHash.slice(0, 2)}/${contentHash}`;
        const localPath = (await writeOriginCache(blob, bucketPath, ops.file_type)) || "";

        // 生成 group id
        const gid = createGroupChatId(tmmUserInfo._id);
        // 创建群组
        const done = await createGroupChat({ gid, name, memberIds, localPath }, token);
        if (done) {
            // self.onBack();
            // db publish nc
            setTimeout(() => tmSession.selectSession(done), 10);

            // 上传群头像
            if (localPath && bucketPath) {
                upload(localPath, `${bucketPath}.png`).then((bucketId) => {
                    if (!bucketId) return false;
                    // to create session
                    const avatar = {
                        bucketId: bucketId || "",
                        file_type: ops.file_type,
                        text: bucketPath,
                        height: ops.height,
                        width: ops.width,
                    };

                    // 更新群头像
                    updateGroupAvatar(gid, avatar);
                });
            }

            return true;
        }

        return false;
    } catch (e: any) {
        if (e.message === CANCEL_MESSAGE_FLAG) {
            return false;
        } else {
            message.error(localFormat({ id: "createGroupFail" }));
        }
    }
}

export default createGroup;
