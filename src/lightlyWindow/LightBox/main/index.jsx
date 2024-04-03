/**
 * @Author Pull
 * @Date 2021-08-19 14:18
 * @project lightBOx
 */
import React, { Fragment, useEffect, useReducer, useRef, useState } from "react";
import LightBox from "./LightBox";
import styles from "./index.less";
import classNames from "classnames";
import {
    DownloadIcon,
    LeftIcon,
    RightIcon,
    EnlargeIcon,
    ShrinkIcon,
    RatioIcon,
    RatioReset,
} from "../icons";
import { device } from "utils/tools";
import messageModel from "@newSdk/model/Message";
import { ipcRenderer } from "../../../js/platform";
import initDB from "../db/initSyncMainWindow";
import defaultStore from "./store";
import reducer from "./reducer";
import { InitAction, ViewChangeAction, UpdateAction } from "./actions";
import { initSource, downloadOriginSource, getImageDownloadKey, initMomentsSource } from "./utils";
import { Progress, Spin } from "antd";
import downloadError from "./downloadError.png";
import nodePath from "path";
import { saveFile } from "utils/sn_utils";
import { remote, app } from "electron";
import { LightBoxIPCType } from "../../../MainProcessIPCType";
import { constant_LightBox } from "../../../ProcessCommonConstants";
import { HeaderCloseIcon, HeaderResizeMinIcon, HeaderResizeToggleIcon } from "../../../js/ui/icons";
import useIntlFormat from "../hooks/useIntlFormat";

const BFB = "100%";

const IntlText = {
    lightbox_download: "lightbox_download",
    lightbox_shrink: "lightbox_shrink",
    lightbox_enlarge: "lightbox_enlarge",
    lightbox_ratio: "lightbox_ratio",
    lightbox_ratio_back: "lightbox_ratio_back",
};
// const normal
export default function () {
    const [store, dispatch] = useReducer(reducer, defaultStore);
    const [downloading, setDownloading] = useState(new Map());
    const [ratio, setRatio] = useState(BFB);
    // console.log(ratio,'ratio------------------------1');
    const lightBoxRef = useRef();

    const { renderText } = useIntlFormat([
        IntlText.lightbox_download,
        IntlText.lightbox_shrink,
        IntlText.lightbox_enlarge,
        IntlText.lightbox_ratio,
        IntlText.lightbox_ratio_back,
    ]);

    const mainSource = store.list[store.forceIndex] || {};
    // const prevSource = store.prevAble ? store.list[store.forceIndex + 1] : null;
    // const nextSource = store.nextAble ? store.list[store.forceIndex - 1] : null;
    const downloadingPercent = downloading.get(getImageDownloadKey(mainSource.content));
    const [showIndex, setShowIndex] = useState(false);

    const [pre, setPre] = useState("");
    const [renderAble, setRenderAble] = useState(false);
    const [dragAble, setDragAble] = useState(false);

    const [ratioResetAble, setRatioResetAble] = useState(false);

    useEffect(() => {
        ipcRenderer.on(LightBoxIPCType.initData, (e, dataSource) => {
            if (dataSource) {
                // const { href } = window.location;
                // remote.getCurrentWindow().webContents.toggleDevTools();
                // const query = nodeUrl.parse(href).query;
                // const info = nodeQs.parse(query);
                // console.log(info);
                // const data = JSON.parse(info.data || {});
                if (dataSource.previewTempLink) setPre(dataSource.previewTempLink);
                if (dataSource.moments) setShowIndex(true);
                setRenderAble(true);
                init(dataSource);
            }
        });
    }, []);

    useEffect(() => {
        if (mainSource && !mainSource.load && mainSource.content) {
            getOriginSource(mainSource);
        }
    }, [store.forceIndex]);

    // init message list
    const init = async (obj) => {
        let list = [];
        const result = await initDB(obj.userInfo);
        if (!result) return;
        if (obj.moments) {
            list = await initMomentsSource(obj.media, obj.mid);
        } else {
            list = await initWithMessageList(obj);
        }

        const initAction = new InitAction(list);
        setPre("");
        dispatch(initAction);
    };

    const initWithMessageList = async (obj) => {
        const messages = await messageModel.getImageMessagesOfSession(obj.chatId);
        return await initSource(messages, obj.mid);
    };

    // slide
    const handleSetIndex = (index) => {
        const action = new ViewChangeAction(index);
        dispatch(action);
    };

    const getOriginSource = async (mainSource) => {
        const { content, mid } = mainSource;
        const key = getImageDownloadKey(content);
        if (downloading.has(key)) return;
        // set downloading;
        const path = await downloadOriginSource(content, ({ total, loaded }) =>
            setDownloadingPercent(parseInt((loaded / total) * 100 + ""), mid, key)
        );

        // console.log(path)
        // if (path) {
        const action = new UpdateAction({ path, mid });
        dispatch(action);
        // }
    };
    ``;
    const setDownloadingPercent = (percent, mid, key) => {
        downloading.set(key, percent);
        setDownloading(new Map(downloading));
    };

    const handleClose = () => {
        // ipcRenderer.send("lightBox_close");
        // remote.getCurrentWindow().close();
        remote.getCurrentWindow().destroy();
    };

    const handleDownload = () => {
        // Tools.saveFile(src);
        const src = mainSource.path;
        if (!src) return;
        const { base } = nodePath.parse(src);
        const dir = remote.app.getPath("pictures") || app.getPath("downloads");
        const defaultPath = nodePath.join(dir, base);

        const path = remote.dialog.showSaveDialogSync({
            properties: ["showHiddenFiles", "createDirectory"],
            defaultPath,
        });
        if (path) return saveFile(src, path);
    };

    const handleShrink = () => {
        if (lightBoxRef.current) lightBoxRef.current.handleMinimize();
    };

    const handleEnlarge = () => {
        if (lightBoxRef.current) lightBoxRef.current.handleMaximize();
    };

    const handleRatioToggle = () => {
        if (!ratioResetAble && ratio === BFB) return;
        if (lightBoxRef.current) {
            if (ratio !== BFB) {
                setRatioResetAble(true);
            } else {
                setRatioResetAble(false);
            }

            lightBoxRef.current.toggleRatio();
        }
    };

    const handleRatioChange = (ratio) => {
        setRatio(ratio);
        if (ratio !== BFB) setRatioResetAble(false);
    };

    const headerAction = [
        {
            Icon: () => <DownloadIcon title={renderText(IntlText.lightbox_download)} />,
            handler: handleDownload,
            key: "1",
        },
        {
            Icon: () => <ShrinkIcon title={renderText(IntlText.lightbox_shrink)} />,
            handler: handleShrink,
            overlayStyles: {
                marginRight: 24,
            },
            key: "2",
        },
        {
            Icon: () => <div className={styles.ratioTitle}>{ratio}</div>,
            overlayStyles: {
                marginRight: 24,
            },
            handler: () => lightBoxRef.current.test(),
            key: "3",
        },
        {
            Icon: () => <EnlargeIcon title={renderText(IntlText.lightbox_enlarge)} />,
            handler: handleEnlarge,
            key: "4",
        },
        {
            Icon: () =>
                ratioResetAble ? (
                    <RatioReset title={renderText(IntlText.lightbox_ratio_back)} />
                ) : (
                    <RatioIcon title={renderText(IntlText.lightbox_ratio)} />
                ),
            handler: handleRatioToggle,
            key: "5",
        },
    ];
    const win = remote.getCurrentWindow();
    const windowsTrafficAction = [
        {
            Icon: () => <HeaderResizeMinIcon bodyStyle={{ color: "var(--icon-color-normal)" }} />,
            key: "min",
            handler: () => win.minimize(),
        },
        {
            Icon: () => (
                <HeaderResizeToggleIcon bodyStyle={{ color: "var(--icon-color-normal)" }} />
            ),
            key: "toggle",
            handler: () => (win.isMaximized() ? win.unmaximize() : win.maximize()),
        },
        {
            Icon: () => <HeaderCloseIcon bodyStyle={{ color: "var(--icon-color-normal)" }} />,
            key: "close",
            handler: () => !win.isDestroyed() && win.destroy(),
        },
    ];

    const { SIZE_INFO } = constant_LightBox;

    if (!renderAble) return null;
    return (
        <section id="lightBox-container__wrapper" className={styles.box}>
            <nav className={styles.actionLine} style={{ height: SIZE_INFO.headerBar }}>
                {!device.isMac() && (
                    <aside className={styles.winTraffic}>
                        {windowsTrafficAction.map(({ Icon, handler, key }) => (
                            <span
                                className={classNames(styles.trafficItem, {
                                    [styles.close]: key === "close",
                                })}
                                onClick={handler}
                            >
                                <Icon />
                            </span>
                        ))}
                    </aside>
                )}

                {headerAction.map(({ Icon, overlayStyles = {}, handler, key }) => (
                    <span
                        key={key}
                        className={classNames(styles.item, styles.disableDrag)}
                        onClick={() => handler && handler()}
                        style={overlayStyles}
                    >
                        <Icon />
                    </span>
                ))}
            </nav>
            {/*{!store.initDone ? null : (*/}
            {/*// <Loading />n*/}

            <section
                style={{ height: `calc(100vh - ${SIZE_INFO.headerBar}px)`, width: "100%" }}
                className={classNames(
                    styles.innerBox,
                    device.isMac() && styles.nativeDrag,
                    dragAble && styles.disableDrag
                )}
            >
                <LightBox
                    onRatioChange={handleRatioChange}
                    setDragAble={setDragAble}
                    ref={lightBoxRef}
                    mainSrc={mainSource.path || pre || downloadError}
                    // wrapperClassName={styles.container}
                    // nextSrc={nextSource && nextSource.path}
                    // prevSrc={prevSource && prevSource.path}
                    // onCloseRequest={() => console.log("native close")}
                    // reactModalStyle={{
                    //     width: 500,
                    // }}
                    // imageLoadErrorMessage={<img src={downloadError} alt="" />}
                    // clickOutsideToClose={false}
                    // discourageDownloads={false}
                    // imagePadding={50}
                    // reactModalProps={{
                    //     overlayClassName: styles.overlay,
                    //     focusLaterElements: true,
                    //     tabIndex: 1,
                    //     shouldForceAfterRender: true,
                    //     // shouldReturnFocusAfterClose: false,
                    //     parentSelector: () => document.querySelector("#lightBox-container__wrapper"),
                    // }}
                />

                {store.initDone && (
                    <Fragment>
                        <aside
                            onClick={() => store.prevAble && handleSetIndex(store.forceIndex + 1)}
                            className={classNames(
                                styles.disableDrag,
                                styles.navBtn,
                                styles.leftBar,
                                {
                                    [styles.actionDisable]: !store.prevAble,
                                }
                            )}
                        >
                            <span className={classNames(styles.wrapper, styles.disableDrag)}>
                                <RightIcon />
                            </span>
                        </aside>
                        <aside
                            onClick={() => store.nextAble && handleSetIndex(store.forceIndex - 1)}
                            className={classNames(
                                styles.disableDrag,
                                styles.navBtn,
                                styles.rightBar,
                                {
                                    [styles.actionDisable]: !store.nextAble,
                                }
                            )}
                        >
                            <span className={classNames(styles.disableDrag, styles.wrapper)}>
                                <LeftIcon />
                            </span>
                        </aside>
                    </Fragment>
                )}

                {/* progress */}
                {!mainSource.load && downloadingPercent ? (
                    <section className={styles.progressContainer}>
                        <Progress
                            percent={downloadingPercent}
                            type="circle"
                            width={70}
                            strokeWidth={4}
                            strokeLinecap="round"
                            strokeColor="#10ddde"
                            trailColor="#0007"
                        />
                    </section>
                ) : null}

                {/* moments 和  message 展示顺序相反。message 不需要展示，目前只有moments需要展示 */}
                {showIndex && store.list && store.list.length && store.forceIndex !== -1 ? (
                    <footer className={styles.cursor}>
                        {store.list.length - 1 - store.forceIndex + 1} / {store.list.length}
                    </footer>
                ) : null}
            </section>
            {/*)}*/}
        </section>
    );
}
