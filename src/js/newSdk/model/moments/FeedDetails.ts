import Dexie, { Table } from "dexie";
import { trimAndDropEmpty } from "@newSdk/utils";
import nc from "@newSdk/notification";
import moment from "moment";
import MomentsType from "@newSdk/model/moments/instance/MomentsType";

export interface FeedDetailProps {
    id: string;
    uid: string;
    text: string;
    isHours24: string;
    type: number;
    authType: number;
    media: any[];
    extra: { ids: string[] };
    status: number;
    contentType: number;
    createTime: number;
    updateTime: number;
    referRoot?: string;
    referPre?: string;

    referPres?: string[];
}

export interface ApiResponseProps {
    id: string;
    uid: string;
    text: string;
    is_hours24: string;
    type: number;
    auth_type: number;
    media: any[];
    status: number;
    extra: { ids: string[] };
    create_time: number;
    update_time: number;
    content_type: number;
    refer_root: string;
    refer_pre: string;
    refer_pres: string[];
}

enum Status {
    Delete = 0,
    Live = 1,
}

export interface ForwardFeedDetailProps extends FeedDetailProps {
    forwardRoot?: FeedDetailProps | null;
    isForward?: true;
    forwardPresInfo?: FeedDetailProps[] | null;
    breakOff?: boolean;
}

const DefaultTimeSlice = moment().day(3).valueOf();

class FeedDetailsModel {
    static authorize = false;
    private db?: Dexie;
    private userId?: string;
    private store?: Table<FeedDetailProps, string>;

    public Event = {
        MomentsChange: "moments_feed_details",
        MomentsForwardLinkBreak: "moments_forward_link_break",
    };
    public Tag = {
        Del: "delete",
    };

    init(db: Dexie) {
        this.db = db;
        this.userId = db.name;
        this.store = db.table("momentsDetailsModel");
        FeedDetailsModel.authorize = true;
    }

    bulkPutMoments(list: FeedDetailProps[], singleID?: string) {
        return this.store?.bulkPut(list).then((res) => {
            if (singleID) {
                return this.publish(list, singleID);
            }
            this.publish(list);
        });
    }
    updateMomentsDelStatues(ids: string[], status: number = 0) {
        this.store
            ?.where("id")
            .anyOf(ids)
            .toArray()
            .then((dataArr) => {
                if (!dataArr || !dataArr.length) return true;
                const newDataArr = dataArr.map((item) => {
                    return { ...item, status };
                });
                this.bulkPutMoments(newDataArr);
            });
    }

    async getMomentsByIds(ids: string[]) {
        try {
            return (await this.store?.where("id").anyOf(ids).toArray()) || [];
        } catch (e) {
            console.error(`error in getMomentsByIds`, e);
            return [];
        }
    }

    deleteMomentsById(id: string) {
        try {
            this.store?.update(id, { status: Status.Delete }).then(() => {
                this.publishDeleteNoc([{ id }]);
            });
        } catch (e) {
            console.error(`error in deleteMomentsById`, e);
        }
    }

    deleteBulk(ids: string[]) {
        try {
            return this.store?.where("id").anyOf(ids).delete();
        } catch (e) {
            console.error(`error in deleteBulk`, e);
            return;
        }
    }

    isForwardMoments(item: FeedDetailProps | ApiResponseProps | any) {
        if (item.referPres && item.referRoot && item.referPre) return true;
        if (item.refer_root && item.refer_pre && item.refer_pres) return true;
        return false;
    }
    isDeleted(item: FeedDetailProps) {
        // debugger;
        return item.status === Status.Delete;
    }
    filterVisibleMoments(item: FeedDetailProps) {
        return (
            !momentsDetailsModel.isDeleted(item) &&
            item.status !== Status.Delete &&
            item.type !== MomentsType.DELETE
        );
    }

    publishDeleteNoc(list: any[]) {
        this.publish(list, this.Tag.Del);
    }
    publish(list: string[] | FeedDetailProps[], tag?: string) {
        nc.publish(this.Event.MomentsChange, list, tag);
    }

    itemTransform({
        id,
        uid,
        text,
        is_hours24,
        type,
        auth_type,
        media,
        status,
        extra,
        create_time,
        update_time,
        content_type,
        refer_root,
        refer_pre,
        refer_pres,
        applet_info,
    }: any): FeedDetailProps {
        return trimAndDropEmpty({
            id,
            uid,
            text,
            media,
            isHours24: is_hours24,
            type,
            authType: auth_type,
            status,
            extra,
            createTime: create_time,
            updateTime: update_time,
            contentType: content_type,
            referRoot: refer_root,
            referPre: refer_pre,
            referPres: refer_pres,
            appletInfo: applet_info,
        }) as FeedDetailProps;
    }
}

export const momentsDetailsModel = new FeedDetailsModel();
export default momentsDetailsModel;
