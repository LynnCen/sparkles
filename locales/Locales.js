const ar = require("./ar.json");
const cs = require("./cs.json");
const da = require("./da.json");
const de = require("./de.json");
const en = require("./en.json");
const es = require("./es.json");
const fi = require("./fi.json");
const fr = require("./fr.json");
const hu = require("./hu.json");
const id = require("./id.json");
const it = require("./it.json");
const ja = require("./ja.json");
const ko = require("./ko.json");
const ms = require("./ms.json");
const sw = require("./sw.json");
const tr = require("./tr.json");
const zhCN = require("./zh-CN.json");
const zhTW = require("./zh-TW.json");

const localeMap = {
    ar,
    cs,
    da,
    de,
    en,
    es,
    fi,
    fr,
    hu,
    id,
    it,
    ja,
    ko,
    ms,
    sw,
    tr,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
};
const supportLocaleKeys = Object.keys(localeMap);

module.exports = {
    localeMap,
    supportLocaleKeys,
};
