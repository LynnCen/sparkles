import axios from "@newSdk/service/apiCore/tmmNoTokenCore";

export interface ResponseData {
    url_pre: string;
    value: [];
    expire: null;
}

export default async function (): Promise<ResponseData | false> {
    try {
        const res = await axios({
            url: "/generateLoginQrCodeV2",
            method: "post",
            data: {},
        });

        return (res.data as ResponseData) || false;
    } catch (e) {
        console.log(e);
        return false;
    }
}
