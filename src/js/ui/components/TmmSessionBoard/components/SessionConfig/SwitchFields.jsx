import styles from "./styles.less";
import React, { useRef } from "react";
import { Switch } from "antd";
import useDebounce from "../../../../hooks/useDebounce";
export const SwitchFields = ({ type, icon, title, value, handleChange }) => {
    const loadingRef = useRef(false);

    const handleSwitch = useDebounce(
        async (checked) => {
            if (!handleChange) return;

            if (loadingRef.current) return;
            loadingRef.current = true;

            try {
                await handleChange(checked);
            } finally {
                setTimeout(() => (loadingRef.current = false), 500);
            }
        },
        144,
        []
    );

    return (
        <section className={styles.switchBox}>
            <span className={styles.icon}>{icon}</span>

            <span className={styles.title}>{title}</span>

            <aside className={styles.control}>
                <Switch checked={!!value} onChange={handleSwitch} />
            </aside>
        </section>
    );
};

export default SwitchFields;
