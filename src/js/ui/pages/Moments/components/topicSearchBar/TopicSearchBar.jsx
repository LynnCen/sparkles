/**
 * @Author Pull
 * @Date 2021-10-14 13:31
 * @project index
 */
import React, { Fragment } from "react";
import { Input } from "antd";
import { SearchIcon } from "../../../../icons";
import useTopicSearchBar from "./useTopicSearchBar";
import styles from "./styles.less";
export const TopicSearchBar = () => {
    const { value, setValue, topicList, onBlue, onFocus } = useTopicSearchBar();
    return (
        <Fragment>
            <Input
                value={value}
                onChange={({ target }) => setValue(target.value)}
                onBlur={onBlue}
                onFocus={onFocus}
                className="dark-theme-bg_darkness dark-theme-color_lighter"
                addonBefore={
                    <Fragment>
                        <SearchIcon
                            overlayClassName="dark-theme-color_dark"
                            bodyStyle={{ color: "#a4aac5" }}
                        />
                        <span className={`${styles.suffix} dark-theme-color_lighter`}>#</span>
                    </Fragment>
                }
            />

            {topicList.length ? (
                <section
                    className={`${styles.topicList} dark-theme-bg_darkness dark-theme-border_darkness`}
                >
                    {topicList.map((item) => (
                        <p className={`${styles.item} topic-name dark-theme-color_lighter`}>
                            {item}
                        </p>
                    ))}
                </section>
            ) : null}
        </Fragment>
    );
};

export default TopicSearchBar;
