/**
 * @Author Pull
 * @Date 2021-10-13 16:14
 * @project index
 */
import React, { Fragment, useEffect, useRef, useState } from "react";
import { injectIntl } from "react-intl";
import styles from "./topic.less";
import classNames from "classnames/bind";
import PostMoment from "../components/postMoments/PostMoment";
import { Link } from "react-router-dom";
import { thousandsSeparator } from "utils/thousands_separator";
import { addTopicObserver, removeTopicObserver } from "@newSdk/logic/Topic";

import { keys, keyBy } from "lodash";
import MomentsLayout from "../MomentsLayout";
import loadTopicList from "@newSdk/logic/Topic/loadTopicList";

const cx = classNames.bind(styles);
const Topic = ({ intl }) => {
    const [showTopicIds, setShowTopicIds] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        showTopicIds.length && addTopicObserver(getData);
        if (showTopicIds.length) {
            return removeTopicObserver(getData);
        }
    }, [showTopicIds]);

    useEffect(() => {
        (async () => {
            const it = loadTopicList();

            const { value: cache } = await it.next();

            setData(cache);
            // 刷新
            it.next().then(({ value }) => {
                setData(value);
                setShowTopicIds(keys(value));
                setLoading(false);
            });
        })();
    }, []);

    const getData = (d) => {
        const map = keyBy(d, "id");

        const _d = data.map((item) => {
            if (map[item.tid]) {
                return { ...item, name: map[item.tid].name };
            } else return item;
        });
        setData([..._d]);
    };

    return (
        <MomentsLayout>
            <i className={cx("space")} />
            <section className={cx("moment-topics", "dark-theme-bg_lighter")}>
                {!!data.length ? (
                    data.map((item, i) => {
                        return (
                            <Link to={`/topic/${item.tid}`} className={cx("topic-item")}>
                                <strong className={cx("topic-number")}>{i + 1}</strong>
                                <span
                                    className={`${cx(
                                        "topic-name"
                                    )} topic-name dark-theme-color_lighter`}
                                >
                                    {item.name}
                                </span>
                                <span className={`${cx("topic-moments", "dark-theme-color_grey")}`}>
                                    {thousandsSeparator(item.counts || 0)}{" "}
                                    {intl.formatMessage({ id: "moments" })}
                                </span>
                            </Link>
                        );
                    })
                ) : (
                    <div className={cx("empty")}>
                        {loading
                            ? intl.formatMessage({ id: "initStatus_pulling" })
                            : intl.formatMessage({ id: "comment_nomore" })}
                    </div>
                )}
            </section>

            <PostMoment />
        </MomentsLayout>
    );
};

export default injectIntl(Topic);
