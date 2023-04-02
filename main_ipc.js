import IPCType from "./src/MainProcessIPCType";
import { ipcMain, nativeTheme } from "electron";
import createAppletWindow, {
    closeActionBoard,
    closeApplet,
    createActionBoard,
    reloadApplet,
} from "./main_applet";
import { showLightBoxWin } from "./main_lightBox";
import clientSettingCtx, { getSettingWindow } from "./main_clientSettings";

export const ipcHandle = ({ mainWindow }) => {
    handleApplet(mainWindow);
    handleLightBox(mainWindow);
    handleSettings(mainWindow);
};

const handleLightBox = () => {
    ipcMain.on(IPCType.LightBoxIPCType.createLightBox, (event, dataSource) =>
        showLightBoxWin(dataSource)
    );
};

const handleApplet = (mainWindow) => {
    const { appletInfo } = global;

    ipcMain.on(IPCType.AppletIPCType.ShowMiniProgram, (event, args) => {
        const { appInfo, theme } = args;

        global.appletInfo.content = appInfo;

        // 加载其他小程序
        if (global.appletInfo.win) {
            global.appletInfo.win.focus();
            return reloadApplet(global.appletInfo.win, appInfo);
        }

        // 初次创建
        const appletWin = createAppletWindow(appInfo);

        global.appletInfo.win = appletWin;
    });

    ipcMain.on(IPCType.AppletIPCType.CloseMiniProgram, closeApplet);

    // 打开操作弹框
    ipcMain.on(IPCType.AppletIPCType.ShowAction, () => {
        createActionBoard(appletInfo.win);
    });

    // 关闭操作弹框
    ipcMain.on(IPCType.AppletIPCType.CloseActionBoard, () => {
        closeActionBoard(appletInfo.win);
    });

    // 分享到聊天
    ipcMain.on(IPCType.AppletIPCType.shareToChat, () => {
        try {
            mainWindow.focus();
            // const msg = { type: type, content: { ...rest } };
            mainWindow.webContents.send(IPCType.ChatIPCType.forwardApplet, appletInfo.content);
        } catch (e) {
            console.log("----------->>>> share applet to chat error", e);
        }
    });

    // 分享到 moments
    ipcMain.on(IPCType.AppletIPCType.shareToMoments, () => {
        mainWindow.focus();

        mainWindow.webContents.send(IPCType.MomentsIPCTypes.shareApplet, appletInfo.content);
    });

    // 最小化
    ipcMain.on(IPCType.AppletIPCType.minimize, () => {
        if (appletInfo.win) appletInfo.win.minimize();
    });
};

const handleSettings = (mainWin) => {
    ipcMain.on(IPCType.SettingIPCType.SettingsWinToggle, (event, settings) => {
        clientSettingCtx.toggleWindow(settings);
    });
    ipcMain.on(IPCType.SettingIPCType.settingUserInfoUpdate, (_, myInfo) => {
        const setting = clientSettingCtx.getSettingWin();
        if (setting) setting.webContents.send(IPCType.SettingIPCType.settingUserInfoUpdate, myInfo);
    });
    ipcMain.handle(IPCType.SettingIPCType.settingActionDarkTheme, () => {
        nativeTheme.themeSource = "dark";
    });
    ipcMain.handle(IPCType.SettingIPCType.settingActionAutoTheme, () => {
        nativeTheme.themeSource = "system";
    });
    ipcMain.handle(IPCType.SettingIPCType.settingActionLightTheme, () => {
        nativeTheme.themeSource = "light";
    });
    ipcMain.handle(IPCType.SettingIPCType.closeSetting, () => {
        clientSettingCtx.hideWin();
    });
};

export default ipcHandle;
