/**
 * @Author Pull
 * @Date 2021-10-31 11:14
 * @project useAction
 */
import { ActionRole } from "./constants";
import deleteMoments from "@newSdk/logic/moments/deleteMoments";
import { message, Modal } from "antd";
import MomentsDeleteContent from "@newSdk/model/moments/instance/MomentsDeleteContent";
import publishMoment from "@newSdk/service/api/moments/publishMoment";
import { useRef, useState } from "react";
import MomentMessageContent from "@newSdk/model/message/MomentMessageContent";
import { DefaultCompressSize, MediaType } from "../../../constants/media";
import { trimAndDropEmpty } from "@newSdk/utils";
import forward from "../../../../../stores_new/forward";
import localeFormat from "utils/localeFormat";
import { AuthType } from "@newSdk/model/moments/instance/MomentsNormalContent";
import forwardMessage from "utils/chatController/forwardMessage";

export const useAction = (momentInfo) => {
    const { id: mid, authType } = momentInfo;
    const [reportModal, setReportModal] = useState(false);
    const [popVis, setPopVis] = useState(false);
    const visDelay = useRef(null);
    const disableShare = authType !== AuthType.All;

    const showPopover = () => {
        // if (visDelay.current) clearTimeout(visDelay.current);
        // visDelay.current = setTimeout(() => {
        setPopVis(true);
        // }, 100);
    };

    const handleSendToFriends = async () => {
        // 分享
        console.log(momentInfo);
        const { id, uid, type, contentType, text, media = [] } = momentInfo;
        const item = media[0];

        const content = {
            mid: id,
            uid,
            type,
            text,
            contentType: contentType,
        };

        if (item) {
            const { mediaType } = item;
            if (item.mediaType === MediaType.IMAGE) {
                const { objectId, format, bucketId } = item;
                content.image = {
                    mediaType,
                    objectId,
                    fileType: format,
                    bucketId,
                    width: DefaultCompressSize.dWidth,
                    height: DefaultCompressSize.dHeight,
                };
            } else {
                const { posterFormat, posterObjectId, bucketId } = item;
                content.image = {
                    mediaType,
                    objectId: posterObjectId,
                    width: DefaultCompressSize.dWidth,
                    height: DefaultCompressSize.dHeight,
                    fileType: posterFormat,
                    bucketId: bucketId,
                };
            }
        }

        // console.log("--------> modal visible");
        // const res = await forward.open();
        forwardMessage(new MomentMessageContent("", trimAndDropEmpty(content)));

        // console.log("----->>", res);

        // if (res) message.success(localeFormat({ id: "success" }));
        // console.log(trimAndDropEmpty());

        // MomentMessageContent({
        //     type: MomentsType.NORMAL,
        // });
    };
    const handleCopyLink = () => {};

    const handleHide = () => {};
    const handleDel = async () => {
        Modal.confirm({
            content: localeFormat({ id: "deleteMomentsTip" }),
            okText: localeFormat({ id: "ConfirmTranslate" }),
            cancelText: localeFormat({ id: "Cancel" }),
            onOk: async () => {
                await deleteMoments(mid);
                const del = new MomentsDeleteContent(mid);
                // return;
                const res = await publishMoment(del);
                if (res) message.success(localeFormat({ id: "momentDeleted" }));
            },
        });
    };

    const handleClick = (role, disabled) => {
        setPopVis(false);

        if (disabled) return message.warn(localeFormat({ id: "disableShare" }));
        switch (role) {
            case ActionRole.SEND:
                return handleSendToFriends();
            case ActionRole.LINK:
                return handleCopyLink();
            case ActionRole.REPORT:
                return setReportModal(true);
            case ActionRole.HIDE:
                return handleHide();
            case ActionRole.DELETE:
                return handleDel();
        }
    };

    return {
        handleClick,
        reportModal,
        popVis,
        disableShare,
        show: showPopover,
        hide: () => setPopVis(false),
        hideReportModal: () => setReportModal(false),
    };
};

export default useAction;
