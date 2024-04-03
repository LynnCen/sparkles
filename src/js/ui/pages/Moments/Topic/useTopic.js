/**
 * @Author Pull
 * @Date 2021-10-14 09:34
 * @project useTopic
 */
import { useEffect, useState } from "react";

const mock = [
    { name: "travel", momentsCount: 100 },
    { name: "food", momentsCount: 1020 },
    { name: "ocean", momentsCount: 1300 },
    { name: "sky", momentsCount: 1400 },
    { name: "animal", momentsCount: 1010 },
    { name: "cat", momentsCount: 1020 },
    { name: "bird", momentsCount: 1030 },
    { name: "china", momentsCount: 1400 },
    { name: "world wild organization", momentsCount: 1030 },
    { name: "deep ocean", momentsCount: 1200 },
    { name: "camera", momentsCount: 1030 },
    { name: "creme", momentsCount: 1001 },
    { name: "photograph", momentsCount: 1020 },
    { name: "synergy", momentsCount: 1003 },
    { name: "nine nine six", momentsCount: 1030 },
    { name: "nine nine seven", momentsCount: 1400 },
    { name: "wonderful life", momentsCount: 1050 },
];

export const useTopic = () => {
    const [topicList, setTopicList] = useState([]);

    useEffect(() => {
        setTopicList(mock);
    }, []);

    return {
        topicList,
    };
};

export default useTopic;
