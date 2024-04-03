/**
 * @Author Pull
 * @Date 2021-11-08 14:27
 * @project NoFrameModal
 */

import React from "react";
import { Modal } from "antd";
import styles from "./styles.less";
import { CloseIconBolder } from "../../icons";

export const NoFrameModal = ({ children, width = 520, title, ...props }) => {
    const handleClose = props.onClose || (() => {});
    return (
        <Modal
            header={null}
            width={width}
            footer={null}
            maskStyle={{ background: "#0002", webkitAppRegion: "drag" }}
            className={`${styles.noFrame} ${props.className}`}
            {...props}
        >
            <header className={styles.header} onMouseDown={(e) => e.stopPropagation()}>
                <span>{title}</span>
                <span className={`${styles.closeIcon} cr-p`} onClick={handleClose}>
                    <CloseIconBolder bodyStyle={{ width: 30, height: 30 }} />
                </span>
            </header>
            <section onMouseDown={(e) => e.stopPropagation()}>{children}</section>
        </Modal>
    );
};

export default NoFrameModal;
