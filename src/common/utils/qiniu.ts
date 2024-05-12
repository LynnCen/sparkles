import { UrlSuffix } from '@/common/enums/qiniu';

export const QiniuImageUrl = (url: string) => {
  if (url && url.includes('img.linhuiba.com/')) {
    return url + UrlSuffix.Wk;
  } else if (url && url.includes('pmsimage.location.pub/')) {
    return url + UrlSuffix.PmsLarge;
  } else if (url && url.includes('images.location.pub')) { // 来自 location 的图片
    return url + UrlSuffix.locationWx;
  } else {
    return url;
  }
};

/**
 * @description: 根据七牛文件的 url，获取原图后缀
 * @param {*} url
 * @return {*}
 */
export function getQiniuFileOriSuffix(url) {
  if (!url) {
    return '';
  }
  if (url.includes('middle-file.linhuiba.com')) {
    return '';
  } else if (url.includes('img.linhuiba.com')) {
    return UrlSuffix.Ori;
  } else if (url.includes('pmsimage.location.pub')) { // 来自 pms 的图片
    return UrlSuffix.PmsOri;
  } else if (url.includes('images.location.pub')) { // 来自 location 的图片
    return UrlSuffix.locationOri;
  } else {
    return '';
  }
}

/**
 * @description: 根据七牛文件的 url，获取原图链接
 * @param {*} url
 * @return {*}
 */
export function getQiniuFileOriUrl(url) {
  if (!url) {
    return '';
  }
  // 预处理掉链接本身的后缀
  url = url.replace(new RegExp(Object.values(UrlSuffix).join('|'), 'g'), '');
  return url + getQiniuFileOriSuffix(url);
}

/**
 * @description: 根据七牛文件的 url，获取预览后缀
 * @param {*} url
 * @return {*}
 */
export function getQiniuFilePreviewSuffix(url) {
  if (!url) {
    return '';
  }
  if (url.includes('middle-file.linhuiba.com')) {
    return '';
  } else if (url.includes('img.linhuiba.com')) { // 来自 邻汇吧场地 的图片
    return UrlSuffix.Wk;
  } else if (url.includes('pmsimage.location.pub')) { // 来自 pms 的图片
    return UrlSuffix.PmsLarge;
  } else if (url.includes('images.location.pub')) { // 来自 location 的图片
    return UrlSuffix.locationWx;
  } else {
    return '';
  }
}

/**
 * @description: 根据七牛文件的 url，获取预览链接
 * @param {*} url
 * @return {*}
 */
export function getQiniuFilePreviewUrl(url) {
  if (!url) {
    return '';
  }

  // 预处理掉链接本身的后缀
  url = url.replace(new RegExp(Object.values(UrlSuffix).join('|'), 'g'), '');
  return url + getQiniuFilePreviewSuffix(url);
}

