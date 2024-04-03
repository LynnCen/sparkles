import React, { useEffect } from "react";
import styles from "./styles.less";
import { SearchIcon } from "../../icons";
import { Input } from "antd";
import localeFormat from "utils/localeFormat";

export const TmmSearch = ({ handleChange, value }) => {
    useEffect(() => {
        console.log("TmmSearch");
    }, []);
    return (
        <div className={styles.search}>
            <div className={styles.inner}>
                <aside className={styles.searchIcon}>
                    <SearchIcon />
                </aside>

                <Input
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={localeFormat({ id: "Search" })}
                    value={value}
                    // allowClear={true}
                />
            </div>
        </div>
    );
};

export default TmmSearch;
