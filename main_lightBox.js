/**
 * @Author Pull
 * @Date 2021-08-19 11:42
 * @project main_lightBox
 */

import { BrowserWindow, dialog, globalShortcut, ipcMain } from "electron";
import { icon } from "./main";
import { LightBoxIPCType } from "./src/MainProcessIPCType";
import { constant_LightBox } from "./src/ProcessCommonConstants";

const POLL_SIZE = 2;
const WIN_STATUS = {
    used: "used",
    unUsed: "un_used",
};

export function createLightBoxWindow({ count = 1 }) {
    const winList = [];
    for (let i = 0; i < count; i++) {
        let win = new BrowserWindow({
            width: constant_LightBox.SIZE_INFO.width,
            height: constant_LightBox.SIZE_INFO.height,
            titleBarStyle: "hidden",
            frame: false,
            center: true,
            hasShadow: true,
            // transparent: true,
            // backgroundColor: "#0009",
            // preload: nodePath.resolve(__dirname, "./main_lightbox_preload.js"),
            show: false,
            icon,
            simpleFullscreen: true,
            webPreferences: {
                // scrollBounce: true,
                nodeIntegration: true,
                enableRemoteModule: true,
                // nativeWindowOpen: true,
                // disableHtmlFullscreenWindowResize: true,
                webSecurity: false,
            },
        });

        const { x, y } = win.getBounds();
        win.setPosition(x + 64, y + 100);

        win.link_statue = WIN_STATUS.unUsed;
        // ipcMain.once("lightBox_close", () => {
        //     if (!win.isDestroyed()) win.close();
        //     win = null;
        // });
        // ipcMain.on("lightBox_select-path", (event, { defaultPath, sourcePath }) => {
        //     const path = dialog.showSaveDialogSync({
        //         properties: ["showHiddenFiles", "createDirectory"],
        //         defaultPath,
        //     });
        //     event.returnValue = path || "";
        // });
        // win.webContents.toggleDevTools();
        win.loadURL(`file://${__dirname}/src/lightlyWindow/LightBox/index.html?pageName=lightBox`);

        win.once("closed", () => {
            const poll = ctx.getLightBoxPoll();
            // if (poll.length > 3) {};
            const list = poll.filter((item) => item !== win);

            ctx.setLightBoxPoll(list);
        });

        winList.push(win);
    }

    return winList;
}

export const showLightBoxWin = (dataSource) => {
    const instance = ctx.getLightBoxPoll().find((item) => item.link_statue === WIN_STATUS.unUsed);

    instance.link_statue = WIN_STATUS.used;
    instance.webContents.send(LightBoxIPCType.initData, dataSource);

    // instance.webContents.toggleDevTools();
    instance.show();
    _checkPoll();
};

export const resetLightBox = () => {
    const poll = ctx.getLightBoxPoll();

    poll.forEach((win) => {
        // avoid create again;
        win.removeAllListeners("closed");
        //
        if (!win.isDestroyed()) win.destroy();
    });

    ctx.setLightBoxPoll([]);

    initLightBoxPoll();
};

const _checkPoll = () => {
    const currentPoll = ctx.getLightBoxPoll();
    const lessCount = currentPoll.filter((item) => item.link_statue === WIN_STATUS.unUsed);

    if (lessCount.length < 3) {
        const createCount = POLL_SIZE - lessCount.length;
        const list = createLightBoxWindow({ count: createCount });
        const poll = [...currentPoll, ...list];
        ctx.setLightBoxPoll(poll);
    }
};

/**
 *
 * @param ob
 */
export const initLightBoxPoll = () => {
    const poll = createLightBoxWindow({ count: POLL_SIZE });
    ctx.setLightBoxPoll(poll);
};

export const ctx = new (class LightCtx {
    store;
    init(store) {
        store.cu_lightBoxPoll = [];
        this.store = store;
    }

    setLightBoxPoll(poll) {
        this.store.lightBoxPoll = poll;
    }

    getLightBoxPoll() {
        return this.store.lightBoxPoll;
    }
})();

export default ctx;
