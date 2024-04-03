const EN = require("../../locales/en.json");
const TR = require("../../locales/tr.json");
const ZH_CN = require("../../locales/zh-CN.json");
const ZH_TW = require("../../locales/zh-TW.json");
const ar = require("../../locales/ar.json");
const cs = require("../../locales/cs.json");
const da = require("../../locales/da.json");
const de = require("../../locales/de.json");
const es = require("../../locales/es.json");
const fi = require("../../locales/fi.json");
const fr = require("../../locales/fr.json");
const hu = require("../../locales/hu.json");
const id = require("../../locales/id.json");
const it = require("../../locales/it.json");
const ja = require("../../locales/ja.json");
const ko = require("../../locales/ko.json");
const ms = require("../../locales/ms.json");
const sw = require("../../locales/sw.json");

const CH = "zh-CN";
const CH_T = "zh-TW";
export const IntlConfig = [
    {
        name: "en",
        text: "English",
        packages: EN,
    },
    {
        name: "tr",
        text: "Türkçe",
        packages: TR,
    },
    {
        name: CH,
        text: "简体中文",
        packages: ZH_CN,
    },
    {
        name: CH_T,
        text: "繁體中文",
        packages: ZH_TW,
    },
    {
        name: "ar",
        text: "اللغةالعربية",
        packages: ar,
    },
    {
        name: "cs",
        text: "čeština",
        packages: cs,
    },
    {
        name: "da",
        text: "Dansk",
        packages: da,
    },
    {
        name: "de",
        text: "Deutsche",
        packages: de,
    },
    {
        name: "es",
        text: "Español",
        packages: es,
    },
    {
        name: "fi",
        text: "Suomi kieli",
        packages: fi,
    },
    {
        name: "fr",
        text: "Français",
        packages: fr,
    },
    {
        name: "hu",
        text: "Magyarország",
        packages: hu,
    },
    {
        name: "id",
        text: "Indic",
        packages: id,
    },
    {
        name: "it",
        text: "Italiano",
        packages: it,
    },
    {
        name: "ja",
        text: "⽇本語",
        packages: ja,
    },
    {
        name: "ko",
        text: "한국어",
        packages: ko,
    },
    {
        name: "ms",
        text: "Bahasa Melayu",
        packages: ms,
    },
    {
        name: "sw",
        text: "Kiswahili",
        packages: sw,
    },
];

export const pickerList = IntlConfig.map(({ name, text }) => ({ name, text }));
export const defaultLangPackage = TR;

export const ZHLangTy = [CH, CH_T];
