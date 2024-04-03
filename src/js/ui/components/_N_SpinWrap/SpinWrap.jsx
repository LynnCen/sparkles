import React from "react";
import styles from "./styles.less";

export const SpinWrap = ({ children }) => {
    return <div className={styles.box}>{children}</div>;
};

export default SpinWrap;
