/**
 * @Author Pull
 * @Date 2021-11-10 19:04
 * @project ThemeDropDown
 */
import { Dropdown } from "antd";
import React, { Component } from "react";
import styles from "./styles.less";
import classNames from "classnames";

/**
 * @typedef {import('antd/es/dropdown').DropDownProps} DropDownProps
 */

/**
 * @typedef {Object} ThemeExtra
 * @property {string} overlayClassName
 */

/**
 * @extends {React.Component<DropDownProps & ThemeExtra>}
 */
export class ThemeDropdown extends Component {
    render() {
        const { children, overlayClassName, ...props } = this.props;
        return (
            <Dropdown overlayClassName={classNames(styles.cuDropDown, overlayClassName)} {...props}>
                {children}
            </Dropdown>
        );
    }
}

export default ThemeDropdown;
