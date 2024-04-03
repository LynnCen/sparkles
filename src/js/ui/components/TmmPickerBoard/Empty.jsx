import React, { Component } from "react";
import styles from "./styles.less";
import localFormat from "utils/localeFormat";
export default class Empty extends Component {
    render() {
        return (
            <section className={styles.empty}>
                <div className={styles.bg}></div>
                <div className={styles.text}>{localFormat({ id: "no_data" })}</div>
            </section>
        );
    }
}
