/**
 * @Author Pull
 * @Date 2021-06-18 11:34
 * @project index
 */
import React, { Component } from "react";
import propTypes from "prop-types";
import styles from "./index.less";
import classNames from "classnames";
import { Spin } from "antd";

export default class extends Component {
    static propTypes = {
        fullScreen: propTypes.bool,
        show: propTypes.bool,
        shouldUseDarkColors: propTypes.bool,
    };

    render() {
        const { show, fullScreen, shouldUseDarkColors } = this.props;
        if (!show) return null;
        return (
            <aside
                className={classNames(styles.mask, {
                    [fullScreen]: styles.full,
                    [styles.dark]: shouldUseDarkColors,
                })}
            >
                <Spin size="large" />
            </aside>
        );
    }
}
