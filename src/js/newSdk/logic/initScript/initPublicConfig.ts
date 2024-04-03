import initIntlTemplate from "@newSdk/service/api/getNoticeSettings";
import intlModel from "@newSdk/model/public/IntlTemplate";

export const initPublicConfig = async () => {
    const intl = await initIntlTemplate();
    if (intl) {
        await intlModel.bulkPutData(intl);
    }
};
export default initPublicConfig;
