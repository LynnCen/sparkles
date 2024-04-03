/**
 * @Author Pull
 * @Date 2021-11-10 17:26
 * @project ThemeSelect
 */
import React, { Component } from "react";
import { Select } from "antd";
import { observer } from "mobx-react";
import styles from "./styles.less";
import common from "../../stores_new/common";
import classNames from "classnames/bind";
/**
 * @typedef {import('antd/es/select').SelectProps} SelectProps
 */

/**
 * @typedef {Object} ThemeExtra
 * @property {string} dropdownClassName
 * @property {string} className
 */

/**
 * @extends {React.Component<SelectProps & ThemeExtra>}
 */
@observer
export class ThemeSelect extends Component {
    render() {
        const { children, dropdownClassName, className, ...props } = this.props;
        return (
            <Select
                className={classNames(styles.cuSelectPick, className)}
                dropdownClassName={classNames(styles.cuSelectDropdown, dropdownClassName)}
                {...props}
            >
                {children}
            </Select>
        );
    }
}

export default ThemeSelect;
