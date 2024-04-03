import React, { useEffect } from "react";
import styles from "./index.less";
import { ipcRenderer, remote } from "electron";
const NewVersion = ({ versions }) => {
    // const versions = {
    //     is_forced: -1, // 1-强制更新 -1 不强制更新
    //     is_new_version: 1, //是否有新版本 1-有 -1没有
    //     logs: [
    //         {
    //             log: [
    //                 "人类总不会寂寞，以为生命是进步的，是天生的。",
    //                 "节省时间，也就是使一个人的有限生命，更加有效，而也即等于延长了人的生命。",
    //             ],
    //             title: "news",
    //         },
    //         {
    //             log: [
    //                 "养成他们有耐劳作的体力，纯洁高尚的道德，广博自由能容纳新潮流的精神，也就是能在世界新潮流中游泳，不被淹没的力量。",
    //                 "log22222",
    //             ],
    //             title: "logs",
    //         },
    //     ],
    //     upgrade_source: "https://dev-im-api.tmmtmm.com.tr:7100/",
    //     version: "2.1.140",
    // };
    // const info = JSON.parse(versions);
    useEffect(() => {
        console.log("NewVersion", versions);
    }, []);
    function updateVersion() {
        console.log("updateVersion");
        ipcRenderer.send("checkForUpdate", versions.upgrade_source);
    }
    return (
        <section className={styles.container}>
            <div className={styles.icon}></div>
            <article className={styles.content}>
                <div className={styles.version}>{versions.version}</div>
                {versions.logs &&
                    versions.logs.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <div className={styles.description}>{item.title}</div>
                                {item.log.map((i, k) => {
                                    return (
                                        <div className={styles.description} key={i}>{`${
                                            k + 1
                                        }.${i}`}</div>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                {/* <div className={styles.description}>1.Screen sharing during group video calls</div> */}
                <div className={styles.button} onClick={updateVersion}>
                    Update Now
                </div>
            </article>
        </section>
    );
};
export default NewVersion;
