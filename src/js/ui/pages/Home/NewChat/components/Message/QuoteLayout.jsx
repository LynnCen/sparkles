/**
 * @Author Pull
 * @Date 2021-07-27 10:04
 * @project QuoteLayout
 */
import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import messageModel from "@newSdk/model/Message";
import styles from "./styles.less";
import nc from "@newSdk/notification";
import { withRouter } from "react-router-dom";
import MessageQuote from "../quote/MessageQuote";

class QuoteLayout extends Component {
    static propTypes = {
        mids: PropTypes.array,
        isMe: PropTypes.bool,
    };
    state = {
        quoteMessage: null,
        showQuote: true,
    };

    componentDidMount() {
        this.stringifyContent();
    }

    componentWillUnmount() {
        this.removeObserve();
    }

    addObserve() {
        nc.addObserver(messageModel.Event.MessageChangeEvent, this.handleMessageChanged);
    }

    removeObserve = () => {
        nc.removeObserve(messageModel.Event.MessageChangeEvent, this.handleMessageChanged);
    };

    handleMessageChanged = (msgList) => {
        try {
            const {
                message: { mid },
                showQuote,
            } = this.state;
            const msg = msgList.find((item) => item.mid === mid);
            if (msg && msg.deleteFlag && showQuote) {
                this.setState({
                    showQuote: false,
                });
            }
        } catch (e) {}
    };

    stringifyContent = async () => {
        const { mids } = this.props;
        const mid = mids[0];
        if (!mid) {
            this.setState({
                showQuote: false,
            });
            return null;
        }

        // get message
        const message = await messageModel.getMessageByMid(mid);

        this.setState({
            quoteMessage: message,
        });

        // is delete
        if (!message || message.deleteFlag) {
            this.setState({
                showQuote: false,
            });
            return null;
        }
    };

    render() {
        const { showQuote, quoteMessage } = this.state;

        const { isMe } = this.props;

        if (!showQuote) return null;

        return (
            <section className={styles.quoteContainer}>
                {quoteMessage && <MessageQuote showBg quotedMessage={quoteMessage} isMe={isMe} />}
            </section>
        );
    }
}

export default QuoteLayout;
