import React, { Component, useEffect, useState } from "react";
import styles from "./styles.less";
import moment from "moment";
import { injectIntl } from "react-intl";
import { observer } from "mobx-react";
import tmmPayProxy from "./store/tmmPayProxy";
import tmmUserInfo from "@newSdk/model/UserInfo";
import { UserProxyEntity } from "../../../../../stores_new/userProxy";
import { getTransitionFormat, getTruthyAmount } from "./Transition+format";
import { message } from "antd";
import classname from "classnames";
import localeFormat from "utils/localeFormat";
import { getNameWeight } from "utils/nameWeight";
const DisplayKeyEnum = {
    TO_USER: "to_user",
    TO_ADDRESS: "to_address",
    TO: "to",

    FROM_TXTID: "from_txtId",
    FROM_USER: "from_user",
    Remark: "remark",
};

@observer
class Transition extends Component {
    state = {};
    componentWillMount() {
        const { message, intl } = this.props;
        const content = getTransitionFormat(message, intl.formatMessage);
        if (content) {
            this.setState(content);
        }

        // tmmPayProxy.addObservers();
        // coinConfigProxy.addObservers();
        // 初始化 当前 coin 配置
    }

    componentWillUnmount() {
        // tmmPayProxy.removeObserver();
        // coinConfigProxy.removeObservers();
    }

    render() {
        const { cardBasicInfo = {}, display = {} } = this.state;
        const { content = {}, mid } = this.props.message;

        const { messages } = this.props.intl;
        return (
            <section
                className={`${styles.transition} dark-theme-bg_lighter`}
                onClick={() => message.warn(messages.viewInThePhone)}
                onContextMenu={() => console.log(this.props.message)}
            >
                <header className={`${styles.title} dark-theme-color_lighter`}>
                    {cardBasicInfo.title}
                </header>

                <article className={styles.content}>
                    <div className={classname(styles.amount, "dark-theme-color_grey")}>Amount</div>
                    <div className="dark-theme-color_lighter">
                        {cardBasicInfo.plus ? "+" : "-"}
                        <span className={styles.sum}>
                            {getTruthyAmount({
                                amount: cardBasicInfo.amount,
                                decimal: content.decimal,
                            })}
                        </span>
                        <span className={classname(styles.unit, "dark-theme-color_lighter")}>
                            {cardBasicInfo.unit}
                        </span>
                    </div>
                </article>
                {Object.entries(display).map(([label, value]) => (
                    <LabelValue label={label} value={value} act={content.act} />
                ))}
                <LabelValue
                    label="Time"
                    value={moment(content.create_time).format("YYYY/MM/DD HH:mm:ss")}
                />
            </section>
        );
    }
}

@observer
class LabelValue extends Component {
    componentDidMount() {
        const { label, value, act } = this.props;
        if ([DisplayKeyEnum.TO_USER, DisplayKeyEnum.FROM_USER].includes(label))
            UserProxyEntity.getUserInfo(value);

        if ([DisplayKeyEnum.FROM_TXTID, DisplayKeyEnum.TO_ADDRESS].includes(label)) {
            tmmPayProxy.getDetails(value, act);
        }
    }

    renderLabel(label) {
        switch (label) {
            case DisplayKeyEnum.TO:
            case DisplayKeyEnum.TO_USER:
            case DisplayKeyEnum.TO_ADDRESS:
                return "To";
            case DisplayKeyEnum.FROM_TXTID:
                return "TXID";
            case DisplayKeyEnum.FROM_USER:
                return "From";
            case DisplayKeyEnum.Remark:
                return "Remark";
            default:
                return label;
        }
    }

    renderValue(label, value) {
        switch (label) {
            case DisplayKeyEnum.TO_USER:
            case DisplayKeyEnum.FROM_USER:
                if (value === tmmUserInfo._id) return localeFormat({ id: "string_your" });
                const userInfo = UserProxyEntity.getProxyUserBaseInfo(value);
                return getNameWeight({
                    friendAlias: userInfo.friendAlias,
                    alias: userInfo.alias,
                    name: userInfo.name,
                    uid: userInfo.uid,
                    status: userInfo.status,
                });
            // return userInfo.friendAlias || userInfo.name;

            case DisplayKeyEnum.TO_ADDRESS:
            case DisplayKeyEnum.FROM_TXTID:
                const billInfo = tmmPayProxy.getBillDetailsByTradeNo(value);
                return billInfo.address || billInfo.txid;
            case DisplayKeyEnum.TO:
            case DisplayKeyEnum.Remark:
            default:
                return value;
        }
    }

    render() {
        const { label, value } = this.props;
        return (
            <section className={styles.dataItem}>
                <div className={`${styles.label} dark-theme-color_grey`}>
                    {this.renderLabel(label)}
                </div>
                <div className={`${styles.value} dark-theme-color_lighter`}>
                    {this.renderValue(label, value)}
                </div>
            </section>
        );
    }
}

export default injectIntl(Transition);
