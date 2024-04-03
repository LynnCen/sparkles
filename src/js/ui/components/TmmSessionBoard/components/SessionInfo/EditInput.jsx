/**
 * @Author Pull
 * @Date 2021-03-12 16:29
 * @project Input
 */

import React, { useEffect, useRef, useState } from "react";
import { Input, message } from "antd";
import EditIcon from "images/icons/edit.png";
import styles from "./styles.less";
import classNames from "classnames";

/**
 * @typedef { Object } IProps
 * @property { function } onPressEnter
 * @property { string } defaultValue
 * @property { string } value
 * @property { string } className
 * @property { React.CSSProperties } bodyStyle
 */

/**
 *
 * @type { React.FunctionComponent<IProps>} props
 */

export const EditInput = ({
    onPressEnter,
    emptyAble = false,
    value,
    defaultValue = "",
    className = "",
    bodyStyle = {},
    isOwner,
}) => {
    const [val, setValue] = useState(defaultValue);
    const inputRef = React.useRef(null);

    useEffect(() => {
        if (value !== undefined) {
            setValue(value);
        }
    }, [value]);

    const force = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            let range = document.createRange();
            range.selectNodeContents(inputRef.current);
            range.collapse(false);
            let sel = window.getSelection();
            if (sel.anchorOffset != 0) {
                return;
            }
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    const onBlur = () => {
        if (inputRef.current) {
            inputRef.current.innerText = val || "";
        }
    };

    const handleKeyDown = async (e) => {
        const key = e.keyCode;
        const enter = 13;

        if (key === enter) {
            e.preventDefault();
            const text = inputRef.current.innerText;
            if (text !== val) {
                if ((!text && emptyAble) || text) {
                    const res = await onPressEnter(text);
                    if (res) {
                        setValue(text);
                        return inputRef.current.blur();
                    }
                }
            } else {
                onBlur();
            }
            inputRef.current.blur();
        }
    };

    return (
        <div className={classNames(styles.cuInputControl, className)} style={bodyStyle}>
            <div
                className={classNames(styles.edit)}
                contentEditable={isOwner ? "true" : "false"}
                suppressContentEditableWarning
                onKeyDown={handleKeyDown}
                onBlur={onBlur}
                ref={inputRef}
            >
                {val}
            </div>
            {isOwner ? (
                <img src={EditIcon} style={{ width: 14, height: 14 }} onClick={force} />
            ) : null}
        </div>
    );
};
export default EditInput;
