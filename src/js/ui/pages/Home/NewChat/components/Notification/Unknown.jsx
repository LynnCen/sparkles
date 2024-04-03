import React, { Component } from "react";
import styles from "../../style.less";
import { injectIntl } from "react-intl";
import MessageType from "@newSdk/model/MessageType";
import IntlTemplateFormat from "./IntlTemplateFormat";

class U extends Component {
    renderContent = () => {
        const { message, intl } = this.props;
        const { type } = message;
        switch (type) {
            case MessageType.RedBonusResultMessage:
                return intl.messages.redBonus_viewInThePhone;
            default:
                return intl.messages.Unknown;
        }
    };

    render() {
        return <section className={styles.textNotification}>[{this.renderContent()}]</section>;
    }
}

export const Unknown = injectIntl(U);
export default Unknown;
