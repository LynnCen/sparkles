/**
 * @Author Pull
 * @Date 2021-10-13 16:19
 * @project index
 */
import React, { useEffect, useRef, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import styles from "./layoutStyle.less";
import className from "classnames/bind";
import { MomentsTabEnum, Tab } from "./constants/tabs";
import { RefreshIcon } from "../../icons";
import TopicSearchBar from "./components/topicSearchBar/TopicSearchBar";
import MomentsNotification from "./components/momentsNotification/MomentsNotification";
import Header from "../Header";
import nc from "@newSdk/notification";
import feedsModel from "@newSdk/model/moments/FeedsModel";
import storage from "utils/storage";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { Badge } from "antd";
import localeFormat from "utils/localeFormat";
const cx = className.bind(styles);

const MomentList = ({ children, location: { pathname = "" }, history, refresh }) => {
    const [tab, setTab] = useState(Tab);

    const type = (() => {
        try {
            if (pathname === "/moments/topic") return "3";
            const [, type] = pathname.match(/\/moments\/list\/(.*)/);
            return type;
        } catch (e) {
            return "";
        }
    })();

    useEffect(() => {
        initDot();
    }, []);
    const initDot = async () => {
        const momentsCacheInfo = (await storage.get("moments")) || {};
        const cacheInfo = (await storage.get(`moments.${tmmUserInfo._id}`)) || {};

        if (type === MomentsTabEnum.Friends) {
            // 清除红点
            cacheInfo.newMoments = false;
            setTab(Tab.map((item) => ({ ...item, dot: false })));
        } else {
            if (cacheInfo.newMoments) addDot();
        }
        momentsCacheInfo[tmmUserInfo._id] = cacheInfo;
        await storage.set("moments", momentsCacheInfo);
    };

    useEffect(() => {
        nc.on(feedsModel.Event.FriendsUpdated, addDot);

        return () => {
            nc.off(feedsModel.Event.FriendsUpdated, addDot);
        };
    }, [tab, type]);

    const addDot = () => {
        if (type !== MomentsTabEnum.Friends) {
            const _tab = tab.map((item) => {
                const _item = { ...item };
                if (_item.id === MomentsTabEnum.Friends) {
                    _item.dot = true;
                }
                return _item;
            });

            setTab(_tab);
        }
    };

    const handleRefresh = () => {
        if (refresh) {
            refresh();
        }
    };

    return (
        <section className={cx("moment-container", "dark-theme-bg_normal")}>
            <section className={cx("moment-main")}>
                <header
                    className={cx(
                        "moment-header",
                        "electron_drag-able",
                        "dark-theme-bg_normal",
                        "dark-theme-border_normal"
                    )}
                >
                    <nav className={cx("moment-nav", "electron_drag-disable")}>
                        {tab.map(({ label, id, to, dot }) => (
                            <Link
                                key={id}
                                draggable={false}
                                className={cx(
                                    "moment-nav-item",
                                    "dark-theme-color_grey",
                                    type === id && "active",
                                    type === id && "dark-theme-color_primary"
                                )}
                                to={to}
                            >
                                {dot ? (
                                    <Badge status="error" showZero style={{ fontSize: 16 }}>
                                        {localeFormat({ id: label })}
                                    </Badge>
                                ) : (
                                    localeFormat({ id: label })
                                )}
                                {/*{label}*/}
                            </Link>
                        ))}
                    </nav>
                    <aside className={cx("moment-btn", "electron_drag-disable")}>
                        <span className={cx("btn-refresh")} onClick={handleRefresh}>
                            <RefreshIcon overlayClassName="dark-theme-color_lighter" />
                        </span>
                        <MomentsNotification count={10} size="small" />
                    </aside>
                </header>
                <section className={cx("moment-content", "dark-theme-bg_deep")}>{children}</section>
            </section>
        </section>
    );
};

export default withRouter(MomentList);
