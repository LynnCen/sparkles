// 不同项目需要自行引入的函数
import { getCss as _getCss } from '@/common/utils/get-css'; // '@/utils/get-css'
import { getScript as _getScript } from '@/common/utils/get-script'; // '@/utils/get-script'
// import { useContext } from 'react';
// import { MainAppContext } from '@/index';
import {
  getConfigCustomField as _getConfigCustomField,
  postConfigCustomField as _postConfigCustomField,
  areaList as _areaList,
} from '@/common/api/common';
import {
  changeProvinceCityDistrict as _changeProvinceCityDistrict,
  changeProvincesCities as _changeProvincesCities,
} from '@/store/common';
import { get as _get, post as _post } from '@/common/request';
export const changeProvinceCityDistrict = _changeProvinceCityDistrict;
export const changeProvincesCities = _changeProvincesCities;
export const getConfigCustomField = _getConfigCustomField;
export const postConfigCustomField = _postConfigCustomField;
export const areaList = _areaList;
export const get = _get;
export const post = _post;
// 基础配置
export const isMicro = false; // 是否是微应用
export const getCss = _getCss;
export const getScript = _getScript;

export const useDocument = () => { // 根节点
  return document;
  // 微应用用法
  // const { container } = useContext(MainAppContext);
  // return container || document;
};

export const usePopContainer = () => { // 弹层根节点(微应用中需要对pop层进行收拢至 #popContainer，而普通项目不需要)
  return undefined;
  // 微应用用法
  // const { container } = useContext(MainAppContext);
  // return (container || document)?.querySelector('#popContainer');
};

/* ant-className 前缀配置 */
export const antPrefix = 'ant';

/* 一些公用的格式后缀判断 */
export const typeMap = {
  'png,jpg,gif,jpeg,bmp': 'pc-common-icon-file_icon_picture', // 图片
  'text': 'pc-common-icon-file_icon_txt', // 文本
  'xls,xlsx': 'pc-common-icon-file_icon_excel', // excel
  'doc,docx': 'pc-common-icon-file_icon_word', // word文档
  'pdf': 'pc-common-icon-file_icon_pdf', // pdf
  'ppt,pptx': 'pc-common-icon-file_icon_ppt', // ppt
  'rar,zip,7z': 'pc-common-icon-file_icon_zip', // 压缩包
  'mp4,m2v,mkv,rmvb,wmv,avi,flv,mov,m4v': 'pc-common-icon-file_icon_video', // 视频
  'mp3,wav': 'pc-common-icon-file_icon_music', // 音频
};
export const officeView = ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx']; // 需要用微软的预览软件
export const pdfView = ['pdf'];
export const imageTypes = ['png', 'jpg', 'gif', 'jpeg', 'bmp'];
export const videoTypes = ['mp4', '3gp', 'm3u8', 'mov']; // videojs只支持这几个格式,其他可能会黑屏
export const specialDownloadTypes = ['dwg'];

/* V2Table 配置 */
export const pageConfig = {
  pageKey: 'page',
  pageSizeKey: 'size',
};

export const emptyRenderDefault = false;

/* V2FormUpload 配置 */
// 从location-manage拷过来的
export const qiniuTokenUrl = '/qiniu/getToken';
export const qiniuTokenExtraConfig = {
  needCancel: false
};
/* 七牛配置相关的枚举参数 */

// 七牛文件夹名称
// 部分bucket不支持 '?imageView2/2/w/100/h/100/q/100/format/jpg'，对不不支持的请使用下面 UrlSuffix 提供的后缀（一般使用水印或缩略图后缀）
export enum Bucket {
  /* 中台组的bucket */
  Default = 'middlestage', // 默认使用的bucket https://milddlefile.linhuiba.com

  /*
   * 邻汇吧组的bucket
  */
  // Default = 'linhuiba-temp', // 默认使用的bucket
  // Fields = 'linhui-fields', // 场地相关文件
  // Banners = 'linhuiba-banners', // 内容文件
  // Certs = 'linhuiba-certs', // 证件文件
  // File = 'linhuiba-file', // excel、pdf等文件专用
  // Temp = 'linhuiba-temp', // 临时文件
  // Video = 'linhuiba-video', // 视频文件

  /*
   * location组的bucket
  */
  // Default = 'location-temp', // 默认使用的bucket
  // Fields = 'location-images', // 场地相关文件 不支持 https://images.location.pub/FkvNNdXpKT2uySYW052UpzPNvN0i-location_original
  // Cases = 'location-cases', // 案例文件 不支持 https://cases.location.pub/FkvNNdXpKT2uySYW052UpzPNvN0i-location_wk
  // Certs = 'location-certs', // 证件文件 支持 https://certs.location.pub/FkvNNdXpKT2uySYW052UpzPNvN0i?imageView2/2/w/100/h/100/q/100/format/jpg
  // File = 'location-files', // excel、pdf等文件专用 支持 https://files.location.pub/FkvNNdXpKT2uySYW052UpzPNvN0i?imageView2/2/w/100/h/100/q/100/format/jpg
  // Temp = 'location-temp', // 临时文件 支持 https://temps.location.pub/FkvNNdXpKT2uySYW052UpzPNvN0i?imageView2/2/w/100/h/100/q/100/format/jpg
  // Video = 'location-videos', // 视频文件 支持 https://videos.location.pub/FkvNNdXpKT2uySYW052UpzPNvN0i?imageView2/2/w/100/h/100/q/100/format/jpg
}

// 地址后缀相关
// 除了原图，其他后缀的图片都是按照一定比例截取的，这个在七牛平台进行配置了
export enum UrlSuffix {
  /*
   * 中台组的 suffix
  */
  Ori = '-middlestage_original', // 原图
  Thn = '-middlestage_thn', // 缩略图

  /*
   * 邻汇吧组的 suffix (location也在用)
  */
  // Ori = '-linhuibaoriginal.jpg', // 原图
  // Wk = '-linhuiba_watermark', // 水印

  /*
   * location私有的 suffix
  */
  // Half = '-location_half', // 中间半张图
  // location原图：-location_original
  // Thn = '-location_thn', // 缩略图
  // location水印：-location_wk

}

// 七牛文件夹映射的上传地址
export const bucketMappingDomain = {
  /*
   * 中台组的domain
  */
  'middlestage': 'https://middle-file.linhuiba.com/',

  /*
   * 邻汇吧组的domain
  */
  'linhui-fields': 'https://img.linhuiba.com/', //  场地相关文件
  'linhuiba-banners': 'https://banner.linhuiba.com/', //  内容文件
  'linhuiba-certs': 'https://cert.linhuiba.com/', //  证件文件
  'linhuiba-file': 'https://file.linhuiba.com/', //  excel、pdf等文件专用
  'linhuiba-temp': 'https://temp.linhuiba.com/', //  临时文件
  'linhuiba-video': 'https://videos.linhuiba.com/', //  视频文件

  /*
   * location的domain
  */
  'location-images': 'https://images.location.pub/', // 场地相关文件
  'location-cases': 'https://cases.location.pub/', // 案例文件
  'location-certs': 'https://certs.location.pub/', // 证件文件
  'location-files': 'https://files.location.pub/', // excel、pdf等文件专用
  'location-temp': 'https://temps.location.pub/', // 临时文件
  'location-videos': 'https://videos.location.pub/', // 视频文件
};

// 七牛文件夹映射的上传域名 https://developer.qiniu.com/kodo/manual/1671/region-endpoint
export const bucketMappingActionUrl: any = {
  /*
   * 中台组组的 的 qiniu地址
  */
  'middlestage': '//up-z2.qiniup.com/',

  /*
   * 邻汇吧组的 的 qiniu地址
  */
  'linhui-fields': '//upload.qiniup.com/', //  场地相关文件
  'linhuiba-banners': '//upload.qiniup.com/', //  内容文件
  'linhuiba-certs': '//upload.qiniup.com/', //  证件文件
  'linhuiba-crm': '//upload.qiniup.com/', //  crm相关文件
  // 华南：客户端上传：http(s)://upload-z2.qiniup.com
  'linhuiba-file': '//upload-z2.qiniup.com/', //  excel、pdf等文件专用
  'linhuiba-temp': '//upload-z2.qiniup.com/', //  临时文件
  'linhuiba-video': '//upload-z2.qiniup.com/', //  视频文件

  /*
   * location 的 qiniu地址
  */
  'location-images': '//upload-z2.qiniup.com/', // 场地相关文件
  'location-cases': '//up-z2.qiniup.com/', // 案例文件
  'location-certs': '//up-z2.qiniup.com/', // 证件文件
  'location-files': '//up-z2.qiniup.com/', // excel、pdf等文件专用
  'location-temp': '//up-z2.qiniup.com/', // 临时文件
  'location-videos': '//up-z2.qiniup.com/', // 视频文件
};

/* Fuzzy配置 */
export function blurFloat(props: any = {}) {
  return props?.mode === 'multiple' || props?.mode === 'tags';
};


/**
 * @description 图表相关配置
 */
// 主题的rgb颜色
export const themeColor = {
  blue: ['#358AFF', '#39D3F9', '#FFA140', '#5366F6', '#80D6EB', '#FFEB58', '#A896EF'],
  blueRGB: [
    '53,138,255',
    '57,211,249',
    '255,161,64',
    '83,102,246',
    '128,214,235',
    '252,231,78',
    '168,150,239',
  ],
  blueGradient: ['#AED0FF', '#96C2FF', '#7EB4FF', '#65A6FF', '#4E98FF', '#358AFF'], // 漏斗图中的渐变主题色
  green: ['#0BB8AF', '#7BD2DE', '#FFD190', '#86CCFF', '#9FDEF4', '#FFBA96', '#FF8A8A'],
  greenRGB: [
    '11,184,175',
    '123,210,222',
    '255,209,144',
    '134,204,255',
    '159,222,244',
    '255,186,150',
    '255,138,138',
  ],
  greenGradient: ['#9DE3DF', '#80DAD5', '#63D2CC', '#45C9C2', '#29C1B9', '#0BB8AF'], // 漏斗图中的渐变主题色
  purple: ['#7087E4', '#C096E0', '#F3D296', '#F99090', '#BFC7FC', '#9298E9', '#FDB791'],
  purpleRGB: [
    '112,135,228',
    '192,150,224',
    '243,210,150',
    '249,144,144',
    '191,199,252',
    '146,152,233',
    '253,183,145',
  ],
  purpleGradient: ['#D3D6F6', '#C6C9F3', '#B9BDF1', '#ACB1EE', '#9FA5EC', '#9298E9'], // 漏斗图中的渐变主题色
};

// 当npm run serve 不带环境时，NODE_TYPE为local
// 高德key
export const aMapKey = process.env.NODE_TYPE === 'local' || process.env.NODE_TYPE === 'ie' || process.env.NODE_TYPE === 'te' ? 'b90b315cb4d29262297ba38a93e1817c' : '84227edbd128395e7f29f6f8843e4dbb';
