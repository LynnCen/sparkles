import React from "react";
import styles from "./styles.less";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";
import MessageType from "@newSdk/model/MessageType";
import { renderMessageStatus } from "../../../../../index";

export const mapObj = {
    [MessageType.RedBonusMessage]: "redBonus_viewInThePhone",
    [MessageType.RedBonusResultMessage]: "redBonus_viewInThePhone",
    [MessageType.CoinMessage]: "transition_viewInThePhone",
    [MessageType.RTCMessage]: "Call",
};

export default class UnSupportMessage extends React.PureComponent {
    render() {
        const { timeToShow, intl, isMe, message, status, type } = this.props;
        return (
            <section className={styles.unSupportMsg}>
                <i className={classNames(styles.circle)} />
                {mapObj[type] && (
                    <span>
                        <FormattedMessage id={mapObj[type]} />
                    </span>
                )}
                <div className={styles.textInfo}>
                    <div className={styles.textBox}>
                        <span className={styles.textTime}>{timeToShow}</span>
                        {isMe && (
                            <span className={styles.textStatus} data-status={status}>
                                {renderMessageStatus(message, intl.formatMessage)}
                            </span>
                        )}
                    </div>
                </div>
            </section>
        );
    }
}
