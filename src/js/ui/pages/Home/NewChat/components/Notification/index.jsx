/**
 * @Author Pull
 * @Date 2021-06-23 15:06
 * @project index
 */
import React, { Component } from "react";
import NcTextMessage, { Unknown } from "./Unknown";
import styles from "../../style.less";
import MessageType from "@newSdk/model/MessageType";
import IntlTemplateFormat from "./IntlTemplateFormat";
import { inject } from "mobx-react";
import TempNode from "./TempNode";

@inject((store) => ({
    formatAbleType: store.FormatIntlTemp.formatAbleType,
}))
class Nc extends Component {
    //

    // renderContent() {
    //     const { message, formatAbleType } = this.props;

    //     if (formatAbleType.includes(message.type)) return <IntlTemplateFormat message={message} />;
    //     switch (message.type) {
    //         // switch (0) {
    //         case MessageType.TextMessage:
    //             return <NcTextMessage message={message} />;
    //         case MessageType._LocalTempTipMsg:
    //             return <TempNode message={message} />;
    //         default:
    //             return <Unknown message={message} />;
    //     }
    // }

    render() {
        const { message, formatAbleType } = this.props;
        if (formatAbleType.includes(message.type))
            return (
                <section className={styles.notification}>
                    <IntlTemplateFormat message={message} />
                </section>
            );
        switch (message.type) {
            // switch (0) {
            case MessageType.TextMessage:
                return (
                    <section className={styles.notification}>
                        <NcTextMessage message={message} />
                    </section>
                );

            case MessageType._LocalTempTipMsg:
                return (
                    <section className={styles.notification}>
                        <TempNode message={message} />
                    </section>
                );

            default:
                return (
                    <section className={styles.notification}>
                        <Unknown message={message} />
                    </section>
                );
        }
        // return <section className={styles.notification}>{() => this.renderContent()}</section>;
    }
}

export default Nc;
