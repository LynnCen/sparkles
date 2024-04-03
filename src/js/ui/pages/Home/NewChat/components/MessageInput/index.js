/**
 * @Author Pull
 * @Date 2021-05-31 10:50
 * @project input
 */
import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";
import MessageInput from "./editor.jsx";
import ReactDOM from "react-dom";
import clazz from "classnames";
import classes from "./style.less";
import QuoteMessage from "../quote/MessageQuote";
import { CloseIcon } from "../../../../../icons";
import quoteStore from "../quote/quoteStore";
import { isGroup } from "@newSdk/utils";
import { sessionBoardStore } from "components/TmmSessionBoard/sessionBoardStore";
import AtSessionMember from "components/TmmSessionBoard/components/AtSessionMember/AtSessionMember";
import onClickOutside from "react-onclickoutside";
import { decode } from "@newSdk/utils/messageFormat";
import draftTable from "@newSdk/model/draft";
@inject((stores) => ({
    focusSessionId: stores.NewSession.focusSessionId,
    alreadyKicked: stores.NewChat.alreadyKicked,
    isReadonlySession: stores.NewSession.isReadonlySession,
    focusDraftInfo: stores.NewSession.focusDraftInfo,
}))
@observer
class Message extends React.Component {
    isMac() {
        return navigator.platform === "Win32" || navigator.platform === "Windows";
    }
    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true);
        const { focusDraftInfo } = this.props;
        if (focusDraftInfo && focusDraftInfo.extra) {
            quoteStore.quoteMessage(decode(focusDraftInfo.extra));
        }
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.focusSessionId !== this.props.focusSessionId) return { reset: true };
        else return {};
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { focusDraftInfo } = this.props;
        if (snapshot.reset) {
            if (focusDraftInfo && focusDraftInfo.extra) {
                quoteStore.quoteMessage(decode(focusDraftInfo.extra));
            }
        }
    }
    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true);
    }
    handleClickOutside = (event) => {
        // ..handling code goes here...
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            if (sessionBoardStore.viewAtList) {
                sessionBoardStore.closeAt();
            }
        }
    };
    handleCloseQuote = async () => {
        const { abrogateQuote } = quoteStore;
        const { focusSessionId, focusDraftInfo } = this.props;

        await draftTable.updateMsg(focusSessionId, { extra: "" });
        const draftInfoDb = await draftTable.getMsg(focusSessionId);
        if (Object.keys(draftInfoDb.content).length === 0 && !draftInfoDb.extra) {
            await draftTable.deleteMsg(focusSessionId);
        }
        abrogateQuote();
    };
    render() {
        const { focusSessionId, isShowSelect, isReadonlySession, focusDraftInfo } = this.props;
        const { currentMessage, isQuote, abrogateQuote } = quoteStore;
        let flag = !!focusSessionId && !isReadonlySession;
        const group = isGroup(focusSessionId);
        return flag ? (
            <Fragment>
                {isQuote && (
                    <section className={classes.quoteContainer}>
                        <QuoteMessage quotedMessage={currentMessage} />
                        <aside className={classes.closeQuote} onClick={this.handleCloseQuote}>
                            <CloseIcon />
                        </aside>
                    </section>
                )}
                <div className={classes.inputContainer}>
                    {/*{isShowSelect ? <BottomAction /> : <MessageInput />}*/}
                    <MessageInput />
                </div>
            </Fragment>
        ) : null;
    }
}

export default Message;
