import { BrowserView, BrowserWindow } from "electron";
const APPLET = require("./src/otherRenderProcess/Applet/contants.js");
const IPCType = require("./src/MainProcessIPCType.js");
import nodePath from "path";

export const Views = {
    Main: "main",
    ActionBar: "actionBar",
    ActionBoard: "actionBoard",
};

// 顶部留白间距
const offsetTop = 24 + 32;

// 宽高比例 16：9
const scaleL = 16;
const scaleM = 9;

// 默认缩放倍数
const base = 55;

const vertical = { width: base * scaleM, height: base * scaleL };
const horizontal = { width: base * scaleL, height: base * scaleM };

/**
 *
 * @description 设置 view 层级
 * @param win { BrowserWindow }
 * @param key { string }
 */
export const setViewToTop = (win, key) => {
    const views = win.getBrowserViews();

    const view = views.find((item) => item.key === key);

    // 调整 view 层级
    if (view) {
        win.removeBrowserView(view);
        win.addBrowserView(view);
    }
};

/**
 * @description 创建小程序主窗口
 * @param appInfo
 * @returns {Electron.BrowserWindow}
 */
export const createAppletWindow = (appInfo) => {
    const { link_url, screen_style, style, type, name } = appInfo;

    const size = screen_style === 1 ? vertical : horizontal;
    const win = new BrowserWindow({
        title: name || "open plaf",
        width: size.width,
        height: size.height,
        titleBarStyle: "hidden",
        backgroundColor: "none",
        center: true,
        hasShadow: true,
        frame: false,
        resizable: true,
        minWidth: size.width,
        minHeight: size.height,
        maximizable: false,
        fullscreen: false,
        fullscreenable: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });

    win.loadURL(
        `file://${__dirname}/src/otherRenderProcess/Applet/App.html?data=${JSON.stringify({
            name,
            style,
            type,
        })}`
    );

    win.once("close", () => {
        closeApplet();
    });

    win.on("will-resize", _handleResizeWithRatio);
    createContentView(win, { size, link_url });
    return win;
};

/**
 * @description 加载其他到小程序
 * @param win { BrowserWindow }
 */
export const reloadApplet = (win, appInfo) => {
    const { link_url, screen_style, style, type, name } = appInfo;

    const size = screen_style === 1 ? vertical : horizontal;

    //  销毁之前的view
    const views = win.getBrowserViews();
    views.forEach((view) => {
        view.webContents.removeAllListeners();
        win.removeBrowserView(view);
        view.destroy();
    });

    win.setMinimumSize(size.width, size.height);
    win.setBounds(size);
    win.center();
    win.loadURL(
        `file://${__dirname}/src/otherRenderProcess/Applet/App.html?data=${JSON.stringify({
            name,
            style,
            type,
        })}`
    );

    win.setTitle(name);

    createContentView(win, { size, link_url });
};

/**
 * @description 生成BrowserView 位置
 * @param {{ width: number, height: number }} size
 * @returns
 */
const getContentViewBounds = (size) => {
    return {
        x: 0,
        y: offsetTop,
        width: size.width,
        height: size.height - offsetTop,
    };
};
/**
 * @description 创建 browserView 主内容区
 * @param win { BrowserWindow }
 * @param size { {width: number, height: number} }
 * @param link_url { urlString }
 */
const createContentView = (win, { size, link_url }) => {
    const view = new BrowserView({
        webPreferences: {
            sandbox: true,
            preload: nodePath.resolve(__dirname, "./src/otherRenderProcess/Applet/preload.js"),
        },
    });
    win.addBrowserView(view);
    view.setBounds(getContentViewBounds(size));

    view.webContents.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) (Android9.0) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8"
    );
    const handleLink = (event, url) => {
        event.preventDefault();
        view.webContents.send(IPCType.AppletIPCType.ReloadLink, url);
    };

    view.webContents.on("new-window", handleLink);
    view.webContents.on("will-navigate", handleLink);

    view.webContents.loadURL(link_url);
    view.key = APPLET.VIEWS_KEY.Main;
};

/**
 * @description 创建操作弹框
 * @param mainWin { BrowserWindow }
 */
export const createActionBoard = (mainWin) => {
    try {
        const views = mainWin.getBrowserViews();
        // pre: 检查是否存在当前 view
        const board = views.find((item) => item.key === APPLET.VIEWS_KEY.ActionBoard);
        if (board) return closeActionBoard(mainWin);

        // 1. 获取 view 大小
        const mainView = views.find((item) => item.key === APPLET.VIEWS_KEY.Main);
        if (!mainView) return;

        // 2. 生成 当前view 位置, 继承主view大小，蒙层。
        const mainViewBounds = mainView.getBounds();

        // 3. 生成 view;
        const view = new BrowserView({
            webPreferences: {
                nodeIntegration: true,
            },
        });

        // 添加到主窗口
        mainWin.addBrowserView(view);
        view.setBackgroundColor("#0000");
        view.setBounds(mainViewBounds);
        const data = [
            {
                key: APPLET.ACTION_KEY.ShareToChat,
                label: "Send to Chat",
            },
            {
                key: APPLET.ACTION_KEY.ShareToMoments,
                label: "Share on Moments",
            },
            {
                key: APPLET.ACTION_KEY.Minimize,
                label: "Minimize",
            },
        ];
        view.webContents.loadURL(
            `file://${__dirname}/src/otherRenderProcess/Applet/component/actionBoard.html?data=${JSON.stringify(
                data
            )}`
        );
        view.key = APPLET.VIEWS_KEY.ActionBoard;

        // 调整 actionBar 层级
        // setViewToTop(mainWin, Views.ActionBar);
    } catch (e) {
        console.log(e);
    }
};

/**
 * @description 关闭操作弹框
 * @param mainWin { BrowserWindow }
 */
export const closeActionBoard = (mainWin) => {
    const views = mainWin.getBrowserViews();
    const board = views.find((item) => item.key === APPLET.VIEWS_KEY.ActionBoard);

    if (board) mainWin.removeBrowserView(board);
};

/**
 * @description 关闭小程序
 */
export const closeApplet = () => {
    if (global.appletInfo.win !== null) {
        const win = global.appletInfo.win;

        try {
            if (!win.isDestroyed()) {
                const views = win.getBrowserViews();
                views.forEach((view) => {
                    win.removeBrowserView(view);
                    view.destroy();
                });

                win.destroy();
            }
        } catch (e) {
            console.log("throw error", e);
        }

        global.appletInfo.win = null;
        global.appletInfo.content = {};
    }
};

/**
 *
 * @param { Event } e
 * @param { Rectangle } newBounds
 * @param { { edge: string } } details
 */
const _handleResizeWithRatio = (e, newBounds, details) => {
    e.preventDefault();

    const win = global.appletInfo.win;
    const oldBounds = win.getBounds();
    const { width, height } = newBounds;

    // 禁止横行拖拽，只能等比缩放
    if (oldBounds.width === width || oldBounds.height === height) {
        return;
    }

    let resetBounds = { width: 0, height: 0 };

    if (oldBounds.width >= width && oldBounds.height >= height) {
        // 放大
        const heightSpace = height - oldBounds.height;
        const widthSpace = width - oldBounds.width;

        if (heightSpace >= widthSpace) {
            // 最大 放大边是 y
            resetBounds = _getSizeByRatio(height, "y");
        } else {
            // 最大放大边是 x
            resetBounds = _getSizeByRatio(width, "x");
        }
    } else if (oldBounds.width <= width && oldBounds.height <= height) {
        // 缩小
        const heightSpace = oldBounds.height - height;
        const widthSpace = oldBounds.width - width;

        // 最大 缩小边 是 y
        if (heightSpace >= widthSpace) {
            resetBounds = _getSizeByRatio(height, "y");
        } else {
            // 最大 缩小边
            resetBounds = _getSizeByRatio(width, "x");
        }
    } else {
        return;
    }

    if (!resetBounds.width || !resetBounds.height) return;
    // console.log('effect')
    // resize browserView 大小。
    const views = win.getBrowserViews();
    win.setBounds(resetBounds);
    views.forEach((view) => {
        //  主窗口
        if (view.key === APPLET.VIEWS_KEY.Main) {
            view.setBounds(getContentViewBounds(resetBounds));
        }

        if (view.key === APPLET.VIEWS_KEY.ActionBoard) {
            view.setBounds(getContentViewBounds(resetBounds));
        }
    });
};

/**
 * @description 等比缩放
 * @param { number } size
 * @param { 'x' | 'y' } axis
 */
const _getSizeByRatio = (size, axis) => {
    const { screen_style } = global.appletInfo.content;

    if (!screen_style) return false;

    const verticalX = scaleM / scaleL,
        horizontalY = scaleM / scaleL;
    const verticalY = scaleL / scaleM,
        horizontalX = scaleL / scaleM;

    let width = 0,
        height = 0;

    if (axis === "x") {
        width = size;
        const ratio = screen_style === APPLET.SCREEN_TYPE.HORIZONTAL ? horizontalY : verticalY;
        height = parseInt(`${width * ratio}`);
    } else {
        height = size;
        const ratio = screen_style === APPLET.SCREEN_TYPE.HORIZONTAL ? horizontalX : verticalX;
        width = parseInt(`${height * ratio}`);
    }

    return {
        width,
        height,
    };
};

export default createAppletWindow;
