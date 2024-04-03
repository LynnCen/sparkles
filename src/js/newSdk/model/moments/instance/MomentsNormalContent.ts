import { createMessageId, createMomentId } from "@newSdk/utils";
import { MediaType } from "../../../../ui/pages/Moments/constants/media";
import MomentsContent from "@newSdk/model/moments/instance/MomentsContent";
import MomentsType from "@newSdk/model/moments/instance/MomentsType";

export enum AuthType {
    All = 1,
    Contacts,
    Private,
    ShareWith,
    DontShare,
}

interface MediaItem {
    width?: number;
    height?: number;
    objectId?: string;
    bucketId?: string;
    mediaType?: string;
    format?: string;
    duration?: number;
    size?: number;
    posterObjectId?: string;
    posterFormat?: string;
}

interface AppletProps {
    aid: string;
    name: string;
    description: string;
    icon: any;
    logo: any;
    type: number;
}
interface MomentsProps {
    text?: string;
    media: MediaItem[];
    extra?: string[];
    type: MomentsType;
    authType: AuthType;
    authIds?: string[];
    isHours24?: 1 | 0;
    lat?: number;
    lon?: number;
    addr?: string;
    contentType: number;
    referPre?: string;
    appletInfo?: AppletProps;
}
export const b_video = 0x04;
export const b_image = 0x02;
export const b_text = 0x01;

export class MomentsNormalContent extends MomentsContent {
    text?: string;
    media?: MediaItem[];
    extra?: string[];
    auth_type: AuthType;
    auth_ids?: string[];
    is_hours24?: number;
    lat?: number;
    lon?: number;
    addr?: string;
    content_type: number;
    refer_pre?: string;
    applet_info?: AppletProps;
    constructor({
        text,
        media,
        type,
        extra,
        authType,
        authIds,
        isHours24,
        lat,
        lon,
        addr,
        referPre,
        appletInfo,
    }: MomentsProps) {
        super(type);
        this.text = text;
        // this.media = media;
        this.auth_type = authType;
        this.auth_ids = authIds;
        this.is_hours24 = isHours24;
        this.lat = lat;
        this.lon = lon;
        this.addr = addr;
        this.extra = extra;
        this.refer_pre = referPre;

        this.formatMediaList(media);
        this.formatAppletInfo(appletInfo);
        const item: any = (media || [])[0] || {};
        const hasImage = item.mediaType === MediaType.IMAGE;
        const hasVideo = item.mediaType === MediaType.VIDEO;

        this.content_type = ([!!text && b_text, hasImage && b_image, hasVideo && b_video].filter(
            Boolean
        ) as number[]).reduce((a, b) => a | b);
    }

    formatMediaList(media: MediaItem[] = []) {
        const correctKeys = [
            "width",
            "height",
            "objectId",
            "bucketId",
            "mediaType",
            "format",
            "duration",
            "size",
            "posterObjectId",
            "posterFormat",
            "posterBucketId", //22 5/31 Compatible mobile terminal
        ];

        this.media = media.map((item: any) => {
            Object.keys(item).forEach((key) => {
                if (!correctKeys.includes(key)) delete item[key];

                // 转毫秒
                if (key === "duration" && item[key]) item[key] = item[key] * 1000;
            });
            return item;
        });
    }

    formatAppletInfo(applet?: AppletProps) {
        if (!applet) return;
        const accessKey: (keyof AppletProps)[] = [
            "aid",
            "name",
            "icon",
            "description",
            "type",
            "logo",
        ];

        const ob: any = {};
        Object.entries(applet).forEach(([k, v]) => {
            if (accessKey.includes(k as any)) ob[k] = v;
        });

        this.applet_info = ob;
    }
}

export default MomentsNormalContent;
