import { removeCookie, removeStorage } from '@lhb/cache';
import { beautifyThePrice, isArray, isNotEmpty } from '@lhb/func';
import dayjs from 'dayjs';
import { Bucket, UrlSuffix, bucketMappingActionUrl, bucketMappingDomain } from '@/common/enums/qiniu';
import axios from 'axios';

/**
 * [遍历]
 * @param  {Object | Array<any>} targe [组件]
 * @param  {Function} cb [回调函数]
 */
export function each(targe: Record<string, any> | any[], cb: Function) {
  if (Object.prototype.toString.call(targe) === '[object Array]') {
    targe.forEach((item: any, index: any) => {
      cb(item, index);
    });
  } else {
    Object.keys(targe).forEach((key: string, index: number) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      cb(targe[key], key, index);
    });
  }
}

/**
 * [首字母大写]
 * @param  {Object | Array<any>} targe [组件]
 * @param  {Function} cb [回调函数]
 */
export function to(targe: Record<string, any> | any[], cb: Function) {
  if (Object.prototype.toString.call(targe) === '[object Array]') {
    targe.forEach((item: any, index: any) => {
      cb(item, index);
    });
  } else {
    Object.keys(targe).forEach((key: string, index: number) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      cb(targe[key], key, index);
    });
  }
}

/*
 * @param value 取整的值
 * @param exp 取整的倍数,例如:1 就是向上取整到 10
 */
export function decimalAdjust(value: any, exp: number) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math.ceil(value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math.ceil(+`${value[0]}e${value[1] ? +value[1] - exp : -exp}`);
  // Shift back
  value = value.toString().split('e');
  return +`${value[0]}e${value[1] ? +value[1] + exp : exp}`;
}

/**
 * 退出登录
 */
export function logout() {
  removeCookie('flow_token');
  removeStorage('flowLoginToken');
  removeCookie('flow_account_id');
  setTimeout(() => {
    // TODO:企业微信退出登录的时候保留corpId参数
    window.location.reload();
  }, 100);
}

/**
 *
 * @param dataSource // 需要遍历的数组
 * @param rowKeys // 数组中节点的key
 * @param rowKey // 组成key的字段
 * @param childrenColumnName
 * @param needAllKeys // 是否需要获取全部的key-默认为false
 * @returns rowKeys // 数组中节点的key
 */

export function getKeys(
  dataSource: any[],
  rowKeys: any[],
  rowKey: string,
  childrenColumnName = 'children',
  needAllKeys = false
) {
  for (let i = 0; i < dataSource.length; i++) {
    const item = dataSource[i];
    if (item[childrenColumnName] && item[childrenColumnName].length) {
      // 不可选的选项不获取key
      !item.disabled && rowKeys.push(item[rowKey]);
      getKeys(item[childrenColumnName], rowKeys, rowKey, childrenColumnName, needAllKeys);
    } else {
      needAllKeys && !item.disabled && rowKeys.push(item[rowKey]);
    }
  }
  return rowKeys;
}

/**
 * @description: 下载/预览文件
 * @param {type} name 文件名
 * @param {type} url 文件路径
 * @param {type} preview 是否预览，默认直接下载：true 预览，false 直接下载
 * @param {type} downloadUrl 文件下载路径，不传则取自 url
 * @param {type} anyFileExt 是否任何文件都可以被预览，默认true（主要是针对没有文件名的七牛图片）
 * 如果预览文件类型可能有多种情况（可能是 jpg 可能是 excel），需求传入 name 并且设置 anyFileExt = false，根据文件后缀判断文件类型能否被预览
 * @return:
 */
export function downloadFile({ name = '', url }: { name?: string; url: string }) {
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', name);
  link.setAttribute('target', '_blank');
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * 接口返回的日期格式转换为前端显示的日期格式 2020-12-12 -> 2020.12.12
 */
export function dateFormatShow(date: string) {
  if (!date || typeof date !== 'string') return;
  return date.replace(/-/gi, '.');
}

/**
 *  一组可选的月份月份，找出其中不连续的两个月份，组成一个新的数组，用于dataPicker动态设置disabledDate
 * @param list 月份数组 string[]
 * @returns{start:string,end:string}[]
 * @example
 * continuousDateMonth(['2022-07', '2022-05', '2022-04', '2022-03', '2022-01'])
 * start/end同时存在则大于start小于end的时间段不可选，只有start是大于start，只有end是小于end
 * => [ {start:'2022-05',end:'2022-07'}, {start:'2022-01',end:'2022-03'}, {start:'2022-07',end:''}, {start:'',end:'2022-01'} ]
 */

export const continuousDateMonth = (list: string[]) => {
  if (!list.length) return [];
  if (list.length === 1) return [{ end: list[0], start: list[0] }];
  const disabledList: any[] = [];
  for (let i = 0, len = list.length - 1; i < len; i++) {
    const item = list[i];
    const prevItem = list[i + 1];
    if (dayjs(prevItem).add('1', 'month').format('YYYY-MM') !== dayjs(item).format('YYYY-MM')) {
      disabledList.push({ end: item, start: prevItem });
    }
  }
  disabledList.push({ start: list[0], end: '' }, { end: list[list.length - 1], start: '' });
  return disabledList;
};

// 图表类数据转换(普通图表)
/**
 *
 * @param data 数组
 * @param optionKey 横坐标key
 * @param optionVal Y坐标的key
 * @param optionValTwo 第二条Y轴的key 默认不传,如果传入会多返回一个y2的数组
 * @returns {x,y}
 */
export function dataConvertToEchartsData(
  data: Array<any>,
  optionKey = 'name',
  optionVal = 'value',
  optionValTwo?: string
) {
  if (!(Array.isArray(data) && data.length)) return {};
  const x: Array<any> = []; // x轴数据
  const y: Array<any> = []; // y轴数据
  const y2: Array<any> = []; // y轴数据
  data.forEach((item: any) => {
    x.push(item[optionKey]);
    y.push(item[optionVal]);
    optionValTwo && y2.push(item[optionValTwo]);
  });
  return {
    x,
    y,
    ...(optionValTwo && { y2: y2 }),
  };
}

/**
 *
 * @param list 一组数字数组
 * @returns 最大值
 */
export const getMaxData = (list: number[]) => {
  if (!list || !list.length) return 0;
  const data = list.slice();
  const max = data.reduce((sum, cur) => {
    return Number(sum) > Number(cur) ? sum : cur;
  }, data[0]);
  return decimalAdjust(max, 1);
};

/**
 *
 * @param ids 门店id数组
 * @param list 列表
 * @return 存在于列表中的id数组
 */
export const idsInStoreds = (ids: number[], list: any[]) => {
  const newIds: number[] = [];
  if (Array.isArray(ids) && ids.length) {
    for (let i = 0, len = ids.length; i < len; i++) {
      const item = ids[i];
      if (list.find((store) => store.id === item)) {
        newIds.push(item);
      }
    }
  }
  return newIds;
};

/**
 *
 * @param value 值
 * @returns 值如果为空则显示-
 */


export const valueFormat = (word: any, unit?: any) => {
  if (!isNotEmpty(word)) return '-';
  if (unit) return word + unit;
  return word;
};

/**
 * @param {Object} obj  要删除属性的目标对象
 * @param {Boolean} isRecursion  是否处于递归状态
 * 删除对象的属性值为null或undefined或者''的属性，无论嵌套多深，适用请求接口时的传参的过滤
 */
export function delObjEmptyProVal(obj: any, isRecursion = false) {
  let result;
  if (isRecursion) {
    result = obj;
  } else {
    result = JSON.parse(JSON.stringify(obj));
  }
  // eslint-disable-next-line guard-for-in
  for (const item in result) {
    const val = result[item]; // 值
    if (val === null || val === undefined || val === '') {
      Reflect.deleteProperty(result, item);
    } else if (Object.prototype.toString.call(obj) === 'Object') {
      delObjEmptyProVal(val, true);
    }
  }
  return result;
}

/**
 *
 * @param status 审批状态-对应的数字
 * @returns 审批状态对应的颜色className
 */

export function approvalStatusClass(status: number | null) {
  let colorClass = '';
  // 0：待提交、1：审批中、2：已驳回、3：以通过、4：不通过
  switch (status) {
    case 0:
      colorClass = 'c-ff8';
      break;
    case 1:
      colorClass = 'c-002';
      break;
    case 2:
      colorClass = 'c-f23';
      break;
    case 3:
      colorClass = 'c-009';
      break;
    default:
      colorClass = 'c-959';
  }
  return colorClass;
}

/**
 *
 * @param list 菜单列表
 * @param key 目标key
 * @returns 目标元素
 */
export const arrayTarget = (list: any[], key: string) => {
  const target = list.find((item) => item.uri === key);
  if (target) return target;
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i];
    if (Array.isArray(item.children)) {
      const res = arrayTarget(item.children, key);
      if (res) return res;
    }
  }
};

// echarts中坐标轴单位：以最小值为单位
export function echartsFormatUnit(data: Array<number>) {
  // data | Array
  const minVal = Math.min.apply(null, data); // 最小值
  const unit = 10000;
  if (minVal / unit >= 1) {
    // 以万为单位
    return {
      name: 'w',
      value: 10000,
    };
  } else {
    return {
      name: '',
      value: 1,
    };
  }
}

/*
 * 用来把接口返回的选项数据，name，id转为 label value
 * 我们的接口爱用 name id，antd默认 label，value。 甚至radio这种都不允许改key，贼烦，故有此方法函数
 */
function _mapTree(org) {
  const haveChildren = Array.isArray(org.children) && org.children.length;
  return {
    label: org.name,
    value: org.id,
    children: haveChildren ? org.children.map((item) => _mapTree(item)) : [],
  };
}
export function refactorSelection(selection: any[] = []) {
  return selection.map((item: any) => {
    return _mapTree(item);
  });
}


/**
 * 判断是否展示图表
 * @param {Array} data 对象数组
 * @returns {Boolean} 是否显示图表
 */
export function showTargetChart(data: Array<any>) {
  if (Array.isArray(data) && data.length) {
    if (data.every((item) => +item.data === 0)) {
      return false;
    }
    return true;
  }
  return false;
}

/**
 * 业务方法，场景说明，返回数组中数组最大的指定项
 * @param {Array} data 对象数组
 * @param {String} targetFieldsName 对象中的排序字段名
 * @param {Boolean} isDescend 默认降序排列
 * @param {Number} targetCount 返回的项数
 * @returns {Array} 指定的数组项
 */
export function targetMaxItem({
  data,
  targetFieldsName = 'data',
  isDescend = true, // 默认降序排列
  targetCount = 1,
  isEffective = true
}) {
  const sortData: any = data.sort((a, b) => {
    const targetA = +a[targetFieldsName];
    const targetB = +b[targetFieldsName];

    let comparison = 0;
    if (targetA > targetB) {
      comparison = 1;
    } else if (targetA < targetB) {
      comparison = -1;
    }
    return comparison * (isDescend ? -1 : 1);
  });
  if (targetCount > sortData.length) {
    return sortData;
  }
  const result: any = [];
  for (let i = 0; i < targetCount; i++) {
    const targetItem = sortData[i];
    if (isEffective) {
      targetItem[targetFieldsName] && result.push(targetItem);
    } else {
      result.push(targetItem);
    }
  }
  return result;
}
/**
 *
 * @param num 传入的数值
 * @param dicimal 含小数时截取n位小数
 * @param uncompromising true时会在Number.isInteger为true时自动拼接dicimal
 * @returns 整数时仍旧返回整数；小数时截取n位小数
 */
export function fixNumber(num: number | string, dicimal = 2, uncompromising = false) {
  // return num - parseInt(num + '') > 0 ? num.toFixed(dicimal) : num;
  if (+num) {
    // return Number.isInteger(+num) ? +num : (+num as number).toFixed(dicimal);
    return Number.isInteger(+num) && !uncompromising ? +num : (+num as number).toFixed(dicimal);
  }
  return num;
}

/**
 * 处理数值的显示
 * @param { String | Number} num 传入的数值
 * @param { Boolean } automatic 是否自动根据小数的位数保留
 * @param { Number | Boolean } dicimal 含小数时截取n位小数，不需要时传false
 * @returns 整数时仍旧返回整数；小数时截取n位小数
 * 例如
 * fixNumber('1') => 1 // 正整数
 * fixNumber(1.223) => '1.22'
 * fixNumber('1.2') => 1.2
 * fixNumber('1.226' || 1.226, false) => '1.23'
 * fixNumber('1.226' || 1.226, false, 4) => '1.2260'
 * fixNumber(1.226, true, false) => 1.226
 */
export function fixNumberSE(num: number | string, automatic = true, dicimal: number | boolean = 2): string | number {
  if (+num) {
    if (Number.isInteger(+num)) return +num; // 正整数
    const decimalPointRight = num.toString().split('.')[1]; // 小数点右边的字符串
    const len = decimalPointRight.length; // 小数点有几位
    if (automatic) { // 自动处理小数点的显示
      if (dicimal) {
        if (len <= (dicimal as number)) return +num; // 小数有几位就保留几位
        return (+num as number).toFixed(dicimal as number); // 统一保留dicimal的位数
      }
      return +num; // 小数有几位就保留几位
    }
    return (+num as number).toFixed(dicimal as number); // 统一保留dicimal的位数
  }
  return num;
}

/**
 * 打开高德地图网页
 * @param longitude 经度
 * @param latitude 纬度
 * @param address 地名
 */
export function openAMap(longitude: string|number, latitude:string|number, address:string) {
  return window.open(`https://ditu.amap.com/regeo?lng=${longitude}&lat=${latitude}&name=${address}&src=uriapi&callnative=1&innersrc=uriapi`);
}

/**
 * 将数字转成k、w结尾
 * @param num 值
 * @returns 1000转化为1k，10000转为1w,10000000转为1kw
 */
export function formatNumber(num: number) {
  // return num >= 1e3 && num < 1e4 ? (num / 1e3).toFixed(1) + 'k' : num >= 1e4 ? (num / 1e4).toFixed(1) + 'w' : num;
  if (num >= 1e3 && num < 1e4) {
    return (num / 1e3).toFixed(1) + 'k';
  } else if (num >= 1e4 && num < 1e8) {
    return (num / 1e4).toFixed(1) + 'w';
  } else if (num >= 1e8) {
    return (num / 1e8).toFixed(1) + '亿';
  } else {
    return num;
  }
}


/**
   * @description 获取文件的二进制数据，在通过Blob对象创建URL地址，然后进行模拟点击下载，如果下载失败，打开对应URL链接
   * @param url
   * @param name
   */
export function downloadFileByBlob(url, name = '踩点报告') {
  fetch(url, {
    method: 'get',
    mode: 'cors',
  }).then((response) => response.blob())
    .then((res) => {
      const downloadUrl = window.URL.createObjectURL(
        new Blob([res], {
          type: res.type
        })
      );
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch(() => {
      window.open(url);
    });
};


/**
 * @description 将base64上传到七牛云，获取url
 * @param base64Img base64图片
 * @param token 七牛云token 外部传入，避免批量获取时也需要多次获取七牛云token
 */
export async function UploadToQiniu(base64Img, token, name = 'img',) {

  // 将base64图片上传至七牛云，处理base64数据
  const formatBase64 = base64Img.replace(/^.*?,/, '');
  const baseUrl = bucketMappingActionUrl[Bucket.Certs];
  // 拼装请求的url
  const upUrl = `${baseUrl}putb64/${fileSize(formatBase64)}`;

  return new Promise((resolve) => {
    axios.post(upUrl, formatBase64, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `UpToken ${token}`
      }
    }).then(res => {
      if (res.status === 200) {
        if (res.data) {
          // 取到base64上传到七牛服务器的key
          const key = res.data.key;
          const img = {
            url: `${bucketMappingDomain[Bucket.Certs]}${key}`,
            name,
            isImage: true
          };
          resolve(img);
        }
      }
    });
  });
};

// 计算base64文件大小
const fileSize = (base64:any) => {
  if (base64.indexOf('=') !== -1) {
    const index = base64.indexOf('=');
    base64 = base64.substring(0, index);
  }

  // https://www.cnblogs.com/peachyy/p/9015083.html
  const fileSize = parseInt((base64.length - (base64.length / 8) * 2).toString());
  return fileSize;
};

/**
 * @description 根据对象数组中某个属性值进行排序（属性值必须是number）,默认降序
 * @param {Array} arr 需要排序的数组
 * @param {string} property 排序时依赖的字段名
 * @param {any} desc 是否降序
 * @return {any} 排序后的对象数组
 */
export function targetValSort(
  arr: Array<any>,
  property: string,
  desc = true
) {
  return arr.sort((a: any, b: any) => {
    const val1 = +a[property];
    const val2 = +b[property];
    return desc ? val2 - val1 : val1 - val2;
  });
}


// 时间计算工具
// console.log(formatTime(4830)); // 输出: "1小时20分钟30秒"
export function formatTime(seconds: number): string {
  if (typeof seconds !== 'number' || seconds < 0) {
    throw new Error('Invalid input. Please provide a non-negative number of seconds.');
  }

  const hours: number = Math.floor(seconds / 3600);
  const remainingSecondsAfterHours: number = seconds % 3600;
  const minutes: number = Math.floor(remainingSecondsAfterHours / 60);
  const remainingSecondsAfterMinutes: number = remainingSecondsAfterHours % 60;
  const formattedTime: string[] = [];

  if (hours > 0) {
    formattedTime.push(`${hours}小时`);
  }

  if (minutes > 0) {
    formattedTime.push(`${minutes}分钟`);
  }

  if (remainingSecondsAfterMinutes > 0 || formattedTime.length === 0) {
    formattedTime.push(`${remainingSecondsAfterMinutes}秒`);
  }

  return formattedTime.join('');
}


/**
 * @description 对象数组去重
 * @param arr
 * @return
 */
export function deduplicateObjects(arr) {
  const uniqueSet = new Set();

  arr.forEach(obj => {
    // 将对象转换为字符串，用作Set的键
    const objAsString = JSON.stringify(obj);
    uniqueSet.add(objAsString);
  });

  // 将Set转回数组，注意要将字符串还原为对象
  const uniqueArray = Array.from(uniqueSet).map((objAsString:any) => JSON.parse(objAsString));

  return uniqueArray;
}


/**
 * @description 获取地址栏某个参数
 * @param string
 * @return
 */
export function getParameterByName(name) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  var results = regex.exec(window.location.search);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
   * @description 金额格式化，比如营业额，必要时必要时转化为万
   * @param val 金额，单位元，20231120产品要求向下取整
   * @return
   */
export const amountStr = (val) => {
  return !isNotEmpty(val) ? '' : +val >= 10000
    ? `${(val / 10000.0)?.toFixed(2)}w` : beautifyThePrice(Math.floor(val), ',', 0);
};


const ReturnType = {
  ALL: 1,
  ONLY_DISTRICT: 2,
};

/**
 * @description 省市区组件参数处理
 * @param arrays 省市区组件返回的数据 [[1],[2,2],[6,4,5,6]] / [[1,1,1],[2,3,4],[5,6,7]]
 * @param returnType 处理类型（
 *   1-返回省/市/区三个数组，
 *   2-只返回区域id（必须搭配SHOWCHILD使用，否则取不到districtId ）
 * @return 返回接口需要数据格式
 */
export const processPoids = (arrays, returnType) => {
  if (!isArray(arrays || !arrays.length)) {
    return;
  }
  const result = arrays.reduce((acc, arr) => {
    if (arr.length === 1) {
      acc.provinceIds.push(...arr);
    } else if (arr.length === 2) {
      acc.cityIds.push(arr[arr.length - 1]);
    } else if (arr.length === 3) {
      acc.distrctIds.push(arr[arr.length - 1]);
    }
    return acc;
  }, {
    provinceIds: [],
    cityIds: [],
    distrctIds: [],
  });

  if (returnType === ReturnType.ONLY_DISTRICT) {
    return result.distrctIds;
  } else if (returnType === ReturnType.ALL) {
    return [result.provinceIds, result.cityIds, result.distrctIds];
  }
};

/**
 * number类型的数字超过万时展示w
 * @param numberVal  数值
 * @returns val {number | string}
 */
export const formatUnitTenThousand = (numberVal: number | string, dicimal = 1) => {
  if (!(+numberVal)) return 0;
  if (+numberVal < 10000) return numberVal;
  return `${(+numberVal / 10000).toFixed(dicimal)}w`;
};


/**
 * 匹配行政区adcode，拿到行政区对应的省市区信息
 * @param cityForAMap  取store里面的cityForAMap，省市区信息
 * @param adcode  区adcode
 * @returns val {number | string}
 */
export const findDistrict = (cityForAMap, adcode) => {
  let curMapInfo;
  cityForAMap.forEach((city) => {
    city.district?.map((item) => {
      if (+item.code === +adcode) {
        curMapInfo = {
          provinceId: city?.provinceId,
          cityId: city?.id,
          districtId: item?.id,
          provinceName: city?.provinceName,
          cityName: city?.name,
          districtName: item?.name
        };
      }
    });
  });
  return curMapInfo;
};


export const getImageUrlWidthHeight = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // 解决跨域图片问题，要写在图片加载前
    // 当图片完全加载时触发onload事件
    img.onload = () => {
      // 此时img.width和img.height会给出图片的原始宽度和高度
      const width = img.width;
      const height = img.height;
      resolve({
        width,
        height
      });
    };

    img.onerror = () => {
      reject('图片加载出错');
    };

    // 设置图片URL
    img.src = url;

    // 如果图片已经被浏览器缓存，上面的onload事件可能会立即执行，
    // 因此检查图片是否已经加载完成（complete属性为true）也很重要。
    // 特别是在设置src之后立即检查时。
    if (img.complete) {
      const width = img.width;
      const height = img.height;
      resolve({
        width,
        height
      });
    }
  });
};

/**
 * 是否滚动到指定容器底部
 * @param scrollContainerEl 滚动容器
 * @returns boolean 是否滚动到指定容器底部
 */
export const isBottomOut = (scrollContainerEl: any) => {
  const scrollTop = scrollContainerEl.scrollTop; // 滚动距离
  const scrollHeight = scrollContainerEl.scrollHeight; //
  const clientHeight = scrollContainerEl.clientHeight || scrollContainerEl.innerHeight;
  // 消除误差
  return (scrollTop + clientHeight + 1) >= scrollHeight;
};


/**
 * 获取容器滚动距离
 * @param scrollContainerEl 滚动容器
 * @returns number 容器的滚动距离
 */
export const scrollDistance = (scrollContainerEl: any) => {
  const clientHeight = scrollContainerEl.clientHeight; // 滚动内容的可视区域高度
  const scrollHeight = scrollContainerEl.scrollHeight; // 滚动内容的总高度
  return scrollHeight - clientHeight;
};


/**
 * @description: 根据七牛文件的 url，获取原图后缀
 * @param {*} url
 * @return {*}
 */
export function getQiniuFileOriSuffix(url) {
  if (url.includes('img.linhuiba.com')) {
    return url + UrlSuffix.Ori;
  } else if (url.includes('pmsimage.location.pub')) { // 来自 pms 的图片
    return url + UrlSuffix.PmsOri;
  } else if (url.includes('images.location.pub')) { // 来自 location 的图片
    return url + UrlSuffix.locationOri;
  } else {
    return url;
  }
};
/**
 * @description: 根据经纬度计算周边distance的视口四个角的经纬度
 * @param {*} centerLat
 * @param {*} centerLng
 * @param {*} distance
 * @return {*}
 */

export function calculateViewportCorners(centerLat, centerLng, distance) {
  // 视口内1公里四个角的经纬度
  const latOffset = distance / 110000; // 1度纬度大约为110公里
  const lngOffset = distance / (111320 * Math.cos(centerLat * (Math.PI / 180))); // 1度经度大约为111320 * Math.cos(纬度)米

  // 左上角
  const topLeftLat = centerLat + latOffset;
  const topLeftLng = centerLng - lngOffset;

  // 右上角
  const topRightLat = centerLat + latOffset;
  const topRightLng = centerLng + lngOffset;

  // 左下角
  const bottomLeftLat = centerLat - latOffset;
  const bottomLeftLng = centerLng - lngOffset;

  // 右下角
  const bottomRightLat = centerLat - latOffset;
  const bottomRightLng = centerLng + lngOffset;

  return {
    topLeft: { lat: topLeftLat, lng: topLeftLng },
    topRight: { lat: topRightLat, lng: topRightLng },
    bottomLeft: { lat: bottomLeftLat, lng: bottomLeftLng },
    bottomRight: { lat: bottomRightLat, lng: bottomRightLng }
  };
}
