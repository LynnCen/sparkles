import { IMember } from "./Members";
import { Avatar } from "@newSdk/model/types";

export interface UserInfoProps {
    _id: string;
    loading: number;
    phone_prefix?: string;
    [attr: string]: any;
}

interface M {
    setUserInfo: (info: UserInfoProps) => void;
    syncBaseInfo: (info: IMember) => void;
}

type otherInfos = {
    unreadCount: number;
};

export const InitLoadingStatus = {
    UNKNOWN: -1,
    LOADED: 0,
    LOADING: 1,
    LOADING_FAIL: 2,
    DONE: 3,
};

class UserInfo implements UserInfoProps, M, otherInfos {
    public _id: string = "";
    public code?: string = "";
    public loading: number = InitLoadingStatus.UNKNOWN;
    public phone_prefix?: string;
    public unreadCount: number = 0;
    public logined: boolean = false;

    public setUserInfo(userInfo: Partial<UserInfoProps>) {
        const self = this;
        self.logined = true;
        Object.entries(userInfo).forEach(([k, v]: [UserInfoProps["key"], any]) => {
            if (k === "avatar") (self as any)["avatarLink"] = v;
            else (self as any)[k] = v;
        });
        // );
    }

    public syncBaseInfo(info: IMember) {
        const self = this;
        Object.entries(info).forEach(([k, v]) => ((self as any)[k] = v));
    }

    resetUserInfo() {
        const existKeys: any[] = Object.keys(tmmUserInfo);

        existKeys.forEach((key: string) => delete (tmmUserInfo as any)[key]);

        const initState = {
            _id: "",
            code: "",
            loading: InitLoadingStatus.UNKNOWN,
            phone_prefix: "",
            unreadCount: 0,
            logined: false,
        };

        tmmUserInfo.setUserInfo(initState);
    }
}

export const tmmUserInfo = new UserInfo();

export default tmmUserInfo;
