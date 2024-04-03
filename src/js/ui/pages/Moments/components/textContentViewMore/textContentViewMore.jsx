/**
 * @Author Pull
 * @Date 2021-10-11 15:08
 * @project LimitView
 */
import React, { useEffect, useRef, useState } from "react";
import propTypes from "prop-types";
import styles from "./styles.module.less";
import classNames from "classnames/bind";
import { parse_text } from "../../../Home/NewChat/components/MessageInput/image_of_emoji/emoji_helper";
import { drop, head } from "lodash";
import localeFormat from "utils/localeFormat";
import { searchByName } from "@newSdk/logic/Topic";
import { withRouter } from "react-router-dom";
import { ROUTE_PATH } from "../../../../routes";
const cx = classNames.bind(styles);

export const TextContentViewMore = withRouter(
    ({
        content,
        limitContent = true,
        lineHeight = "24px",
        textClassName = "",
        textStyle = {},
        viewMoreClassName = "",
        viewMoreStyle = {},
        history,
    }) => {
        const containerRef = useRef();
        // const initCheckRef = useRef(false);
        const [moreThan, setMoreThan] = useState(false);

        useEffect(() => {
            if (containerRef.current && content) {
                const node = document.createElement("p");
                node.innerHTML = content;
                // document.body.appendChild(node)
                Object.entries({
                    width: "100%",
                    "line-height": lineHeight + "px",
                    position: "absolute",
                    left: "1000vw",
                }).forEach(([k, v]) => (node.style[k] = v));
                containerRef.current.appendChild(node);

                const line = Math.floor(node.clientHeight / parseInt(lineHeight));
                if (line > 5) {
                    setMoreThan(true);
                }
                // initCheckRef.current = true;
                containerRef.current.removeChild(node);
            }
        }, [containerRef.current, content]);

        const handleClick = async (e) => {
            const { tag, name } = e.target.dataset || {};
            if (tag !== "topic" || !name) return;
            const list = await searchByName(name);
            if (!list.length) return;
            const [{ id }] = list;
            history.push(ROUTE_PATH.TOPIC_DETAILS.replace(":id", id));
        };
        return (
            <section
                className={cx("view-container")}
                onClick={handleClick}
                onMouseDown={(e) => {
                    const { tag, name } = e.target.dataset || {};
                    if (tag === "topic") e.stopPropagation();
                }}
            >
                <span
                    ref={containerRef}
                    className={cx("view-content", textClassName, limitContent && "limit")}
                    style={{
                        ...textStyle,
                        whiteSpace: "pre-wrap",
                        maxHeight: limitContent
                            ? parseInt(textStyle.lineHeight || lineHeight) * 5
                            : "auto",
                        overflow: limitContent ? "hidden" : "auto",
                        display: "block",
                        lineHeight: textStyle.lineHeight || lineHeight,
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                {moreThan && limitContent && (
                    <aside
                        className={cx("view-more", viewMoreClassName)}
                        style={{
                            height: lineHeight,
                            ...viewMoreStyle,
                        }}
                    >
                        <span className={cx("view")}>{localeFormat({ id: "see_more" })}</span>
                    </aside>
                )}
            </section>
        );
    }
);

TextContentViewMore.propTypes = {
    content: propTypes.string,
    textStyle: propTypes.object,
    lineHeight: propTypes.string,
    viewMoreStyle: propTypes.object,
    textClassName: propTypes.string,
    viewMoreClassName: propTypes.string,
};

export default TextContentViewMore;
