/**
 * @Author Pull
 * @Date 2021-10-14 10:51
 * @project index
 */
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Input } from "antd";
import classnames from "classnames/bind";
import TopicIcon from "./TopicIcon";
import { thousandsSeparator } from "utils/thousands_separator";
import { withRouter } from "react-router-dom";
import { getTopics, getMomentIdByTid, searchByName } from "@newSdk/logic/Topic";
import { BackIcon2, SearchIcon } from "../../../icons";
import MasonryList from "../components/masonry/Masonry";
import { orderBy, head } from "lodash";
import PostMoment from "../components/postMoments/PostMoment";
import { injectIntl } from "react-intl";

import styles from "./styles.less";
import Header from "../../Header";
import nc from "@newSdk/notification";
import FeedDetails from "@newSdk/model/moments/FeedDetails";
import { fetchFeeds } from "@newSdk/logic/moments/fetchFeeds";
import UiEventCenter, { UiEventType } from "utils/sn_event_center";

const cx = classnames.bind(styles);

const TopicDetail = (props) => {
    const [topicId, setTopicId] = useState("");
    const [topicInfo, setTopicInfo] = useState({});
    const [moments, setMoments] = useState([]);
    const [isFirst, setIsFirst] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    const [topicList, setTopicList] = useState([]);
    const [selectIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef();
    const masonryRef = useRef();
    const topicSearchListRef = useRef();

    // moments 刪除
    useEffect(() => {
        nc.on(FeedDetails.Event.MomentsChange, _handleDeleteMoments);
        UiEventCenter.on(UiEventType.MOMENT_REFRESH, refreshMoments);

        return () => {
            nc.off(FeedDetails.Event.MomentsChange, _handleDeleteMoments);
            UiEventCenter.off(UiEventType.MOMENT_REFRESH, refreshMoments);
        };
    }, [moments, masonryRef.current]);

    useEffect(() => {
        setTopicId(props.match.params.id);
    }, [props.match.params.id]);

    useEffect(() => {
        topicId &&
            getTopics([topicId]).then((data) => {
                data && setTopicInfo(data[0]);
            });

        topicId &&
            getMomentIdByTid(topicId).then((data = []) => {
                // console.log(data);
                if (masonryRef.current) {
                    masonryRef.current.resizeMasonry();
                    masonryRef.current.clearCache();
                }
                setMoments(orderBy(data, ["createTime"], ["desc"]));
            });
    }, [topicId]);

    useEffect(() => {
        if (topicList) {
            setSelectedIndex(0);
        }
    }, [topicList]);

    useEffect(() => {
        document.addEventListener("keydown", keyUp, false);

        return () => {
            document.removeEventListener("keydown", keyUp, false);
        };
    }, [topicList, inputRef.current, selectIndex]);

    const keyUp = (event) => {
        inputRef.current && inputRef.current.onBlur();
        event.stopPropagation();

        let forceIndex = selectIndex;

        // enter
        if (event.keyCode === 13) {
            return onEnter(topicList[forceIndex]);
        }

        if (event.keyCode === 38) {
            forceIndex = Math.max(0, selectIndex - 1);
        }
        if (event.keyCode === 40) {
            forceIndex = Math.min(topicList.length - 1, selectIndex + 1);
        }

        setSelectedIndex(forceIndex);
        autoForceNode(forceIndex);
    };

    const autoForceNode = (forceIndex) => {
        if (topicSearchListRef.current) {
            try {
                const forceNode = topicSearchListRef.current.querySelector(
                    `*[data-index="${forceIndex}"]`
                );
                forceNode && forceNode.scrollIntoViewIfNeeded();
            } catch (e) {
                console.log(e);
            }
        }
    };

    // 删除
    const _handleDeleteMoments = (list, tag) => {
        if (tag === FeedDetails.Tag.Del) {
            const ids = list.map(({ id }) => id);
            const _moments = moments.filter(({ id }) => !ids.includes(id));
            setMoments(_moments);
            console.log("effect delete", masonryRef.current);
            if (masonryRef.current) masonryRef.current.resizeMasonry();
        }
    };

    const refreshMoments = async () => {
        await fetchFeeds();
        getMomentIdByTid(topicId).then((data = []) => {
            setMoments(orderBy(data, ["createTime"], ["desc"]));
            if (masonryRef.current) masonryRef.current && masonryRef.current.resizeMasonry();
        });
    };

    const onChange = ({ target: { value } }) => {
        !isFirst && setIsFirst(true);
        setSearchVal(value);
        if (!value && !value.trim()) {
            return setTopicList([]);
        }
        searchByName(value).then(setTopicList);
    };

    const onEnter = (item) => {
        console.log(item);
        props.history.push(`/topic/${item.id}`);
        setSearchVal(item.name);
        return setTopicList([]);
    };

    return (
        <section className={cx("topic-detail")}>
            <header
                className={cx(
                    "topic-detail-header",
                    "electron_drag-able",
                    "dark-theme-bg_normal",
                    "dark-theme-border_normal"
                )}
            >
                <aside
                    className={cx("header-back", "electron_drag-disable")}
                    onClick={props.history.goBack}
                >
                    <span>
                        <BackIcon2 overlayClassName="dark-theme-color_lighter" />
                    </span>
                </aside>
                <article className={cx("header-search", "electron_drag-disable")}>
                    <Input
                        value={!isFirst ? topicInfo && topicInfo.name : searchVal}
                        onChange={onChange}
                        className={cx(
                            "input-style",
                            "dark-theme-bg_darkness",
                            " dark-theme-color_lighter"
                        )}
                        addonBefore={
                            <Fragment>
                                <SearchIcon
                                    overlayClassName="dark-theme-color_dark"
                                    bodyStyle={{ color: "#a4aac5" }}
                                />
                                <span className={`${styles.suffix} dark-theme-color_lighter`}>
                                    #
                                </span>
                            </Fragment>
                        }
                        ref={inputRef}
                    />
                    {!!topicList.length && (
                        <section
                            ref={topicSearchListRef}
                            className={`${styles.topicList} dark-theme-bg_darkness dark-theme-border_darkness`}
                        >
                            {topicList.map((item, index) => (
                                <div
                                    className={classnames({
                                        [styles.topicSelected]: index === selectIndex,
                                    })}
                                    data-index={index}
                                    onClick={() => onEnter(item)}
                                    key={item.id}
                                >
                                    <p
                                        className={`${styles.item} topic-name dark-theme-color_lighter`}
                                    >
                                        {item.name}
                                    </p>
                                </div>
                            ))}
                        </section>
                    )}
                </article>
            </header>
            <main className={cx("topic-detail-content", "dark-theme-bg_deep")}>
                <aside className={cx("content-topic")}>
                    <TopicIcon defaultname={topicInfo && topicInfo.name} />
                    <div className={cx("topic-info")}>
                        <strong
                            className={`${cx("topic-name")} topic-name dark-theme-color_lighter`}
                        >
                            #{topicInfo && topicInfo.name}
                        </strong>
                        {!!moments.length && (
                            <span
                                className={cx(
                                    "topic-moments-count",
                                    "moments-count",
                                    "dark-theme-color_grey"
                                )}
                            >
                                {thousandsSeparator(moments.length)}{" "}
                                {props.intl.formatMessage({ id: "from_moments" })}
                            </span>
                        )}
                    </div>
                </aside>
                <article className={cx("content-moments")}>
                    {moments.length ? (
                        <MasonryList
                            hasMore={false}
                            loadMore={() => console.log("call me")}
                            ref={masonryRef}
                            isLoading={false}
                            dataSource={moments}
                        />
                    ) : (
                        <MasonryList.EmptyWithText />
                    )}
                </article>
            </main>
            <PostMoment
                handleRefreshMoments={refreshMoments}
                defaultTopic={topicInfo && topicInfo.name}
            />
        </section>
    );
};

export default withRouter(injectIntl(TopicDetail));
