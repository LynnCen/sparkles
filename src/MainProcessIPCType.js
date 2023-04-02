/**
 * @Author Pull
 * @Date 2021-08-17 15:43
 * @project Main_Process_Dialog_Type
 */
export const AppletIPCType = require("./otherRenderProcess/Applet/IPCType");
export const SettingIPCType = require("./otherRenderProcess/Settings/IPCType");

export const MomentsIPCTypes = {
    shareApplet: "moments_share_applet",
};

export const ChatIPCType = {
    forwardApplet: "im_chat_forward_applet",
};

export const LightBoxIPCType = {
    initData: "light_box_initData",
    createLightBox: "light_box_create",
};

const IPCType = {
    CHECKING_UPDATE_RESULT: "checking_update_result_modal",

    AppletIPCType,
    SettingIPCType,

    LightBoxIPCType,
    ChatIPCType,
    MomentsIPCTypes,

    Common: {
        intlTranslate: "intl_translate",
    },
};
export default IPCType;
