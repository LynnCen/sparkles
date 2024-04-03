import React from "react";
import styles from "./index.less";
import localeFormat from "utils/localeFormat";
import nc, { Event } from "@newSdk/notification/index";
const Failed = (info) => {
    function Retry() {
        console.log("retry-update");
        nc.publish("retry-update", true);
    }
    return (
        <section className={styles.failed}>
            <div className={styles.icon}></div>
            <div className={styles.description}>{localeFormat({ id: "pc_download_fail" })}</div>
            <div className={styles.button} onClick={Retry}>
                Retry
            </div>
        </section>
    );
};
export default Failed;
