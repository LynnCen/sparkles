import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import styles from "./styles.less";
import { Button, Modal, Spin } from "antd";
import Cropper from "react-cropper";
import { base64toBlob } from "utils/sn_image";
import { createBucketHash, createImageCompress, writeOriginCache } from "utils/sn_utils";
import upload from "@newSdk/service/api/s3Client/upload";
import { ScissorOutlined, LoadingOutlined } from "@ant-design/icons";
import { CloseIconBolder } from "../../icons";
import { ThemeModal } from "components/Tmm_Ant/ThemeModal";
import localeFormat from "utils/localeFormat";

export const CropperImg = forwardRef(({ onClipped }, ref) => {
    const instance = useRef();
    const [visible, setVisible] = useState(false);
    const [clipping, setClipping] = useState(false);
    const [sourceLink, setSourceLink] = useState("");

    const cancelClip = () => setVisible(false);
    const confirmClip = async () => {
        // instance.current.get
        const imageElement = instance.current;
        const cropper = imageElement.cropper;
        const dataUrl = cropper.getCroppedCanvas().toDataURL();
        setClipping(true);
        try {
            // 转 blob
            const blob = base64toBlob(dataUrl);

            // 生成 本地 hash 路径
            const hashPath = await createBucketHash(blob, "img");

            // 本地写入
            const localPath = await writeOriginCache(blob, hashPath, "png");

            if (!localPath) throw new Error("error parse");
            // 上传
            const bucketId = await upload(localPath, `${hashPath}.png`);

            if (!bucketId) throw new Error("invalid bucketId");

            const avatarInfo = {
                bucketId: bucketId,
                text: hashPath,
                file_type: "png",
                width: 240,
                height: 240,
            };

            // 生成本地压缩图
            await createImageCompress({
                source: localPath,
                width: 240,
                height: 240,
                type: "png",
                path: hashPath,
            });

            const res = await onClipped(avatarInfo);
            if (res) setVisible(false);
        } catch (e) {
            console.error("---------->>>>", e);
        } finally {
            setClipping(false);
        }
    };
    const handleClip = (src) => {
        setVisible(true);
        setSourceLink(src);
    };
    useImperativeHandle(
        ref,
        () => ({
            cancelClip,
            confirmClip,
            handleClip,
        }),
        [visible]
    );

    return (
        <div>
            <ThemeModal
                // title="clip"
                maskStyle={{ backgroundColor: "#0009" }}
                onCancel={cancelClip}
                maskClosable={false}
                footer={null}
                closeIcon={
                    <span onClick={cancelClip}>
                        <CloseIconBolder
                            overlayClass="dark-theme-color_lighter"
                            bodyStyle={{ width: 30, height: 30 }}
                        />
                    </span>
                }
                width={620}
                height={500}
                centered
                className={styles.cropperModal}
                visible={visible}
            >
                <section>
                    <Cropper
                        // zoomTo={0.1}
                        aspectRatio={1}
                        cropBoxResizable={false}
                        // viewMode={3}
                        guides={true}
                        width={200}
                        movable={true}
                        height={200}
                        preview="#tmm_cropper_preview"
                        cropBoxHeight={240} // 最低高度
                        cropBoxWidth={240}
                        minCropBoxWidth={240}
                        minCropBoxHeight={240}
                        background={true}
                        responsive={false}
                        ref={instance}
                        checkOrientation={false}
                        style={{ height: 300, width: "100%" }}
                        src={sourceLink}
                    />
                </section>

                <div className={styles.previewContainer}>
                    <div className={styles.preview} id="tmm_cropper_preview" />
                </div>

                <div className={styles.handleLine}>
                    <button className={styles.button} onClick={confirmClip}>
                        {clipping ? <Spin indicator={<LoadingOutlined />} /> : <ScissorOutlined />}
                        <span className={styles.text}>
                            {localeFormat({ id: "ConfirmTranslate" })}
                        </span>
                    </button>
                </div>
            </ThemeModal>
        </div>
    );
});

export default CropperImg;
