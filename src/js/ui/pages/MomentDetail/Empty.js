import React from "react";
import cx from "./index.less";

const Empty = ({ content }) => {
    return (
        <div className={cx["tmm_emptywrapper"]}>
            <div>{content}</div>
        </div>
    );
};

export default Empty;
