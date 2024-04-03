import styles from "components/TmmSessionBoard/components/SessionInfo/styles.less";
import { CameraIcon } from "../../../../icons";
import React, { Fragment, useRef } from "react";
import useFilePicker from "../../../../hooks/useFilePicker";
import nodePath from "path";
import { message } from "antd";
import localeFormat from "utils/localeFormat";
import { updateGroupAvatar } from "@newSdk/service/api/group/updateGroupAvatar";
import CropperImg from "components/_N_Cropper/CropperImg";
import session from "../../../../stores_new/session";

const SupportType = [".png", ".webp", ".jpg", ".jpeg", ".bmp"];
export const GroupAvatarMask = ({ gid, editAble = true }) => {
    const cropperRef = useRef();

    const { handlePick } = useFilePicker({
        accept: "image/jpg, image/png, image/jpeg, image/webp, image/bmp",
    });

    const handleClip = async () => {
        if (!editAble) return;
        if (!cropperRef.current) return;
        const path = await handlePick();
        if (!path) return;
        const ext = nodePath.extname(path) || "";
        if (!SupportType.includes(ext.toLowerCase()))
            return message.warn(localeFormat({ id: "unSupportImageType" }));
        cropperRef.current.handleClip(path);
    };

    //
    const onClipped = async (avatar) => {
        const res = await updateGroupAvatar(gid, avatar);
        if (res) message.success(localeFormat({ id: "EditSuccessful" }));
        else message.warn(localeFormat({ id: "EditFailed" }));

        return res;
    };
    return (
        <Fragment>
            <aside className={styles.mask} onClick={handleClip}>
                <span className={styles.editIcon}>
                    <CameraIcon />
                </span>
            </aside>
            <CropperImg ref={cropperRef} onClipped={onClipped} />
        </Fragment>
    );
};

export default GroupAvatarMask;
