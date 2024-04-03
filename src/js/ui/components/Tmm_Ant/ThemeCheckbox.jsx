import React from "react";
import { Checkbox } from "antd";

import styles from "./styles.less";
import classNames from "classnames";

/**
 * @typedef {import('antd/es/checkbox').CheckboxProps} CheckboxProps
 */

/**
 *
 * @type { React.FunctionComponent<CheckboxProps>} props
 */
export const ThemeCheckbox = ({ className, ...props }) => {
    return <Checkbox className={classNames(styles.cuCheckBox, className)} {...props} />;
};

export default ThemeCheckbox;
