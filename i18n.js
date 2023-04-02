// const NextI18Next = require("next-i18next").default;

// const NextI18NextInstance = new NextI18Next({
//   defaultLanguage: "en",
//   otherLanguages: ["zh"],
//   // 路由配置
//   localeSubpaths: {
//     en: "en",
//     zh: "zh"
//   }
// });

// module.exports = NextI18NextInstance;

/* Optionally, export class methods as named exports */
const NextI18Next = require("next-i18next").default;

module.exports = new NextI18Next({
  browserLanguageDetection: false,
  serverLanguageDetection: false,
  defaultLanguage: "en",
  otherLanguages: ["zh"],
  localeSubpaths: {
    en: "en",
    // 禁用中文
    // zh: "zh",
  },
});
