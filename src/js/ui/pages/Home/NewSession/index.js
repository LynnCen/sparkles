import { inject, observer } from "mobx-react";
import moment from "moment";
import React, { Component } from "react";
import ConversationItem from "./conversationItem";
import classes from "./style.less";
import { SearchIcon, PlusOutLine } from "../../../icons/index";
import disableCopy from "../../../hoc/disableCopy";
import { injectIntl, FormattedMessage } from "react-intl";
import classnames from "classnames";
import memberModel from "@newSdk/model/Members";
import initFriendsCache from "@newSdk/logic/initScript/initFriendsCache";
import SessionSearch from "./Search";

moment.updateLocale("en", {
    relativeTime: {
        past: "%s",
        m: "1 min",
        mm: "%d mins",
        h: "an hour",
        hh: "%d h",
        s: "now",
        ss: "%d s",
    },
});

@inject((stores) => ({
    loadConversation: stores.NewSession.loadConversation,
    sessionList: stores.NewSession.renderList,
    setLoadPage: stores.NewSession.setLoadPage,
    loadedPage: stores.NewSession.page,
    scrolling: stores.NewSession.scrolling,
}))
@observer
class Chats extends Component {
    throttleTimer = null;
    throttleTimeout = 144;


    handleScroll = (e) => {
        const { loadedPage, setLoadPage, scrolling } = this.props;

        if (scrolling) {
            if (this.throttleTimer) clearTimeout(this.throttleTimer);
            return;
        }
        if (this.throttleTimer) clearTimeout(this.throttleTimer);

        this.throttleTimer = setTimeout(() => {
            const container = this.refs.container;
            if (container) {
                const contentScrollTop = container.scrollTop; //offset top
                const clientHeight = container.clientHeight; //visible screen
                const scrollHeight = container.scrollHeight; // scroll amount height
                const offset = 100;

                // load more
                if (contentScrollTop + clientHeight + offset >= scrollHeight) setLoadPage();
                // reset
                if (contentScrollTop < 200 && loadedPage > 1 && !scrolling) {
                    setLoadPage(1);
                }
            }
            this.throttleTimer = null;
        }, this.throttleTimeout);
    };

    render() {
        const { sessionList = [] } = this.props;
        return (
            <div className={classnames(classes.container)}>
                <SessionSearch />
                <div
                    className={classes.chats}
                    ref="container"
                    id="conversation_scroll_container"
                    onScroll={this.handleScroll}
                >
                    {sessionList
                        .filter((item) => {
                            return (
                                item.chatId &&
                                (item.name || "").toLowerCase().includes("".toLowerCase())
                            );
                        })
                        .map((e, index) => {
                            return <ConversationItem key={e.chatId} conversationInfo={e} />;
                        })}
                </div>
            </div>
        );
    }
}

export default injectIntl(disableCopy(Chats));
