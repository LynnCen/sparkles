import { message } from "antd";
import classNames from "classnames";
import styles from "./styles.less";
import type { ArgsProps } from 'antd/lib/message/index';

export const themeMessage = ({ className = '', ...props }: ArgsProps) => {
    message.success({ className: classNames(styles.cuMessage, className), ...props });
};
