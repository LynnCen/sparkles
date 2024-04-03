/**
 * @Author Pull
 * @Date 2021-10-14 13:35
 * @project useTopicSearchBar
 */
import { useEffect, useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";

const mockRequestList = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

export const useTopicSearchBar = () => {
    const [value, setValue] = useState("");
    const [topicList, setTopicList] = useState([]);
    const handleSearch = useDebounce(
        (query) => {
            if (query === "") return setTopicList([]);
            setTopicList(mockRequestList.map((item) => `${query} --> ${item}`));
        },
        500,
        []
    );

    const onSearch = (val) => {
        setValue(val);
        handleSearch(val);
    };

    const onBlue = () => {
        setTopicList([]);
    };

    const onFocus = () => {
        if (value) onSearch(value);
    };
    return {
        value,
        setValue: onSearch,
        topicList,
        onBlue,
        onFocus,
    };
};

export default useTopicSearchBar;
