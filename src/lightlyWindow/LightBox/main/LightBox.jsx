import Viewer from "viewerjs";
import styles from "./index.less";
import { remote } from "electron";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import useThrottle from "../../../js/ui/hooks/useThrottle";

const LimitBoundary = 100;

export const LightBox = forwardRef(({ mainSrc, onRatioChange, setDragAble }, ref) => {
    const mediaRef = useRef(null);
    const [src, setSrc] = useState(mainSrc);
    const [ins, setIns] = useState(null);
    const [zoom, setZoom] = useState(1);
    const zoomRef = useRef();

    const initInstances = () => {
        if (!mediaRef.current) return;

        const viewer = new Viewer(mediaRef.current, {
            inline: true,
            title: false,
            navbar: 0,
            button: false,
            transition: false,
            toggleOnDblclick: false,
            // zoomRatio: 1,
            backdrop: false,
            fullscreen: false,
            toolbar: {},
            tooltip: true,
            edgeLimit: true,
            movable: true,
            rotatable:true,
            view(e) {
                /**
                 * 避免闪烁
                 */
                const { innerWidth: nativeWidth, innerHeight: nativeHeight } = window;
                // calculate init ratio
                const { target } = e;
                // image size
                const { width, height } = target;
                console.log(width,height,'宽高');
                let initZoom = 1;
                //
                if (width > nativeWidth || height > nativeHeight) {
                    // over container, calculate init zoom
                    const xRatio = width / nativeWidth;
                    const yRatio = height / nativeHeight;

                    if (xRatio > yRatio) {
                        initZoom = nativeWidth / width;
                    } else {
                        initZoom = nativeHeight / height;
                    }
                    const zoom = Number(initZoom.toFixed(2));
                    viewer.zoomTo(zoom);
                    // setZoom(zoom);
                    console.log(viewer);
                }
            },
            viewed(event) {
                const {
                    imageData: { ratio },
                } = viewer;
                //img ratio
                setZoom(ratio);
            },
            zoomed(e) {
                // console.log(e,'zoom--------------的大小');
                const { innerWidth: nativeWidth, innerHeight: nativeHeight } = window;

                const {
                    target,
                    detail: { ratio },
                } = e;
                // 居中需求
                const { width, height } = target;
                // 计算当前宽高
                const currentW = width * ratio;
                const currentH = height * ratio;

                // 左右居中 || 上下居中
                if (currentW < nativeWidth || height < nativeHeight) {
                    // 计算x
                    const spaceX = (nativeWidth - currentW) / 2;
                    const spaceY = (nativeHeight - currentH) / 2;

                    setDragAble(false);
                    viewer.moveTo(spaceX, spaceY);
                } else {
                    setDragAble(true);
                }
                // console.log(e.detail.ratio,'e.detail.ratio');
                setZoom(e.detail.ratio);
            },
            move(e) {
                const { innerWidth: nativeWidth, innerHeight: nativeHeight } = window;
                const { target, detail } = e;
                const { containerData } = viewer;

                const { x, y, oldX, oldY } = detail;
                const { width, height } = target;
                const { width: containerWidth, height: containerHeight } = containerData;
                let moveAble = true;

                const currentW = width * zoomRef.current;
                const currentH = height * zoomRef.current;

                if (currentW > containerWidth || currentH > containerHeight) {
                    moveAble = true;

                    // // 宽度超出 不可移动的
                    // if (currentW > containerWidth) {
                    //     if (x > 0 || currentW - containerWidth - Math.abs(x) < 0) {
                    //         moveAble = false;
                    //     }
                    // }

                    // // 高度超出 不可移动的
                    // if (currentH > containerHeight) {
                    //     if (y > 0 || currentH - containerHeight - Math.abs(y) < 0) moveAble = false;
                    // }

                    // 宽度未超出 横行不可移动的
                    if (currentW < containerWidth) {
                        if (x !== oldX) moveAble = false;
                    }

                    // 高度未超出 纵向不可移动的
                    if (currentH < containerHeight) {
                        if (y !== oldY) moveAble = false;
                    }

                    // if (copyX !== moveToY || copyY !== moveToY) fixed = true;
                }
                e.returnValue = moveAble;
                return moveAble;
            },
            rotate() {

            },
        });
        setIns(viewer);
    };

    const updateRoom = useThrottle(
        () => {
            ins.zoomTo(zoom);
        },
        166,
        [ins, zoom]
    );

    useEffect(() => {
        remote.getCurrentWindow().on("leave-full-screen", updateRoom);
        remote.getCurrentWindow().on("enter-full-screen", updateRoom);
        window.addEventListener("resize", updateRoom, false);

        return () => {
            remote.getCurrentWindow().off("leave-full-screen", updateRoom);
            remote.getCurrentWindow().off("leave-full-screen", updateRoom);
            window.addEventListener("resize", updateRoom, false);
        };
    }, [ins, zoom]);

    useImperativeHandle(
        ref,
        () => ({
            handleMinimize: () => ins && ins.zoom(-0.5),
            handleMaximize: () => ins && ins.zoom(0.5),
            toggleRatio: () => {
                if (!ins) return;
                const { innerWidth: nativeWidth, innerHeight: nativeHeight } = window;

                const v = ins.toggle();

                const { imageData = {} } = v;
                const { ratio, width, height } = imageData;
                if (ratio !== 1) return;

                // center
                const spaceX = (nativeWidth - width) / 2;
                const spaceY = (nativeHeight - height) / 2;
                ins.moveTo(spaceX, spaceY);
            },
        }),
        [ins]
    );

    useEffect(() => {
        initInstances();
    }, []);

    useEffect(() => {
        onRatioChange(Number((zoom * 100).toFixed(0)) + "%");
        zoomRef.current = zoom;
    }, [zoom]);

    useEffect(() => {
        setSrc(mainSrc);
    }, [mainSrc, ins]);

    const handleLoadDone = () => {
        if (ins) ins.update();
    };

    return (
        <section
            style={{
                // width: "100%",
                height: "100%",
            }}
        >
            <img
                src={src}
                ref={mediaRef}
                onError={handleLoadDone}
                onLoad={handleLoadDone}
                style={{ display: "none" }}
                alt=""
            />
        </section>
    );
});

export default LightBox;
