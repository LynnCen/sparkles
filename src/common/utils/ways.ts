import { singleLogout } from '@lhb/cache';
import { isNotEmpty, parseArrayToString, urlParams, matchQuery } from '@lhb/func';
import { message } from 'antd';

/*
 * 项目业务级功能方法汇总文件
 * 通用性公共方法记得迭代到 @lhb/func 方法库
 */

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
  needAllKeys = false,
  filtrationDisabled = false // 是否过滤disabled的节点
) {
  for (let i = 0; i < dataSource.length; i++) {
    const item = dataSource[i];
    if (item[childrenColumnName] && item[childrenColumnName].length) {
      filtrationDisabled
        ? (!item.disabled && rowKeys.push(item[rowKey]))
        : rowKeys.push(item[rowKey]);
      getKeys(item[childrenColumnName], rowKeys, rowKey, childrenColumnName, needAllKeys, filtrationDisabled);
    } else {
      needAllKeys && (filtrationDisabled
        ? (!item.disabled && rowKeys.push(item[rowKey]))
        : rowKeys.push(item[rowKey])
      );
    }
  }
  return rowKeys;
}

/**
 * 退出登录
 */
export function logout() {
  singleLogout();
  setTimeout(() => {
    if (process.env.NODE_ENV === 'development') { // 开发的话直接使用自带的一套登录
      window.location.reload();
    } else { // 跳转到kunlun去做登录
      location.href = `${process.env.KUNLUN_URL}?origin=${encodeURIComponent(location.href)}`;
    }
  }, 100);
}

// 逆地理编码(经纬度转换成具体地址)
/**
 * @param {Array} lnglat 经纬度
 * @param {String} cityName 城市名
 * @param {Boolean} onlyAddress 是否仅返回具体地址
 */
export function getLngLatAddress(geocoder, lnglat, onlyAddress = true) {
  return new Promise((resolve, reject) => {
    geocoder.getAddress(lnglat, (status, result) => {
      if (status === 'complete' && result.regeocode) {
        const { regeocode } = result;
        if (onlyAddress) {
          const { formattedAddress } = regeocode || {};
          resolve(formattedAddress);
        } else {
          resolve(regeocode);
        }
      } else {
        reject(new Error(`根据经纬度查询地址失败`));
      }
    });
  });
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
 *
 * @param data 文件流
 * @param fileName 下载文件名称
 * @param type 下载文件类型，默认为excel
 */
export const downloadFileStream = (data: any, fileName: string, type?: string) => {
  const blob = new Blob([data], { type: type || 'application/vnd.ms-excel' });
  // 这里就是创建一个a标签，等下用来模拟点击事件
  const a = document.createElement('a');
  // 兼容webkix浏览器，处理webkit浏览器中href自动添加blob前缀，默认在浏览器打开而不是下载
  const URL = window.URL || window.webkitURL;
  // 根据解析后的blob对象创建URL 对象
  const herf = URL.createObjectURL(blob);
  // 下载链接
  a.href = herf;
  // 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
  a.download = fileName;
  document.body.appendChild(a);
  // 点击a标签，进行下载
  a.click();
  // 收尾工作，在内存中移除URL 对象
  document.body.removeChild(a);
  window.URL.revokeObjectURL(herf);
};
/*
* 用来把接口返回的选项数据，name，id转为 label value
* 我们的接口爱用 name id，antd默认 label，value。 甚至radio这种都不允许改key，贼烦，故有此方法函数
*/
function _mapTree(org) {
  const haveChildren = Array.isArray(org.children) && org.children.length;
  return {
    label: org.name,
    value: org.id,
    children: haveChildren ? org.children.map(item => _mapTree(item)) : []
  };
}
export function refactorSelection(selection: any[] = []) {
  return selection.map((item: any) => {
    return _mapTree(item);
  });
}

/**
 * @description: 将选项数据转换为 { value, label, children }
 * @param {*} obj.selection 选项数据
 * @param {*} obj.valueKey 当前数据的 value 键名
 * @param {*} obj.labelKey 当前数据的 label 键名
 * @param {*} obj.childrenKey 当前数据的 children 键名
 * @return {*}
 */
export function refactorSelectionNew({ selection = [], valueKey = 'id', labelKey = 'name', childrenKey = 'children' }:
{ selection?: Array<any>; valueKey?: string; labelKey?: string; childrenKey?: string }) {
  if (!Array.isArray(selection) || !selection.length) {
    return [];
  }

  return selection.map(item => ({
    ...item,
    value: item[valueKey],
    label: item[labelKey],
    children: Array.isArray(item[childrenKey]) && item[childrenKey].length ? refactorSelectionNew({ selection: item[childrenKey], valueKey, labelKey, childrenKey }) : null,
  }));
}

/**
 *
 * @param value 值
 * @returns 值如果为空则显示-
 */
export const valueFormat = (value: any) => {
  return isNotEmpty(value) ? value : '-';
};

/**
 *
 * @param secondTime 秒
 * @returns 时分秒
 */
export function formatTimeStr(secondTime: number) {
  let minuteTime = 0;// 分
  let hourTime = 0;// 小时
  if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = Math.floor(secondTime / 60);
    // 获取秒数，秒数取佘，得到整数秒数
    secondTime = Math.floor(secondTime % 60);
    // 如果分钟大于60，将分钟转换成小时
    if (minuteTime >= 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      hourTime = Math.floor(minuteTime / 60);
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = Math.floor(minuteTime % 60);
      return `${hourTime}小时${minuteTime}分${secondTime}秒`;
    }
    return `${minuteTime}分${secondTime ? `${secondTime}秒` : ''}`;
  }
  return `${secondTime}秒`;
}

/**
 * [showInvalidFieldMsg 解析el-form校验未通过的字段信息]
 * @param  {[type]} object    未通过校验的字段
 * @param  {[type]} maxLength 提示内容的最大个数，默认 -1无限制
 * @return {[type]}        [description]
 */
export function showInvalidFieldMsg(errorFields, maxLength = -1) {
  if (!Array.isArray(errorFields) || !errorFields.length) {
    return null;
  }
  const arr: any = [];
  errorFields.forEach(item => {
    const data = parseArrayToString(item.errors);
    if (data) {
      arr.push(data);
    }
  });

  const messages = maxLength === -1 ? arr : arr.slice(0, maxLength);
  message.warning(parseArrayToString(messages));

  return messages;
}

/**
 * 滚动到第一个必填未填项
 */
export function scrollToError(trueDocument) {
  setTimeout(() => {
    const errorLists = trueDocument.querySelector('.ant-form-item-explain-error');
    errorLists?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
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

// 获取链接的无侧边栏链接（目前使用了开放链接的用法）
export function getNoNavUrl(url) {
  if (!isNotEmpty(url) || matchQuery(url, 'source')) {
    return url;
  }
  if (!Object.keys(urlParams(url)).length) {
    url += '?v=1';
  }
  return url + '&source=admin';
}

/**
 * 下载 blob 数据
 * @description: 前端 axios 下载 excel，并解决 axios 返回 header 无法获取所有数据的问题 https://www.cnblogs.com/smiler/p/8708815.html
 * @param {*} fileName 文件名称
 * @return {*}
 */
export function downloadBlob(data, fileName) {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
  // 允许用户在客户端上保存文件
  if (navigator['msSaveOrOpenBlob'] && navigator['msSaveBlob']) {
    navigator['msSaveBlob'](blob, fileName);
  } else {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob); // 创建下载的链接
    link.download = fileName; // 下载后文件名
    document.body.appendChild(link);
    link.click(); // 点击下载
    document.body.removeChild(link); // 下载完成移除元素
    window.URL.revokeObjectURL(link.href); // 释放掉blob对象
  }
}

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
