import React, { FC } from "react";
import styles from "./search.module.scss";
import Image from "next/image";
import { Input } from "antd";
import { useDebounce } from "../../hooks/useDebounce";

interface IProps {
    onSearch: (text: string) => void;
}
export const Search: FC<IProps> = ({ onSearch }) => {
    // const handleChange = useDebounce(
    //     (e: any) => {
    //         onSearch(e.target.value);
    //     },
    //     144,
    //     []
    // );
    return (
        <section className={styles.search}>
            <span className={styles.icon}>
                <Image src="/images/icons/search.png" width={16} height={16} />
            </span>
            {/* <Input className={styles.input} placeholder="搜索" onChange={handleChange} /> */}
        </section>
    );
};

export default Search;
