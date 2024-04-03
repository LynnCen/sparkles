import { useEffect, useState } from "react";
import { ipcRenderer } from "../../platform";
import IPCType from "../../../MainProcessIPCType";
import settings from "../stores/settings";
import localeFormat from "utils/localeFormat";

export const useLocalFormat = () => {
    const [_, updateLocal] = useState(settings.locale);

    const handler = (e, locale) => {
        updateLocal(locale);
    };
    useEffect(() => {
        ipcRenderer.on(IPCType.SettingIPCType.updateLocale, handler);

        return () => {
            ipcRenderer.off(IPCType.SettingIPCType.updateLocale, handler);
        };
    }, []);

    return {
        formatMessage: localeFormat,
    };
};
