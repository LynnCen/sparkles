/**
 * @Author Pull
 * @Date 2021-08-19 14:24
 * @project layout
 */
import styles from "./layout.less";
import React, { useEffect } from "react";
import LightBox from "./main";
import "./global.css";
import "../../global.theme.css";

export default () => {
    return (
        <section className={styles.container}>
            <LightBox />
        </section>
    );
};
