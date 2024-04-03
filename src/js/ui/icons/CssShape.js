/**
 * @Author Pull
 * @Date 2021-03-03 13:38
 * @project CssShape
 */
import React from "react";
import styles from "./styles.less";
import classNames from "classnames";
import { LoadingChrysanthemum } from "./index";

export default class AmazingCss {
    static LoadingLine() {
        return (
            <div className={classNames(styles.loader)}>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
        );
    }

    static Plus({ title, bodyStyle = {}, overlayClass = "" }) {
        return <i title={title} className={`${styles.plus} ${overlayClass}`} style={bodyStyle} />;
    }

    static LoadingChrSpin(props) {
        return (
            <span className={styles.spin}>
                <LoadingChrysanthemum {...props} />
            </span>
        );
    }
}
