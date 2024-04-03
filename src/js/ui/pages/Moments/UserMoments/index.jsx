/**
 * @Author Pull
 * @Date 2021-10-14 16:14
 * @project index
 */
import React, { useRef, useState } from "react";
import styles from "./styles.less";
import classNames from "classnames/bind";
import { MomentsTypeTab } from "../constants/tabs";
import { useUserMoments } from "./useUserMoments";
import UserInfo from "./UserInfo";
import { withRouter } from "react-router-dom";
import Header from "../../Header";
const cx = classNames.bind(styles);
const UserMoments = (props) => {
    const { match: { params } = {}, history, children } = props;
    const { uid } = params || {};
    const ref = useRef();

    const { query, setQuery, sendReq, chatWith, addFriend } = useUserMoments(uid, history);

    const onChildScroll = (e) => {
        const { scrollTop } = e;
        if (scrollTop > 50) {
            if (!ref.current._customeAutoScrolled) {
                ref.current._customeAutoScrolled = true;
                scroll(true);
            }
        } else if (scrollTop <= 0) {
            scroll(false);
            ref.current._customeAutoScrolled = false;
        }
    };

    const scroll = (flag) => {
        let scroll = 0;
        if (flag) {
            const { scrollHeight, clientHeight } = ref.current;
            scroll = scrollHeight - clientHeight;
        }

        // handleScroll(ref.current, scroll, scroll);

        ref.current.style.scrollBehavior = "smooth";
        ref.current.scrollTop = scroll;

        // ref.current.scrollTo({
        //     left: 0,
        //     top: scroll,
        //     behavior: "smooth",
        // });
    };

    // const containerScroll = (e) => {
    //     const { scrollTop } = ref.current;
    //     onChildScroll({ scrollTop });
    // };

    return (
        <section
            className={cx("user-home", "dark-theme-bg_deep")}
            ref={ref}
            // onScroll={containerScroll}
        >
            <UserInfo uid={uid} sendReq={sendReq} chatWith={chatWith} addFriend={addFriend} />
            {/*<nav className={cx("moments-tab")}>*/}
            {/*    {MomentsTypeTab.map(({ label, value, subPathName }) => (*/}
            {/*        <span*/}
            {/*            key={value}*/}
            {/*            className={cx(*/}
            {/*                "tab-item",*/}
            {/*                "dark-theme-color_grey",*/}
            {/*                query === value && "active",*/}
            {/*                query === value && " dark-theme-color_lighter"*/}
            {/*            )}*/}
            {/*            onClick={() => {*/}
            {/*                setQuery(value);*/}
            {/*                history.replace(`/user/moments/${uid}/${subPathName}`);*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            {label}*/}
            {/*        </span>*/}
            {/*    ))}*/}
            {/*</nav>*/}
            <section className={cx("moments")}>{children(onChildScroll)}</section>
        </section>
    );
};

export default withRouter(UserMoments);
