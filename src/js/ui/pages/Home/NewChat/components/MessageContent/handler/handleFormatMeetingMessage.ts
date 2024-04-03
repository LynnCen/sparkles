import tmmUserInfo from "@newSdk/model/UserInfo";
import formatMis from "utils/date/formatMis";

enum MeetingType {
    oneToOneVoice = 1,
    oneToOneVideo,
    MultiVoice,
    MultiVideo,
}

enum MeetingResult {
    end = 1,
    overtime,
    otherSideBusy,
    otherSideReject,
    callSideCancel,
    singVoiceToMultiVoice,
    singeVideoToMultiVideo,
    accidentEnd,
}

type Content = {
    mtid: string;
    mt: MeetingType;
    creator: string;
    stime: number;
    etime: number;
    ctime: number;
    res: MeetingResult;
};

export const isVoiceCall = (content: Content) =>
    [MeetingType.oneToOneVoice, MeetingType.MultiVoice].includes(content.mt);

export const handleMeetingMsg = (content: Content, intl: any) => {
    const { creator, etime, stime, res, mt } = content;
    const isMe = creator === tmmUserInfo._id;
    const isShowDuration = res === MeetingResult.end;
    const isCall = isVoiceCall(content);
    const duration = formatMis(etime - stime);
    let str = "";
    switch (res) {
        case MeetingResult.end:
        case MeetingResult.accidentEnd: {
            str = intl.formatMessage({ id: "CallEnd" });
            break;
        }
        case MeetingResult.overtime:
            str = isMe
                ? intl.formatMessage({ id: "CallingFailOfSender" })
                : intl.formatMessage({ id: "CallingFailOfOthers" });
            break;
        case MeetingResult.otherSideBusy:
            str = isMe
                ? intl.formatMessage({ id: "CallingBusyOfSender" })
                : intl.formatMessage({ id: "CallingBusyOfOther" });
            break;
        case MeetingResult.otherSideReject:
            str = isMe
                ? intl.formatMessage({ id: "CallingRejectedOfSender" })
                : intl.formatMessage({ id: "CallingRejectedOfOther" });
            break;
        case MeetingResult.callSideCancel:
            str = isMe
                ? intl.formatMessage({ id: "CallingCancelOfSender" })
                : intl.formatMessage({ id: "CallingCancelOfOther" });
            break;
        case MeetingResult.singVoiceToMultiVoice:
        case MeetingResult.singeVideoToMultiVideo:
            str = isCall
                ? intl.formatMessage({ id: "SingleToMultiVoice" })
                : intl.formatMessage({ id: "SingleToMultiVideo" });
            break;
    }

    return {
        str,
        isShowDuration,
        duration,
        isCall,
    };
};
