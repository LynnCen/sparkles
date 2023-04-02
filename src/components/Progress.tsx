import React, {useRef, useEffect} from "react";
import {Progress} from "antd";
import {findDOMNode} from "react-dom";

export default function ({
                             strokeColor = {"0%": "#02D281", "100%": "#00BAFF"},
                             percent,
                             ...rest
                         }) {
    const ref = useRef();
    useEffect(() => {
        if (ref.current) {
            const node: HTMLElement = findDOMNode(ref.current) as HTMLElement;
            const inner: HTMLElement = node.querySelector(".ant-progress-inner");
            const txt: HTMLElement = node.querySelector(".ant-progress-text");
            const p = Number(percent);
            txt.style.left = "";
            if (p < 100) {
            txt.style.left =
                (inner.offsetWidth * p) / 100 < txt.offsetWidth + 2
                    ? p + 1 + "%"
                    : `calc(${txt.textContent} - ${txt.offsetWidth + 2}px)`;
            }
            const {style} = rest;
            if (style) {
                if ("borderRadius" in style) {
                    inner.style.borderRadius = style.borderRadius;
                }
            }
        }
    }, [percent, ref.current]);
    return <Progress ref={ref}  strokeColor={strokeColor} percent={percent} {...rest} />;
}
