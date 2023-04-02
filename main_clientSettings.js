import nodePath from "path";
import { BrowserWindow, nativeTheme } from "electron";
import IPCType from "./src/MainProcessIPCType";
import nodeOs from "os";

/**
 *
 * @return {Electron.BrowserWindow}
 */
export const getSettingWindow = (info) => {
    const existWin = clientSettingCtx.getSettingWin();
    if (existWin) return existWin;

    const win = new BrowserWindow({
        show: false,
        width: 600,
        height: 466,
        fullscreen: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        center: true,
        titleBarStyle: "hidden",
        frame: false,
        webPreferences: {
            contextIsolation: true,
            preload: nodePath.resolve(__dirname, "./src/otherRenderProcess/Settings/preload.js"),
        },
    });

    info.isOsx = nodeOs.platform() === "darwin";

    info.shouldUseDarkModal = nativeTheme.shouldUseDarkColors;
    info.themeSource = nativeTheme.themeSource;
    win.loadURL(
        `file://${__dirname}/src/otherRenderProcess/Settings/index.html?${encodeURI(
            JSON.stringify(info)
        )}`
    );

    win.on("close", (e) => {
        win.hide();
        e.preventDefault();
        e.returnValue = false;
        return false;
    });

    return win;
};

export const clientSettingCtx = new (class SettingsCtx {
    /**
     * @type {{
     *     settingWin: BrowserWindow
     * }}
     */
    store;
    init(store) {
        store.settingWin = null;
        this.store = store;
    }

    setSettingWin(win) {
        this.store.settingWin = win;
    }

    getSettingWin() {
        return this.store.settingWin;
    }

    toggleWindow(info) {
        let { settingWin } = this.store;
        let initFlag = false;
        if (!settingWin) {
            initFlag = true;
            settingWin = getSettingWindow(info);
            this.setSettingWin(settingWin);
        }

        // if (settingWin.isVisible()) {
        //     return settingWin.hide();
        // }
        settingWin.webContents.send(IPCType.SettingIPCType.SettingsDataUpdate, info);
        settingWin.show();
        // settingWin.center();
        settingWin.focus();
        // settingWin.webContents.toggleDevTools();
        return initFlag;
    }

    hideWin() {
        let { settingWin } = this.store;
        if (settingWin) settingWin.hide();
    }

    closeWindow() {
        /**
         *
         * @type {BrowserWindow}
         */
        const win = this.store.settingWin;
        if (win) {
            win.removeAllListeners();
            win.destroy();
        }
        this.setSettingWin(null);
    }
})();

export default clientSettingCtx;
