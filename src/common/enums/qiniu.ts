// 从location-manage拷过来的
/* 七牛配置相关的枚举参数 */

// 七牛文件夹名称
// 部分bucket不支持 '?imageView2/2/w/100/h/100/q/100/format/jpg'，对不不支持的请使用下面 UrlSuffix 提供的后缀（一般使用水印或缩略图后缀）
export enum Bucket {
  Default = 'linhuiba-temp', // 默认使用的bucket
  Fields = 'linhui-fields', // 场地相关文件
  Banners = 'linhuiba-banners', // 内容文件
  Certs = 'linhuiba-certs', // 证件文件
  File = 'linhuiba-file', // excel、pdf等文件专用
  Temp = 'linhuiba-temp', // 临时文件
  Video = 'linhuiba-video', // 视频文件
  Middlestage = 'middlestage', // 中台


  // location 的 bucket
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
  Ori = '-linhuibaoriginal.jpg', // 原图
  Wk = '-linhuiba_watermark', // 水印
  // Half = '-location_half', // 中间半张图
  // location原图：-location_original
  // Thn = '-location_thn', // 缩略图
  // location水印：-location_wk
  locationOri = '-location_original', // location 原图
  locationWx = '-location_wk', // location 水印
  PmsOri = '-pms_original',
  PmsSmall = '-pms_thn',
  PmsMiddle = '-pms_half',
  PmsLarge = '-pms_wk'
}

// 七牛文件夹映射的上传地址
export const bucketMappingDomain = {
  'linhui-fields': 'https://img.linhuiba.com/', //  场地相关文件
  'linhuiba-banners': 'https://banner.linhuiba.com/', //  内容文件
  'linhuiba-certs': 'https://cert.linhuiba.com/', //  证件文件
  'linhuiba-file': 'https://file.linhuiba.com/', //  excel、pdf等文件专用
  'linhuiba-temp': 'https://temp.linhuiba.com/', //  临时文件
  'linhuiba-video': 'https://videos.linhuiba.com/', //  视频文件

  // location 的 bucket
  'location-images': 'https://images.location.pub/', // 场地相关文件
  'location-cases': 'https://cases.location.pub/', // 案例文件
  'location-certs': 'https://certs.location.pub/', // 证件文件
  'location-files': 'https://files.location.pub/', // excel、pdf等文件专用
  'location-temp': 'https://temps.location.pub/', // 临时文件
  'location-videos': 'https://videos.location.pub/', // 视频文件

  // pms的bucket名目前未用到，如需用到请再确认下方key是否正确
  'pms-image': 'https://pmsimage.location.pub/',
  // 'pms-video': 'https://videos.location.pub/',
  // 'pms-cert': 'https://certs.location.pub/',
  // 'pms-temp': 'https://temps.location.pub/',
  // 'pms-file': 'https://files.location.pub/',
  // 'pms-case': 'https://cases.location.pub/'

  'middlestage': 'https://middle-file.linhuiba.com/', // 中台
};

// 七牛文件夹映射的上传域名 https://developer.qiniu.com/kodo/manual/1671/region-endpoint
export const bucketMappingActionUrl: any = {
  'linhui-fields': '//upload.qiniup.com/', //  场地相关文件
  'linhuiba-banners': '//upload.qiniup.com/', //  内容文件
  'linhuiba-certs': '//upload.qiniup.com/', //  证件文件
  'linhuiba-crm': '//upload.qiniup.com/', //  crm相关文件
  // 华南：客户端上传：http(s)://upload-z2.qiniup.com
  'linhuiba-file': '//upload-z2.qiniup.com/', //  excel、pdf等文件专用
  'linhuiba-temp': '//upload-z2.qiniup.com/', //  临时文件
  'linhuiba-video': '//upload-z2.qiniup.com/', //  视频文件

  // location 的 bucket
  'location-images': '//upload-z2.qiniup.com/', // 场地相关文件
  'location-cases': '//up-z2.qiniup.com/', // 案例文件
  'location-certs': '//up-z2.qiniup.com/', // 证件文件
  'location-files': '//up-z2.qiniup.com/', // excel、pdf等文件专用
  'location-temp': '//up-z2.qiniup.com/', // 临时文件
  'location-videos': '//up-z2.qiniup.com/', // 视频文件

  'middlestage': '//up-z2.qiniup.com/', // 中台

};

// 上传时需要指定的七牛参数
// export interface QiniuParams {
//   domain: string;
//   bucket: string;
//   [p: string]: any;
// }
