import { useState, useEffect, useRef } from "react";
import IPCType from "../../../MainProcessIPCType";
import { ipcRenderer } from "electron";

export const useIntlFormat = (translateKeys) => {
    const [textMap, setTextMap] = useState({});
    useEffect(() => {
        _translate(translateKeys);
    }, []);

    useEffect(() => {
        ipcRenderer.on(IPCType.SettingIPCType.updateLocale, _handleLocaleUpdate);

        return () => {
            ipcRenderer.off(IPCType.SettingIPCType.updateLocale, _handleLocaleUpdate);
        };
    }, []);

    const _handleLocaleUpdate = () => _translate(translateKeys);

    const _translate = async (keys) => {
        const textMap = await ipcRenderer.invoke(IPCType.Common.intlTranslate, keys);
        setTextMap(textMap);
    };

    const renderText = (key) => textMap[key] || key;

    return {
        renderText,
    };
};

export default useIntlFormat;
