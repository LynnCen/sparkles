import React, { Fragment, useEffect, useRef, useState } from "react";
import styles from "./styles.less";
import { Input } from "antd";
import { EditIcon } from "../../../../../icons";
import updateUserRemarkAlias from "@newSdk/service/api/addFriends/updateUserRemarkAlias";
import classNames from "classnames";
import updateGroupName from "@newSdk/service/api/group/updateGroupName";

/**
 * @typedef Props
 * @property { string } value
 * @property { string } uid
 * @property { boolean } isGroup
 * @property { boolean } editAble
 *
 */

/**
 *
 * @type {React.FunctionComponent<Props>} props
 */
export const AliasInput = ({ value, id, isGroup, editAble }) => {
    const [val, setVal] = useState(value);
    const [focus, setFocus] = useState(false);

    useEffect(() => {
        document.addEventListener("click", handleBlur);
        return () => {
            document.removeEventListener("click", handleBlur);
        };
    }, []);

    useEffect(() => {
        setVal(value);
        setFocus(false);
    }, [value]);

    const handleBlur = () => setFocus(false);

    const handleFocus = (e) => {
        if (editAble) {
            // e.nativeEvent.stopImmediatePropagation();
            setFocus(true);
        }
    };

    const handleChangeAlias = async (e) => {
        const alias = e.target.value;
        if (alias === value) return;

        let res = false;
        if (isGroup) res = await updateGroupName(id, alias);
        else res = await updateUserRemarkAlias(id, alias);
        if (!res) return setVal(value);
    };
    return (
        <section
            className={classNames(styles.inputBox, {
                [styles.small]: !focus,
            })}
            onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
        >
            {editAble && focus ? (
                <Input defaultValue={val} autoFocus onPressEnter={handleChangeAlias} />
            ) : (
                <span onClick={handleFocus} className={styles.viewName}>
                    <span className={styles.alias}>{val}</span>
                    {editAble && <EditIcon />}
                </span>
            )}
        </section>
    );
};

export default AliasInput;
