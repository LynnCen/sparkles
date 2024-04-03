const { ipcRenderer } = require("electron");
// const ICPType = require("./IPCType.js");

// ipcRenderer.on(ICPType.ContentViewBack, () => {
ipcRenderer.on("applet_contentViewBack", () => {
    try {
        window.history.back();
    } catch (e) {
        console.log("fail", e);
    }
});

// ipcRenderer.on(ICPType.ReloadLink, (e, link) => {
ipcRenderer.on("applet_reloadLink", (e, link) => {
    try {
        window.location.href = link;
    } catch (e) {
        console.log("fail", e);
    }
});
