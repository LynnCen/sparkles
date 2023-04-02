import fs from "fs";
import tmp from "tmp";
import {
    app,
    powerMonitor,
    BrowserWindow,
    BrowserView,
    Tray,
    Menu,
    ipcMain,
    clipboard,
    shell,
    nativeImage,
    dialog,
    globalShortcut,
    nativeTheme,
} from "electron";
import AutoLaunch from "auto-launch";
import { autoUpdater } from "electron-updater";
import axios from "axios";
import i18n from "i18n";
import pkg from "./package.json";
import Screenshots from "./lib/electron-screenshots/lib/screenshots";

import sizeOf from "image-size";
import MainProcessDialogType from "./src/MainProcessIPCType";
import lightBoxCtx, { initLightBoxPoll, resetLightBox, showLightBoxWin } from "./main_lightBox";
import { closeApplet } from "./main_applet";
import ipcHandle from "./main_ipc";
import clientSettingCtx from "./main_clientSettings";
import IPCType from "./src/MainProcessIPCType";
import { supportLocaleKeys } from "./locales/Locales";
import { createTray, setTrayBlink, updateTrayMenu } from "./main_tray";
export const IS_DEV = process.env.debug || process.env.env !== "production";
// export const IS_DEV = true;

// TODO  need update handler func by product
process.on("uncaughtException", console.log);

let Locales = {};
i18n.configure({
    locales: supportLocaleKeys,
    directory: __dirname + "/locales",
    register: Locales,
    defaultLocale: "en",
    updateFiles: false,
    // staticCatalog: {
    //     en: require("./locales/en.json").default,
    //     tr: require("./locales/tr.json").default,
    //     "zh-CN": require("./locales/zh-CN.json").default,
    //     "zh-TW": require("./locales/zh-TW.json").default,
    // },
    // extension: ".js",
});
// default
Locales.setLocale("en");

global.sharedObj = {
    /*proto: proto,*/ Locales,
    localIntl: "",
};
global.appletInfo = {
    win: null,
    content: {},
};

global.bus_com = {
    lightBox: {},
    clientSetting: {},
};
lightBoxCtx.init(global.bus_com.lightBox);
clientSettingCtx.init(global.bus_com.clientSetting);

let isAutoUpdateAbel = false;
let forceQuit = false;
let downloading = false;

let mainWindow;
let tray;
let downloadFileMap = new Map();
let settings = {};
let isFullScreen = false;
let isOsx = process.platform === "darwin";
let isWin = !isOsx;
let isSuspend = false;
let userData = app.getPath("userData");
let imagesCacheDir = `${userData}/images`;
let voicesCacheDir = `${userData}/voices`;
let mainMenu = [
    {
        label: pkg.name,
        submenu: [
            {
                label: `About ${pkg.name}`,
                selector: "orderFrontStandardAboutPanel:",
            },
            {
                type: "separator",
            },
            {
                role: "hide",
            },
            {
                role: "hideothers",
            },
            {
                role: "unhide",
            },
            {
                label: Locales.__("pro_m_Main_Check"),
                accelerator: "Cmd+U",
                click() {
                    // checkForUpdates();
                    mainWindow.webContents.send("update");
                    mainWindow.webContents.send("label-update");
                },
            },
            {
                type: "separator",
            },
            {
                label: Locales.__("pro_m_Main_Quit"),
                accelerator: "Command+Q",
                selector: "terminate:",
                click() {
                    forceQuit = true;
                    mainWindow = null;
                    disconnectAndQuit();
                },
            },
        ],
    },
    {
        label: Locales.__("pro_m_Main_View_Title"),
        submenu: [
            {
                role: "undo",
                label: Locales.__("pro_m_Main_Undo"),
            },
            {
                role: "redo",
                label: Locales.__("pro_m_Main_Redo"),
            },
            {
                type: "separator",
            },
            {
                role: "cut",
                label: Locales.__("Cut"),
            },
            {
                role: "copy",
                label: Locales.__("Copy"),
            },
            {
                role: "paste",
                label: Locales.__("Paste"),
            },
            {
                role: "pasteandmatchstyle",
                label: Locales.__("pro_m_Main_PasteAndMatch"),
            },
            {
                role: "delete",
                label: Locales.__("Delete"),
            },
            {
                role: "selectall",
                label: Locales.__("SelectAll"),
            },
        ],
    },
    {
        label: Locales.__("pro_m_Main_Window_Title"),
        role: "window",
        submenu: [
            {
                label: Locales.__("pro_m_Main_Window_Min"),
                role: "minimize",
            },
            {
                label: Locales.__("pro_m_Main_Window_Close"),
                role: "close",
            },
        ],
    },
];

// 等待加载本地语言环境
let trayMenu = [];
let avatarPath = tmp.dirSync();
let avatarCache = {};
let avatarPlaceholder = `${__dirname}/src/assets/images/user-fallback.png`;
export const icon = `${__dirname}/src/assets/images/dock.png`;

// init
const createTrayMenu = () => {
    trayMenu = [
        {
            label: Locales.__("pro_m_Main_Toggle"),
            click() {
                if (mainWindow) {
                    let isVisible = mainWindow.isVisible();
                    isVisible ? mainWindow.hide() : mainWindow.show();
                }
            },
        },
        {
            type: "separator",
        },
        {
            label: Locales.__("pro_m_Main_Check"),
            // accelerator: "Cmd+U",
            click() {
                if (mainWindow) {
                    mainWindow.show();
                    // let isVisible = mainWindow.isVisible();
                    // if (!isVisible) mainWindow.show();
                }
                setTimeout(() => {
                    // checkForUpdates();
                    mainWindow.webContents.send("update");
                    mainWindow.webContents.send("label-update");
                }, 144);
            },
        },
        {
            label: Locales.__("pro_m_Main_Quit"),
            // accelerator: "Command+Q",
            selector: "terminate:",
            click: forceQuiteApp,
        },
    ];
};
createTrayMenu();

const forceQuiteApp = () => {
    forceQuit = true;
    mainWindow = null;
    // global.sharedObj.proto.disconnect(0);
    // console.log("--------------- disconnect", global.sharedObj.proto);
    let now = new Date();
    const exitTime = now.getTime() + 1e2;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime) break;
    }
    app.exit(0);
};

async function getIcon(cookies, userid, src) {
    var cached = avatarCache[userid];
    var icon;

    if (cached) {
        return cached;
    }

    if (cookies && src) {
        try {
            let response = await axios({
                url: src,
                method: "get",
                responseType: "arraybuffer",
                headers: {
                    Cookie: cookies,
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8",
                },
            });
            // eslint-disable-next-line
            let base64 = new Buffer(response.data, "binary").toString("base64");

            icon = `${avatarPath.name}/${userid}.jpg`;
            fs.writeFileSync(icon, base64.replace(/^data:image\/png;base64,/, ""), "base64");
        } catch (ex) {
            console.error(ex);
            icon = avatarPlaceholder;
        }
    }

    var image = nativeImage.createFromPath(icon);

    image = image.resize({ width: 24, height: 24 });

    avatarCache[userid] = image;

    return image;
}

function checkForUpdates() {
    mainWindow.webContents.send("check-update-begin");
    if (downloading) {
        return console.log(
            `Please leave the app open, the new version is downloading. You'll receive a new dialog when downloading is finished.`
        );
    }
    // if (autoUpdater.getFeedURL()) {}
    if (!isAutoUpdateAbel) return mainWindow.webContents.send("update-download-error");
    autoUpdater.checkForUpdates();
}

// todo
async function autostart() {
    try {
        var launcher = new AutoLaunch({
            name: pkg.name,
            path: `/Applications/${pkg.name}.app`,
        });

        if (settings.startup) {
            if (!isOsx) {
                return;
            }

            launcher.enable().catch((ex) => {
                console.error(ex);
            });
        } else {
            launcher.disable();
        }
    } catch (e) {
        console.log("error");
    }
}

function createMenu() {
    var menu = Menu.buildFromTemplate(mainMenu);

    if (isOsx) {
        Menu.setApplicationMenu(menu);
    } else {
        mainWindow.setMenu(null);
    }
}

function regShortcut() {
    // if(isWin) {
    if (IS_DEV) {
        globalShortcut.register("CommandOrControl+shift+c", () => {
            mainWindow.webContents.toggleDevTools();
        });
    }
    // }
}

function formatLocal(local) {
    switch (local) {
        case "zh":
            return "zh-CN";
        case "zh-CN":
        case "zh-TW":
        case "tr":
        case "sw":
        case "fr":
        case "ja":
        case "ko":
        case "it":
        case "id":
        case "de":
        case "da":
        case "cs":
        case "ms":
        case "hu":
        case "es":
        case "fi":
        case "ar":
            return local;
        // 'en-AU','en-CA', 'en-GB', 'en-NZ', 'en-US', 'en-ZA', 'others'
        default:
            return "en";
    }
}

const createMainWindow = () => {
    const screenshots = new Screenshots();
    // Tag chromium 默认语言环境
    let systemLocal = formatLocal(app.getLocale());
    global.sharedObj.localIntl = systemLocal;
    // Tag: 没有 tr对应多语言，暂时使用英文 __dirname + /locales
    Locales.setLocale(systemLocal === "tr" ? "en" : systemLocal);
    // 更新语言文案
    createTrayMenu();

    ipcMain.on("start-capture", () => {
        screenshots.startCapture();
    });
    // globalShortcut.register("ctrl+shift+a", () => screenshots.startCapture());
    // 点击确定按钮回调事件
    screenshots.on("ok", async (e, { dataURL, viewer }) => {
        // const width = viewer.x2 - viewer.x1;
        // const height = viewer.y2 - viewer.y1;

        const base64 = dataURL.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
        const dataBuffer = Buffer.from(base64, "base64");

        // const info = await createCache(dataBuffer)
        mainWindow.webContents.send("compress-img", dataBuffer, sizeOf(dataBuffer), true);

        // const sha1 = crypto.createHash('sha1').update(dataBuffer).digest('hex')
        // const dir = createDirForce(['img', sha1.slice(0, 2)])
        // const writePath = nodePath.join(dir, `${sha1}.png`)
        //
        // fs.writeFile(writePath, dataBuffer, (err) => {
        //     if (err) return console.log(err)
        //     // mainWindow.webContents.send("capture-ok", writePath);
        //     mainWindow.webContents.send(
        //         'compress-img',
        //         {
        //             buf: dataBuffer,
        //             contentHash: sha1,
        //             channel: 'compress-end',
        //             ext: '.png',
        //             originPath: writePath,
        //             size: {
        //                 width,
        //                 height
        //             },
        //             mime: mimeTypes.lookup('.png')
        //         }
        //      )
        // } )
    });
    // 点击取消按钮回调事件
    screenshots.on("cancel", () => {
        console.log("capture", "cancel1");
    });
    screenshots.on("cancel", (e) => {
        // 执行了preventDefault
        // 点击取消不会关闭截图窗口
        // e.preventDefault();
        console.log("capture", "cancel2");
    });

    // var mainWindowState = windowStateKeeper({
    //     defaultWidth: 960,
    //     defaultHeight: 720,
    // });

    mainWindow = new BrowserWindow({
        // x: mainWindowState.x,
        // y: mainWindowState.y,
        minWidth: 300,
        minHeight: 400,
        titleBarStyle: "hidden",
        backgroundColor: "none",
        center: true,
        hasShadow: true,
        // transparent: true,
        // resizable: false,
        webPreferences: {
            scrollBounce: true,
            nodeIntegration: true,
            enableRemoteModule: true,
            nativeWindowOpen: true,
            webSecurity: false,
        },
        show: false,
        frame: !isWin,
        icon,
    });
    // mainWindow.setSize(300, 400);
    mainWindow.setSize(1080, 720);
    mainWindow.setResizable(false);
    mainWindow.center();
    mainWindow.loadURL(`file://${__dirname}/src/index.html?main`);

    // if (isOsx) {
    nativeTheme.on("updated", function () {
        mainWindow.webContents.send("themeUpdated", nativeTheme.shouldUseDarkColors);
    });
    // }
    tray = createTray({ trayMenu, mainWindow });

    mainWindow.webContents.on("did-finish-load", () => {
        try {
            mainWindow.show();
            mainWindow.focus();
        } catch (ex) {}
    });

    mainWindow.webContents.on("new-window", (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    mainWindow.webContents.on("will-navigate", (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    mainWindow.on("close", (e) => {
        if (forceQuit || !tray) {
            mainWindow = null;
            disconnectAndQuit();
        } else {
            e.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on("focus", () => {
        mainWindow.webContents.send("currentWindow-focus");
        mainWindow.flashFrame(false);
        setTrayBlink(false, { tray });
    });

    ipcMain.on("voip-message", (event, args) => {
        // console.log('main voip-message event', args);
        mainWindow.webContents.send("voip-message", args);
    });

    ipcMain.on("update-call-start-message", (event, args) => {
        // console.log('main update-call-start-message event', args);
        mainWindow.webContents.send("update-call-start-message", args);
    });

    ipcMain.on("settings-apply", (event, args) => {
        settings = args.settings;
        mainWindow.setAlwaysOnTop(!!settings.alwaysOnTop);

        try {
            autostart();
        } catch (ex) {
            console.error(ex);
        }
    });

    ipcMain.on("show-window", (event) => {
        if (mainWindow && !mainWindow.isVisible()) {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    ipcMain.on("close-window", (event) => {
        mainWindow.hide();
    });

    ipcMain.on("min-window", (event) => {
        mainWindow.minimize();
    });

    // ipcMain.on('max-window', event => {
    //     mainWindow.maximize();
    // });

    ipcMain.on("unmax-window", (event) => {
        // mainWindow.unmaximize();
    });

    ipcMain.on("receive-newMsg", (e, { senderAvatar }) => {
        if (mainWindow.isFocused()) return mainWindow.flashFrame(false);
        if (isOsx) {
            app.dock.bounce("critical");
        } else {
            mainWindow.flashFrame(true);
        }
        setTrayBlink(true, { avatar: senderAvatar, tray });
    });

    ipcMain.on("unreadMsg-change", (e, unread) => {
        if (isOsx) {
            app.dock.setBadge(unread);
        }
    });

    ipcMain.on("toggle-max", (event) => {
        let isMax = mainWindow.isMaximized();
        if (isMax) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });
    ipcMain.on("exit", () => {
        forceQuiteApp();
    });

    ipcMain.on(IPCType.SettingIPCType.forceExit, () => {
        forceQuiteApp();
    });

    ipcMain.on("open-file", async (event, filename) => {
        shell.openItem(filename);
    });

    ipcMain.on("open-folder", async (event, dir) => {
        shell.openItem(dir);
    });

    ipcMain.on("open-map", (event, args) => {
        event.preventDefault();
        shell.openExternal(args.map);
    });

    ipcMain.on("open-image", async (event, args) => {
        var filename = `${imagesCacheDir}/img_${args.dataset.id}.png`;
        fs.writeFileSync(filename, args.base64.replace(/^data:image\/png;base64,/, ""), "base64");
        shell.openItem(filename);
    });

    ipcMain.on("is-suspend", (event, args) => {
        event.returnValue = isSuspend;
    });

    ipcMain.on("logined", (event) => {
        mainWindow.setResizable(true);
        mainWindow.setMinimumSize(1080, 720);
        mainWindow.setSize(1080, 720);
        mainWindow.center();
    });

    ipcMain.on("do-login", () => {
        // mainWindow.setMinimumSize(300, 400);
        // mainWindow.setSize(300, 400);
        // mainWindow.setSize(300, 400);
        // mainWindow.setResizable(false);
        // mainWindow.center();
        mainWindow.setResizable(true);
        mainWindow.setMinimumSize(1080, 720);
        mainWindow.setSize(1080, 720);
        mainWindow.center();
        // closeMini();

        closeApplet();
        resetLightBox();
        clientSettingCtx.closeWindow();
    });
    ipcMain.on("ondragstart", (event, filePath, fileIcon) => {
        event.preventDefault();
        const icon = `${__dirname}${fileIcon}`;

        event.sender.startDrag({
            file: filePath,
            icon: icon,
        });
    });
    ipcMain.on("select-path", (event, name) => {
        const path = dialog.showSaveDialogSync({
            properties: ["showHiddenFiles", "createDirectory"],
            defaultPath: name,
        });
        if (path && path.length) mainWindow.webContents.send("select-path/end", path);
    });

    ipcMain.on("select-folder", (event, defaultPath) => {
        const path = dialog.showOpenDialogSync({
            properties: ["createDirectory", "openDirectory"],
            defaultPath,
        });
        if (path && path.length) mainWindow.webContents.send("select-folder/end", path);
    });

    // 窗口抖动
    ipcMain.on("debounce", () => {
        const [x, y] = mainWindow.getPosition();
        const offset = () => Math.ceil(Math.random() * 5) - 3;

        const timer = setInterval(() => {
            mainWindow.setPosition(x + offset(), y + offset(), true);
        }, 16);

        setTimeout(() => {
            mainWindow.setPosition(x, y);
            clearInterval(timer);
        }, 600);
    });

    ipcMain.on(IPCType.SettingIPCType.updateLocale, (event, target) => {
        try {
            if (supportLocaleKeys.includes(target)) {
                Locales.setLocale(target);
                // console.log(Locales.__)
                createTrayMenu();
                updateTrayMenu({ tray, trayMenu });
                mainWindow.webContents.send(IPCType.SettingIPCType.updateLocale, target);
                lightBoxCtx.getLightBoxPoll().forEach((win) => {
                    win.webContents.send(IPCType.SettingIPCType.updateLocale, target);
                });
            }
        } catch (e) {
            console.error(e);
        }
    });

    ipcMain.on("checkForUpdate", (event, sourcePath) => {
        const isChina = app.getLocaleCountryCode() === "CN";

        // split country
        // let sourcePath = isChina ? args.upgrade_source : args.upgrade_source;
        console.log(sourcePath);
        autoUpdater.setFeedURL(sourcePath);
        isAutoUpdateAbel = true;
        checkForUpdates();
    });

    ipcMain.on("showWindow", () => {
        mainWindow.show();
        mainWindow.focus();
        // mainWindow.center()
    });

    ipcMain.handle(IPCType.Common.intlTranslate, (e, keys) => {
        let textMap = {};
        keys.forEach((key) => {
            textMap[key] = Locales.__(key) || key;
        });
        return textMap;
    });

    /* todo:

    ipcMain.on("getAuth", (event, args) => {
        !global.miniProgram.isAuthorized && subMiniProgramWindow && subMiniProgramWindow.show();
    });

    ipcMain.on("authorityMiniProgram", (event, args) => {
        global.miniProgram.isAuthorized = true;
        subMiniProgramWindow && subMiniProgramWindow.hide();
        miniProgramWindow && miniProgramWindow.webContents.send("authorityApp");
    });

    ipcMain.on("showMenu", function () {
        const newMenu = Menu.buildFromTemplate([
            {
                label: "Forward",
                click: () => {
                    mainWindow.focus();
                    const { logoImg, cover, ...rest } = global.miniProgram.appInfo.content;
                    const msg = { type: global.miniProgram.appInfo.type, content: { ...rest } };
                    mainWindow.webContents.send("forward", msg);
                },
                key: "Forward",
            },
            {
                label: "Share",
                click: () => {
                    mainWindow.focus();
                    mainWindow.webContents.send("mini_momentShare", {
                        ...global.miniProgram.appInfo.content,
                    });
                },
                key: "Share",
            },
        ]);

        newMenu.popup(mainWindow);
    });
*/

    powerMonitor.on("resume", () => {
        isSuspend = false;
        mainWindow.webContents.send("os-resume");
    });

    powerMonitor.on("suspend", () => {
        isSuspend = true;
    });

    if (isOsx) {
        app.setAboutPanelOptions({
            applicationName: pkg.name,
            applicationVersion: pkg.version,
            copyright: `Copyright ©2011-${new Date().getFullYear()} TMMTMM. All Rights Reserved.`,
            version: pkg.version,
        });
    }

    [imagesCacheDir, voicesCacheDir].map((e) => {
        if (!fs.existsSync(e)) {
            fs.mkdirSync(e);
        }
    });

    mainWindow.webContents.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8"
    );
    createMenu();
    regShortcut();

    //
    ipcHandle({
        appletInfo: global.appletInfo,
        mainWindow,
    });

    // init light box
    initLightBoxPoll({ icon });
};

app.setName(pkg.name);
app.dock && app.dock.setIcon(icon);

if (!app.requestSingleInstanceLock()) {
    console.log("only allow start one instance!");
    app.quit();
}

app.on("second-instance", () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        mainWindow.show();
    }
});

app.on("ready", () => {
    createMainWindow();
});
app.on("before-quit", () => {
    // Fix issues #14
    forceQuit = true;

    if (!tray) return;
    // if (!isOsx) {
    tray.destroy();
    // }
});
app.on("activate", (e) => {
    if (mainWindow && !mainWindow.isVisible()) {
        mainWindow.show();
    }
});

// TODO
function disconnectAndQuit() {
    // TODO
    // global.sharedObj.proto.disconnect(0);
    var now = new Date();
    var exitTime = now.getTime() + 500;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime) break;
    }
    app.quit();
}

// 唤起 ui 进程 模态框
const callBrowserModal = (() => {
    let current = false;

    return function callBrowserModal(webContent, options, fulfilledOps) {
        console.log(`call with ${options.cuName}`);
        // limit one modal
        if (current) return;

        current = true;
        webContent.send("system-dialog-call", options);

        const modalName = options.cuName;
        const defCall = new Function();
        const { resolveHandler = defCall, rejectHandler = defCall } = fulfilledOps;
        ipcMain.once(`system-dialog-call-cancel-${modalName}`, (...args) => {
            rejectHandler.apply(null, args);
            current = false;
        });
        ipcMain.once(`system-dialog-call-ok-${modalName}`, (...args) => {
            resolveHandler.apply(null, args);
            current = false;
        });
    };
})();

autoUpdater.on("update-not-available", (e, ...reset) => {
    downloading = false;
    mainWindow.webContents.send("update-not-available", reset);
    // mainWindow.webContents.send("update-checking-done");
});
autoUpdater.on("download-progress", (progress) => {
    mainWindow.webContents.send("download-progress", progress);
});

autoUpdater.on("update-available", (e) => {
    mainWindow.webContents.send("update-available");
    downloading = true;
    // checkForUpdates();
});

autoUpdater.on("error", (err, ...rest) => {
    // dialog.showMessageBox({
    //     type: "error",
    //     buttons: ["Cancel update"],
    //     title: pkg.name,
    //     message: `Failed to update ${pkg.name} :(`,
    //     detail: `An error occurred in retrieving update information, Please try again later.`,
    // });
    mainWindow.webContents.send("update-download-error", rest);
    downloading = false;
    console.error("autoUpdater-error", rest);
});

autoUpdater.on("update-downloaded", (info) => {
    const { releaseNotes, releaseName } = info;
    downloading = false;
    // callBrowserModal(
    //     mainWindow.webContents,
    //     {
    //         cuName: MainProcessDialogType.CHECKING_UPDATE_RESULT,
    //         type: "confirm",
    //         title: "Application Update",
    //         okText: "Restart",
    //         closable: true,
    //         centered: true,
    //         cancelText: "Later",
    //         content: `The new version has been downloaded. Please restart the application to apply the updates.`,
    //     },
    //     {
    //         rejectHandler: () => mainWindow.webContents.send("update-checking-done"),
    //         resolveHandler: () => {
    //             autoUpdater.quitAndInstall();
    //             setTimeout(() => {
    //                 mainWindow = null;
    //                 disconnectAndQuit();
    //             });
    //         },
    //     }
    // );
    // close checking modal
    mainWindow.webContents.send("update-checking-done");
    // autoUpdater.quitAndInstall();
    // setTimeout(() => {
    //     mainWindow = null;
    //     disconnectAndQuit();
    // });
});
ipcMain.on("install", () => {
    autoUpdater.quitAndInstall();
    setTimeout(() => {
        mainWindow = null;
        disconnectAndQuit();
    });
});
