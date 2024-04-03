import React, { Component } from "react";

import "./style.global.css";

function blacklist(src, ...args) {
    var copy = {};
    var ignore = Array.from(args);

    for (var key in src) {
        if (ignore.indexOf(key) === -1) {
            copy[key] = src[key];
        }
    }

    return copy;
}

export default class Switch extends Component {
    render() {
        return (
            <span className="Switch">
                {/* TODO refactor check */}
                {/* {...blacklist(this.props, "className", "children")} */}
                <input type="checkbox" />
                <span className="Switch--fake" />
            </span>
        );
    }
}
