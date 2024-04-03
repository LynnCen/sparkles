import { createMomentId } from "@newSdk/utils";
import tmmUserInfo from "@newSdk/model/UserInfo";
import MessageType from "@newSdk/model/MessageType";
import MomentsType from "@newSdk/model/moments/instance/MomentsType";
import FeedDetails from "@newSdk/model/moments/FeedDetails";
import MomentsContent from "@newSdk/model/moments/instance/MomentsContent";

export class MomentsDeleteContent extends MomentsContent {
    extra: any;

    constructor(deleteId: string) {
        super(MomentsType.DELETE);
        this.extra = {
            ids: [deleteId],
        };
    }
}

export default MomentsDeleteContent;
