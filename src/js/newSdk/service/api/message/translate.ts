import axios from "@newSdk/service/apiCore/tmmCore";
import Message from "@newSdk/model/Message";
import { isSuccess } from "@newSdk/utils/server_util";
import { FormatDigest } from "../../../../ui/pages/Home/index";
export const TranslateCode = {
    Success: 0,
    NetworkError: 4444, // custom
    Fail: 200000,
    SourceLangUnSupport: 200001,
    TargetLangUnSupport: 200002,
};

interface ResponseItem {
    res: string;
    mid: string;
    items: {};
}
export const translate = async (mid: string, text: string) => {
    try {
        const res = await axios<ResponseItem>({
            url: "/translate",
            method: "post",
            data: {
                mid,
                text,
            },
        });

        if (isSuccess(res)) {
            console.log(res);

            Message.updateTranslate({
                mid: mid,
                text: res.data.items.res,
            });
            return { ...res.data.items, status: TranslateCode.Success };
        }

        return res.data;
    } catch (e) {
        return {
            status: TranslateCode.NetworkError,
        };
    }
};
export interface ResponseItemV2 {
    content: string;
    lang: string;
    mid: string;
    type: number;
    status: number;
}
export const translateV2 = async (mid: string, lang: string) => {
    try {
        const res = await axios<ResponseItemV2>({
            url: "/translateV2",
            method: "post",
            data: {
                mid,
                lang,
            },
        });

        if (isSuccess(res)) {
            console.log(res);

            Message.updateTranslateV2({
                mid: mid,
                items: res.data.items,
            });
            return { ...res.data.items, status: TranslateCode.Success };
        }

        return res.data;
    } catch (e) {
        return {
            status: TranslateCode.NetworkError,
        };
    }
};

export default translate;
