/**
 * @Author Pull
 * @Date 2021-10-24 17:03
 * @project ImageIcon
 */
import React from "react";
import CommonStore from "../../stores_new/common";
import { observer } from "mobx-react";
export const supportEnumType = {
    DOWNLOAD_FAIL: "downloadFail",
    DOWNLOADING: "downloading",
    SEARCHLOADING: "searchloading",
    AudioTrack_Other_Bg: "audioTrackOtherBg",
    AudioTrack_My_Bg: "audioTrackMyBg",
    AudioTrack_My_Play: "audioTrackMyPlay",
    RemoveItemIcon: "RemoveItemIcon",
    TMMIcon: "TMMIcon",
    TMMLogoIcon: "TMMLogoIcon",
    AudioBtn_My_Play: "AudioBtn_My_Play",
    AudioBtn_My_Stop: "AudioBtn_My_Stop",
    AudioBtn_Other_Play: "AudioBtn_Other_Play",
    AudioBtn_Other_Stop: "AudioBtn_Other_Stop",
    Translate_Message_Fail: "Translate_Message_Fail",
};

export const ImageEnum = {
    [supportEnumType.DOWNLOAD_FAIL]: {
        normal: require("images/mutiThemeIcon/downloadError.png"),
        dark: require("images/mutiThemeIcon/downloadError_dark.png"),
    },
    [supportEnumType.DOWNLOADING]: {
        normal: require("images/mutiThemeIcon/downloading.png"),
        dark: require("images/mutiThemeIcon/downloading.png"),
        classNames: "rotate-ani-normal",
    },
    [supportEnumType.SEARCHLOADING]: {
        normal: require("images/mutiThemeIcon/searchLoading.png"),
        dark: require("images/mutiThemeIcon/searchLoading.png"),
        classNames: "rotate-ani-normal",
    },
    [supportEnumType.AudioTrack_Other_Bg]: {
        normal: require("images/mutiThemeIcon/audioTrack_5e6a81.png"),
        dark: require("images/mutiThemeIcon/audioTrack_89.png"),
    },
    [supportEnumType.AudioTrack_My_Bg]: {
        normal: require("images/mutiThemeIcon/audioTrack_5e6a81.png"),
        dark: require("images/mutiThemeIcon/audioTrack_31.png"),
    },
    [supportEnumType.AudioTrack_My_Play]: {
        normal: require("images/mutiThemeIcon/audioTrack_primary.png"),
        dark: require("images/mutiThemeIcon/audioTrack_fff.png"),
    },
    [supportEnumType.RemoveItemIcon]: {
        normal: require("images/mutiThemeIcon/removeItem.png"),
        dark: require("images/mutiThemeIcon/removeItem_dark.png"),
    },
    [supportEnumType.TMMLogoIcon]: {
        normal: require("images/mutiThemeIcon/logo.png"),
        dark: require("images/mutiThemeIcon/logo_dark.png"),
    },
    [supportEnumType.AudioBtn_My_Play]: {
        // normal: require("images/mutiThemeIcon/audio_control/primary_white_play.png"),
        // dark: require("images/mutiThemeIcon/audio_control/white_primary_play.png"),
    },
    [supportEnumType.AudioBtn_My_Stop]: {
        // normal: require("images/mutiThemeIcon/audio_control/primary_white_stop.png"),
        // dark: require("images/mutiThemeIcon/audio_control/white_primary_stop.png"),
    },
    [supportEnumType.AudioBtn_Other_Play]: {
        // normal: require("images/mutiThemeIcon/audio_control/primary_white_play.png"),
        // dark: require("images/mutiThemeIcon/audio_control/primary_black_play.png"),
    },
    [supportEnumType.AudioBtn_Other_Stop]: {
        // normal: require("images/mutiThemeIcon/audio_control/primary_white_stop.png"),
        // dark: require("images/mutiThemeIcon/audio_control/primary_black_stop.png"),
    },
    [supportEnumType.Translate_Message_Fail]: {
        normal: require("images/mutiThemeIcon/translateFail.png"),
        dark: require("images/mutiThemeIcon/translateFail_dark.png"),
    },
    [supportEnumType.TMMIcon]: {
        normal: require("images/dock.png"),
        dark: require("images/dock.png"),
    },
};

/**
 * @typedef {Object} IProps
 * @property { React.CSSProperties } overlayStyle
 * @property { string } enumType
 * @property { React.ImgHTMLAttributes } attrs
 */

/**
 *
 * @type { React.FunctionComponent<IProps>} props
 * @property { supportEnumType } supportEnumType
 */

export const ImageIcon = observer(({ enumType, overlayStyle = {}, attrs = {} }) => {
    const { shouldUseDarkColors } = CommonStore;
    const item = ImageEnum[enumType];
    return (
        <section
            style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {shouldUseDarkColors ? (
                <img
                    src={item.dark}
                    style={overlayStyle}
                    className={item.classNames}
                    {...attrs}
                    alt=""
                    draggable="false"
                />
            ) : (
                <img
                    src={item.normal}
                    style={overlayStyle}
                    className={item.classNames}
                    {...attrs}
                    alt=""
                    draggable="false"
                />
            )}
        </section>
    );
});

ImageIcon.supportEnumType = supportEnumType;
export default ImageIcon;
