import { miniAppAxios } from "@newSdk/service/apiCore/index";

const REQUEST_API = "/appletDetail";

type AwsObj = {
    bucketId: string;
    file_type: string;
    height: number;
    text: string;
    width: number;
};

export type AppInfo = {
    aid: string;
    type: number; // 1：games ；2 ：software
    cate_id: string;
    name: string;
    logo: AwsObj;
    icon: AwsObj;
    link_url: string;
    description: string;
    rank: number;
    screen_style: number; // 1: 竖屏 2： 横屏
};

export async function getAppInfo(ids: string[]): Promise<AppInfo[]> {
    try {
        const { data } = await miniAppAxios({
            url: REQUEST_API,
            method: "POST",
            data: { ids },
        });

        return data.items || [];
    } catch (e) {
        console.log(e);
        return [];
    }
}
