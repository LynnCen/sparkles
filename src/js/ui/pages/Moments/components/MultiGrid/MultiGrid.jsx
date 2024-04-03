/**
 * @Author Pull
 * @Date 2021-10-11 13:25
 * @project ImageMultiGrid
 */
import React, { Fragment } from "react";
import styles from "./MultiGrid.module.less";
import classNames from "classnames/bind";
import propTypes from "prop-types";
import { MoreFileIcon } from "../../../../icons";

const cx = classNames.bind(styles);
export const MultiGridSizeEnum = {
    DEFAULT: "default",
    SMALL: "small",
    LARGE: "large",
};
export const MultiGrid = ({
    containerStyle = {},
    sourceList,
    count = 0,
    size = MultiGridSizeEnum.DEFAULT,
    onPreviewImages,
    children,
    mediaContentWidth,
}) => {
    if (count === 0 || !count) return null;

    const autoClassName = (() => {
        if (count > 4) return "grid-over-limit";
        switch (count) {
            case 1:
                return "grid-one";
            case 2:
                return "grid-two";
            case 3:
                return "grid-three";
        }
    })();

    const getHeight = (width, nativeHeight) => {
        const minHeight = (width * 3) / 4;
        const maxHeight = (width * 16) / 9;

        if (nativeHeight < minHeight) return minHeight;
        if (nativeHeight > maxHeight) return maxHeight;
        return nativeHeight;
    };

    const bodyStyle = (() => {
        const bodyStyle = {
            width: mediaContentWidth,
            // color: "red",
            overflow: "hidden",
        };
        if (count === 1) {
            const [item] = sourceList;
            const { width, height } = item;

            const scale = mediaContentWidth / width;
            const sh = height * scale;

            const h = getHeight(mediaContentWidth, sh);

            bodyStyle.height = h;
        } else {
            bodyStyle.height = size === MultiGridSizeEnum.DEFAULT ? 136 : 298;
        }

        return bodyStyle;
    })();

    return (
        <Fragment>
            <section
                className={cx("grid-container", autoClassName, size, "cu-height")}
                style={Object.assign(containerStyle, bodyStyle)}
                data-h={bodyStyle.height}
                // style={{ height: count === 1 && "320px" }}
                // ref={(ref) => ref.styles}
                // style={bodyStyle}
            >
                {children}

                <aside className={cx("showMore")} onClick={onPreviewImages}>
                    <MoreFileIcon /> +{count - 4}
                </aside>
            </section>
        </Fragment>
    );
};
MultiGrid.propTypes = {
    containerStyle: propTypes.object,
    count: propTypes.number,
    // imageList: propTypes.arrayOf(propTypes.string),
};

MultiGrid.Item = ({ children }) => <div className={cx("grid-item")}>{children}</div>;

export default MultiGrid;
