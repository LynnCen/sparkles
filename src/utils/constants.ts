export const CODE_OK: number = 200; // 成功
export const INVALID_TOKEN: number = 401; // 非法 token 超时
export const INVALID_PARAM: number = 100003; // 参数不正确

export const LangLi = [
  "global",
  "ar",
  "bn",
  "cn",
  "zh-Hant",
  "cs",
  "da",
  "nl",
  "en",
  "fil",
  "fi",
  "fr",
  "de",
  "el",
  "hu",
  "is",
  "id",
  "it",
  "ja",
  "ko",
  "sk",
  "sl",
  "es",
  "sw",
  "sv",
  "th",
  "tr",
  "uk",
  "vi",
  "lt",
  "ms",
  "nb",
  "pl",
  "ro",
  "ru",
  "pt"
]

let baseurl = '/api';
let uploadurl = '/upload'; // 图片上传地址 开发环境走了转发 生产需改
const uploadHeader = () => {
  return {
    // 上传头像请求头
    lang: 'zh',
    token: localStorage.getItem('token'),
  };
};

if (!process.env.local && process.env.APP_ENV === 'development') {
  // 测试服
  baseurl = 'http://148.70.15.154:7002/admin';
  uploadurl = 'http://148.70.15.154:7002/admin/upload.json';
}
if (process.env.APP_ENV === 'production') {
  // 正式服需要解除注释;
  baseurl = 'https://admin.tmmtmm.com.tr/api/';
  uploadurl = 'https://adminapi.speedyhelp.org/upload.json';
}
console.log(process.env.NODE_ENV === 'production', process.env.APP_ENV, process.env.local);
// console.log('server uri', baseurl, uploadurl, process.env);

export const baseURL = process.env.NODE_ENV === 'production' ? baseurl : baseurl;
export const uploadURL = uploadurl;
export const uploadHEADER = uploadHeader;

// 语言配置
export const langMap = {
  'zh-CN': 'zh',
  'en-US': 'en',
};

//   export const AccessPageMap = {
//     // 权限页面map
//     '/home': 'index',
//     '/helpInfo': 'help',
//     '/InformMannagement': 'message',
//     '/VolunteerApplication': 'volunteer',
//     '/UserManagement': 'user',
//     '/SystemSettings': ['commonmsg', 'setting', 'staff', 'role'],
//     '/SystemSettings/SystemConfig': 'commonmsg',
//     '/SystemSettings/BasicConfig': 'setting',
//     '/SystemSettings/AccountManagement': 'staff',
//     '/SystemSettings/RoleManagement': 'role',
//     '/OperationLog': 'log',
//     '/NewsManagement': 'news',
//   };

// 默认请求分页数据
export const INIT_PAGINATION = {
  pageNo: 1,
  pageSize: 10,
};

export const DATE_FORMAT = 'YYYY-MM-DD'; // 时间格式

export const HAS_ABOARD = navigator.language === 'zh-CN'; // 判断在国内还是国外
