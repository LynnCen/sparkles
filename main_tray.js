import { Menu, Tray } from "electron";

const isOsx = process.platform === "darwin";
const isWin = process.platform === "win32";

/**
 *
 * @param trayMenu
 * @param mainWindow { Electron.BrowserWindow }
 * @return {Electron.Tray}
 */
export const createTray = ({ trayMenu, mainWindow }) => {
    let icon;
    if (!isOsx) {
        icon = `${__dirname}/src/assets/images/dock.png`;
    } else {
        icon = `${__dirname}/src/assets/images/tray.png`;
    }

    const tray = new Tray(icon);

    tray.on("click", () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    if (isWin) {
        const contextmenu = Menu.buildFromTemplate(trayMenu);
        tray.setContextMenu(contextmenu);

        tray.on("right-click", () => {
            tray.popUpContextMenu();
        });
    }

    tray.setImage(icon);

    return tray;
};

export const updateTrayMenu = ({ tray, trayMenu }) => {
    if (isWin) {
        let contextmenu = Menu.buildFromTemplate(trayMenu);
        tray.setContextMenu(contextmenu);
    }
};

export const setTrayBlink = (() => {
    let blinkTimer = null;
    const interval = 500;
    const EmptyIcon = `${__dirname}/src/assets/images/Remind_icon.png`;
    const Icon = isOsx
        ? `${__dirname}/src/assets/images/tray.png`
        : `${__dirname}/src/assets/images/dock.png`;

    const blink = ({ avatar, tray }) => {
        // 如果有会话图标则为：会话图标/空白
        let icons = [avatar || Icon, EmptyIcon];

        let count = 0;
        if (blinkTimer) {
            clearInterval(blinkTimer);
        }

        blinkTimer = setInterval(() => {
            tray.setImage(icons[count++]);
            count = count > 1 ? 0 : 1;
        }, interval);
    };

    const unBlink = ({ tray }) => {
        clearInterval(blinkTimer);
        blinkTimer = null;
        tray.setImage(Icon);
    };

    return (flag, { avatar, tray }) => {
        if (flag) blink({ avatar, tray });
        else unBlink({ tray });
    };
})();
