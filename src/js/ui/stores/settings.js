import { observable, action } from "mobx";
import { remote, ipcRenderer } from "../../platform";
import storage from "utils/storage";
import IPCType from "../../../MainProcessIPCType";

const initialize = (key) => {
    let settings = localStorage.getItem("settings");
    settings = settings ? JSON.parse(settings) : {};
    return settings[key];
};

class Settings {
    @observable configModalVisible = false;

    @observable alwaysOnTop = false;
    @observable startup = false;
    @observable locale = initialize("locale");

    constructor() {
        ipcRenderer.on(IPCType.SettingIPCType.updateLocale, (e, locale) => {
            self.setLocale(locale);
        });
    }

    @action originalState() {
        self.alwaysOnTop = false;
        self.startup = false;
        self.locale = initialize("locale");
    }

    @action toggleSettingVisible() {
        self.configModalVisible = !self.configModalVisible;
    }

    @action setAlwaysOnTop(alwaysOnTop) {
        self.alwaysOnTop = alwaysOnTop;
        self.save();
    }
    @action setStartup(startup) {
        self.startup = startup;
        self.save();
    }
    @action setLocale(locale) {
        self.locale = locale;
        self.save();
        // ipcRenderer.send("update-locale", locale);
    }

    // @action setStoragePath([p]) {
    //     const currentUser = path.join(p, WildFireIM.config.loginUser.name);
    //
    //     if (!fs.existsSync(currentUser)) fs.mkdirSync(currentUser); // 创建当前登录用户
    //     self.save();
    // }

    // Tag：老版本语言字符串，与 chromium Intl字符串不一致，修复后兼容老版本
    fixOldVersionIntlStr(localStr) {
        switch (localStr) {
            case "ZH-HANS":
                return "zh-CN";
            case "ZH_HANT":
                return "zh-TW";
            case "TUR":
                return "tr";
            case "EN":
                return "en";
            default:
                return localStr;
        }
    }

    @action
    async init(local) {
        var settings = await storage.get("settings");
        var { alwaysOnTop, startup, locale = local } = self;
        if (!self.locale && local) self.locale = locale;

        // fix-old
        if (self.locale) {
            self.locale = self.fixOldVersionIntlStr(self.locale);
        }
        if (settings && Object.keys(settings).length) {
            // Use !! force convert to a bool value
            self.alwaysOnTop = !!settings.alwaysOnTop;
            self.startup = !!settings.startup;
        } else {
            await storage.set("settings", {
                alwaysOnTop,
                startup,
                locale,
            });
        }
        self.save();
        return self;
    }

    save() {
        var { alwaysOnTop, startup, locale } = self;

        const a = storage.set("settings", {
            alwaysOnTop,
            startup,
            locale,
        });
        ipcRenderer.send("settings-apply", {
            settings: {
                alwaysOnTop,
                startup,
                locale,
            },
        });
    }

    @action
    clearCache() {
        self.originalState();
    }
}

const self = new Settings();
export default self;
