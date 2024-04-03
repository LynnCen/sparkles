/**
 * @Author Pull
 * @Date 2021-10-14 15:05
 * @project TopicIcon
 */
import React from "react";
import styles from "./styles.less";

export const TopicIcon = () => {
    return (
        <section className={`${styles.topicIcon} dark-theme-bg_lighter`}>
            <article className={`${styles.icon} dark-theme-color_deep`}>#</article>
            <aside className={`${styles.footer} dark-theme-color_dark`} />
        </section>
    );
};

export default TopicIcon;
