import region_tr from "@newSdk/consts/region_tr";
import region_cn from "@newSdk/consts/region_cn";
import region_en from "@newSdk/consts/region_en";
import region_cntw from "@newSdk/consts/region_cntw";

export default function (local, region_id) {
    if (!local || !region_id) return "";

    let region = "";
    let currentPrefix = "";

    switch (local) {
        case "zh-TW":
            region = region_cntw;
            currentPrefix = "zh-Hant";
            break;
        case "zh-CN":
            region = region_cn;
            currentPrefix = "cn";
            break;
        case "tr":
            region = region_tr;
            currentPrefix = "tr";
            break;
        case "en":
            region = region_en;
            currentPrefix = "en";
            break;
        default:
            region = region_en;
            currentPrefix = "en";
    }
    const regionID = region_id.replace(/([^_]*)/, currentPrefix);
    const parents = region[regionID] ? region[regionID].pids : [];
    let regionArr = [...parents, regionID].map((reg) => (region[reg] ? region[reg].name : ""));
    return regionArr.join("/");
}
