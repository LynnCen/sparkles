export interface FriendReq {
    applyId: string;
    createTime: number;
    uid: string;
    status: number;
}

class FriendReqModel implements FriendReq {
    applyId: string;
    uid: string;
    createTime: number;
    status: number;
    user: any;
    constructor(applyId: string, uid: string, createTime: number, status: number = 0, user: any) {
        this.applyId = applyId;
        this.uid = uid;
        this.createTime = createTime;
        this.status = status;
        this.user = user;
    }
}

export default FriendReqModel;
