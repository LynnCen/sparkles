import React from "react";
import Avatar from "../Avatar";
import styles from "./styles.less";
import { Checkbox } from "antd";
import classNames from "classnames";
import { CloseCircleFilled } from "@ant-design/icons";

const AvatarSize = 32;
export const UserItem = ({ src, name, isSelected, initSelected, onSelect, onRemove }) => {
    if (!onSelect && initSelected) {
        return null;
    }

    return (
        <section className={styles.userItem} onClick={onSelect}>
            <article>
                <Avatar src={src} size={AvatarSize} />
                <span
                    style={{ lineHeight: `${AvatarSize}px` }}
                    className={`${styles.userItemName} dark-theme-color_lighter`}
                >
                    {name}
                </span>
            </article>
            <aside>
                {onSelect ? (
                    <Checkbox checked={isSelected} disabled={initSelected} />
                ) : (
                    <CloseCircleFilled onClick={onRemove} />
                )}
            </aside>
        </section>
    );
};

export const SplitLine = ({ title }) => <section className={styles.splitLine}>{title}</section>;
