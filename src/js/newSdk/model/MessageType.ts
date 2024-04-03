export default class MessageType {
    static TextMessage = 1;
    static ImgMessage = 2;
    static AudioMessage = 3;
    static VideoMessage = 4;
    static AttachmentMessage = 5;
    static RedBonusMessage = 6; // red Bonus
    static CoinMessage = 7; // chat transition
    static RTCMessage = 8;
    static MiniProgramMessage = 9;
    static MomentShareMessage = 10;
    static TransactionMessage = 11; // tmmPay
    static RedBonusResultMessage = 12; // Grab red Bonus
    static MeetingMessage = 14;
    static AtMessage = 15;
    static DeleteSession = 16;
    static IntlTemplateMessage = 18;

    static DeleteFlagMessage = 81;
    static ACKReadMessage = 82;

    static _LocalTempTipMsg = 444444;
}
export const IntlTemplateGroupInfo = ["mod-group-notice", "mod-group-name", "mod-group-avatar"];
// updateGroupNotice: "mob-group-notice",
// updateGroupName: "mob-group-name",
// updateGroupAvatar: "mob-group-avatar",

export class MediaDownloadStatus {
    static cached = 1;
    static downloadError = 2;
    static disable = 3;
}

export const TransitionType = {
    Recharge: 10,

    SendP2PRedEnvelope: 20,
    ReceiveP2PRedEnvelope: 21,
    P2PRedEnvelopeBack: 22,

    SendGroupRedEnvelope: 23,
    ReceiveGroupRedEnvelope: 24,
    GroupRedEnvelopeBack: 25,

    Transition: 30,
    ScanAndQrCode: 40,
    WithDrawCost: 50,
    WithDrawBack: 51,
    WithDrawServices: 52,
    WithDrawServicesBack: 53,
};

export declare namespace MessageContent {
    type MediaContent = {
        text: string;
        file_type: string;
        bucketId: string;
    };

    type ImageMessageContent = MediaContent & {
        width: number;
        height: number;
        isOrigin: number;
    };

    type AudioMessageContent = MediaContent & {
        duration: number;
    };

    type AttachMessageContent = MediaContent & {
        name: string;
        size: number;
    };
}
