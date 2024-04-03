/**
 * @Author Pull
 * @Date 2021-10-18 16:04
 * @project UploadButton
 */
import React, { memo } from "react";
import { CssPlus } from "../../../../../icons";
import styles from "../styles.less";

export const UploadButton = memo((attrProps) => {
    return (
        <div className={`${styles.uploadButton} dark-theme-bg_lighter`} {...attrProps}>
            <CssPlus bodyStyle={{ fontSize: 18 }} overlayClass="dark-theme-color_deep" />
        </div>
    );
});

export default UploadButton;
