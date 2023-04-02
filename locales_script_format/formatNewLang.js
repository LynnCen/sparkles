/**
 * use node
 *
 * step：
 * 1. copy source dirs to "formattedLang"
 * 2. set current transform ignore lang with line:22 "exclude" array
 * 3. node run
 */

// const source = require("./formTemp.json");
const fs = require("fs");
const targetDir = "../locales";
const { supportLocaleKeys } = require("../locales/Locales");
const srcFileName = "formTemp.json";
// zh-CN zh-TW follow server
const targetKeys = supportLocaleKeys.map((item) => {
    if (item === "zh-CN") return "zh-Hans";
    if (item === "zh-TW") return "zh-Hant";
    return item;
});

// todo: set this var to exclude lang
const exclude = ["tr", "en", "zh-Hans"];
// const exclude = ["en"];
void (function f() {
    targetKeys.map(async (lang) => {
        if (!exclude.includes(lang)) {
            // target source
            const json = require(`./formattedLang/${lang}/${srcFileName}`);

            let localLang = lang;
            if (lang === "zh-Hans") localLang = "zh-CN";
            if (lang === "zh-Hant") localLang = "zh-TW";

            // current source
            const old = require(`${targetDir}/${localLang}.json`) || {};

            Object.entries(json).forEach(([k, v]) => {
                old[k] = v;
            });

            fs.writeFile(
                `${targetDir}/${localLang}.json`,
                JSON.stringify(old, null, 4),
                "utf-8",
                () => {}
            );
        }
    });
})();
