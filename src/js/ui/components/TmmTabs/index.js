import React from "react";
import cs from "./index.less";
import classNames from "classnames";

export default class TmmTabs extends React.Component {
    onChange = (key) => {
        this.props.onChange(key);
    };

    render() {
        const { configs } = this.props;

        return (
            <div className={cs.tabcontainer}>
                {configs.map((item) => {
                    return (
                        <span
                            className={classNames("dark-theme-color_lighter", {
                                [cs.tabitem]: true,
                                [cs.tabSelected]: item.isSelected,
                            })}
                            key={item.key}
                            onClick={() => this.onChange(item.key)}
                        >
                            {item.label}
                        </span>
                    );
                })}
            </div>
        );
    }
}
