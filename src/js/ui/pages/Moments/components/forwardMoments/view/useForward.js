/**
 * @Author Pull
 * @Date 2021-10-14 10:17
 * @project useForward
 */
import { useRef, useState, useEffect } from "react";
import { defaultPublishAuthOptions } from "../../../constants/publishAuthOptions";
import MomentsNormalContent, {
    AuthType,
} from "@newSdk/model/moments/instance/MomentsNormalContent";
import publishMoment from "@newSdk/service/api/moments/publishMoment";
import { trimAndDropEmpty } from "@newSdk/utils";
import { useUserSelect } from "../../../../../hooks/useUserSelect";
import { PublishMomentLimitChar } from "../../../constants/base";
import MomentsType from "@newSdk/model/moments/instance/MomentsType";
import UiEventCenter, { UiEventType } from "utils/sn_event_center";
import { useIntl } from "react-intl";
export const useForward = (forwardInfo, handleClose) => {
    // 模态框可见
    // 表情可见
    const [emojiVisible, setEmojiVisible] = useState(false);
    // 权限选择器
    const [authValue, setAuthValue] = useState(defaultPublishAuthOptions);
    // 富文本实例
    const inputRef = useRef();
    // 上传控件
    // 媒体选择列表
    // 已选择用户
    const [selectedList, setSelectList] = useState([]);
    const { formatMessage } = useIntl();

    //
    const [sending, setSending] = useState(false);

    const [sendAble, setSendAble] = useState(false);

    // 选择用户
    const { handleUserSelect } = useUserSelect(
        {
            left: "-80px",
        },
        true
    );

    // 唤起选择用户modal
    const handleReSelect = (initList) => {
        if (!initList || !initList.length) setSelectList([]);

        if ([AuthType.ShareWith, AuthType.DontShare].includes(authValue)) {
            handleUserSelect(initList).then((res) => setSelectList(res));
        } else {
            setSelectList([]);
        }
    };

    const resetState = () => {
        handleClose();
        setEmojiVisible(false);
        setAuthValue(defaultPublishAuthOptions);
        inputRef.current.clearTextArea && inputRef.current.clearTextArea();
    };

    const selectEmoji = (emoji) => {
        if (inputRef.current) {
            const { selectEmojiWithImg } = inputRef.current;
            selectEmojiWithImg(emoji);
            setEmojiVisible(false);
        }
    };

    const createMoment = (type, props = {}) => {
        const { getFormatContent } = inputRef.current;
        const text = getFormatContent();

        let authIds = [];
        if ([AuthType.ShareWith, AuthType.DontShare].includes(authValue)) {
            authIds = selectedList.map((item) => item.id);
        }
        const moment = new MomentsNormalContent({
            text,
            type,
            authType: authValue,
            authIds,
            ...props,
        });

        return moment;
    };

    // todo: moments 转发
    const onSubmitWithForwardMoment = async () => {
        try {
            if (inputRef.current && sendAble) {
                const { mid } = forwardInfo;
                const { getFormatContent } = inputRef.current;
                const text = getFormatContent();

                let authIds = [];
                if ([AuthType.ShareWith, AuthType.DontShare].includes(authValue)) {
                    authIds = selectedList.map((item) => item.id);
                }
                const moment = new MomentsNormalContent({
                    text,
                    type: 1,
                    authType: authValue,
                    referPre: mid,
                    authIds,
                });

                await publishMoment(trimAndDropEmpty(moment));
                resetState();
            }
        } catch (e) {
            console.log("forward fail", e);
        }
    };

    const formatAppletImgFields = ({ file_type, text, ...props }) => ({
        fileType: file_type,
        objectId: text,
        ...props,
    });

    // 小程序 分享
    const onSubmitWithShareApplet = async () => {
        if (inputRef.current && sendAble) {
            const { aid, name, description, icon = {}, type, logo = {} } = forwardInfo;
            const { getFormatContent } = inputRef.current;
            const text = getFormatContent() || formatMessage({ id: "shareAppletTip" });
            const moment = createMoment(MomentsType.Applet, {
                appletInfo: {
                    aid,
                    name,
                    description,
                    icon: formatAppletImgFields(icon),
                    type,
                    logo: formatAppletImgFields(logo),
                },
                text,
            });

            const momentItem = await publishMoment(trimAndDropEmpty(moment));

            if (momentItem) UiEventCenter.emit(UiEventType.MOMENT_REFRESH, momentItem);

            handleClose();
        }
    };

    const handleSelectAuth = (auth) => {
        if ([AuthType.ShareWith, AuthType.DontShare].includes(auth)) {
            const init = auth === authValue ? selectedList : [];
            handleUserSelect(init).then((list) => {
                if (!list || !list.length) return;
                setSelectList(list);
                setAuthValue(auth);
            });
        } else {
            setAuthValue(auth);
            setSelectList([]);
        }
    };

    const checkLimit = (charLength) => {
        if (charLength >= PublishMomentLimitChar) setSendAble(false);
        else setSendAble(true);
    };

    return {
        inputRef,
        emojiVisible,
        selectEmoji,
        authValue,
        selectedList,
        handleReSelect,
        setSending,
        emojiShow: (e) => {
            e.nativeEvent.stopImmediatePropagation();
            setEmojiVisible(!emojiVisible);
        },
        emojiHide: () => setEmojiVisible(false),
        authSelected: handleSelectAuth,
        onSubmitWithForwardMoment,
        onSubmitWithShareApplet,
        checkLimit,
        sending,
        sendAble,
    };
};

export default useForward;
