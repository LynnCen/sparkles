import React, { Component } from "react";
import styles from "../quote/styles.less";
import classNames from "classnames";
import { CloseIcon } from "../../../../../icons";
import { inject, observer } from "mobx-react";
import GroupInfo from "@newSdk/model/GroupInfo";
import { sessionBoardStore } from "components/TmmSessionBoard/sessionBoardStore";
@inject((stores) => ({
    getSessionInfo: stores.SessionInfoProxy.getSessionInfo,
    sessionInfoProxy: stores.SessionInfoProxy.sessionInfoProxy,
    focusSessionInfo: stores.NewSession.focusSessionInfo,
    isReadonlySession: stores.NewSession.isReadonlySession,
    alreadyKicked: stores.NewChat.alreadyKicked,
}))
@observer
export default class Notice extends Component {
    handleClose = () => {
        const { focusSessionInfo } = this.props;
        if (focusSessionInfo.chatId) {
            GroupInfo.updateGroupInfoById(focusSessionInfo.chatId, {
                isNewNotice: false,
            });
        }
    };
    handleClick = () => {
        sessionBoardStore.open();
        this.handleClose();
    };
    render() {
        const { sessionInfoProxy, focusSessionInfo, alreadyKicked, isReadonlySession } = this.props;
        const info = { ...focusSessionInfo, ...sessionInfoProxy(focusSessionInfo.chatId) };
        return info.isNewNotice && !alreadyKicked && !isReadonlySession ? (
            <section className={styles.quoteContainer} onClick={this.handleClick}>
                <section
                    className={classNames(styles.quoteWrap, {
                        [styles.ignoreBg]: true,
                    })}
                >
                    <aside className={styles.userName}>Group announcement</aside>
                    <article className={styles.notice}>{info.notice.trim()}</article>
                </section>
                <aside className={styles.closeQuote} onClick={this.handleClose}>
                    <CloseIcon />
                </aside>
            </section>
        ) : null;
    }
}
