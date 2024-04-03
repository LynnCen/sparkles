const { contextBridge, ipcRenderer } = require("electron");
const ipcTy = require("./IPCType");
const { localeMap } = require("../../../locales/Locales");
const pkg = require("../../../package.json");

contextBridge.exposeInMainWorld("ctx", {
    autoModal: () => ipcRenderer.invoke(ipcTy.settingActionAutoTheme),
    lightModal: () => ipcRenderer.invoke(ipcTy.settingActionLightTheme),
    darkModal: () => ipcRenderer.invoke(ipcTy.settingActionDarkTheme),

    closeSetting: () => ipcRenderer.invoke(ipcTy.closeSetting),
    updateLocal: (locale) => ipcRenderer.send(ipcTy.updateLocale, locale),
    settingsApply: (settings) => ipcRenderer.send(ipcTy.settingsApply, settings),
    logout: (local) => ipcRenderer.send(ipcTy.forceExit, local),
    localeMap,
    version: pkg.version,
    // settings: {},
    initListener: (cb) =>
        ipcRenderer.on(ipcTy.SettingsDataUpdate, (e, values) => {
            cb && cb(values);
        }),
    onMyInfoUpdate: (cb) =>
        ipcRenderer.on(ipcTy.settingUserInfoUpdate, (e, info) => {
            cb && cb(info);
        }),
});
