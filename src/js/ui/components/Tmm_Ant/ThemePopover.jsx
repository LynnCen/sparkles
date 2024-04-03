/**
 * @Author Pull
 * @Date 2021-11-10 16:29
 * @project ThemePopover
 */

import React, { Component } from "react";
import { Popover } from "antd";
import { observer } from "mobx-react";
import styles from "./styles.less";
import common from "../../stores_new/common";
import classNames from "classnames";

/**
 * @typedef {import('antd/es/popover').PopoverProps} PopoverProps
 */

/**
 * @typedef {Object} ThemeExtra
 * @property {string} overlayClassName
 */

/**
 * @extends {React.Component<PopoverProps & ThemeExtra>}
 */
@observer
export class ThemePopover extends Component {
    render() {
        const { children, overlayClassName, ...props } = this.props;
        return (
            <Popover overlayClassName={classNames(styles.cuPopover, overlayClassName)} {...props}>
                {children}
            </Popover>
        );
    }
}

export default ThemePopover;
