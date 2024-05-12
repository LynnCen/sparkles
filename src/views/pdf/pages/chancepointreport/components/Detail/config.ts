/**
 * @Description 各属性类型的展示数据配置
 */

import { isArray, isNotEmpty, isNotEmptyAny } from '@lhb/func';
import { contendInfoFields } from 'src/common/components/business/DynamicComponent/config';
import { parseValueCatch } from '@/common/components/business/DynamicComponent/config';

export interface RowData {
  type: 'text' | 'image' | 'file'; // 数据类型
  title: string;
  text?: string; // type为text时内容放置
  images?: any[]; // type为image时文件数组
  files?: any[]; // type为file时文件数组
};

/**
 * @description 构建展示文本数据的行
 * @param title
 * @param text
 * @return 有数据则展示，无数据且必填时显示-，无数据且非必填不展示
 */
export const assembleTextData = (title: string, text: string, required: boolean) : RowData | null => {
  return (isNotEmpty(text) || required) ? {
    type: 'text',
    title,
    text: isNotEmpty(text) ? text : '-'
  } : null;
};

/**
 * @description 构建展示文本数据的行（不检查必填与否，确定展示）
 * @param title
 * @param text
 * @return 有数据则展示，无数据则显示-
 */
export const assembleTextDataNoCheck = (title: string, text: string) : RowData => {
  return {
    type: 'text',
    title,
    text: isNotEmpty(text) ? text : '-'
  };
};

/**
 * @description 构建展示文件数据的行
 * @param title
 * @param images
 * @return 有数据则展示，无数据且必填时显示-，无数据且非必填不展示
 */
export const assembleImageData = (title: string, images: any[], required: boolean) : RowData | null => {
  return isNotEmptyAny(images) && images.length ? {
    type: 'image',
    title,
    images
  } : required ? assembleEmptyData(title) : null;
};

/**
 * @description 构建展示文件数据的行
 *
 *  使用例子
 *      files = [
        {
            "url": "https://middle-file.linhuiba.com/Fl6LSbtUsjlEh7ktrvGlZmEmfT9c",
            "name": "客流转化系数维护模版 (2).xlsx"
        },
        {
            "url": "https://middle-file.linhuiba.com/Fl6LSbtUsjlEh7ktrvGlZmEmfT9c",
            "name": "客流转化系数维护模版 (2).xlsx"
        }
    ]
 *      assembleFileData('参照转化率', files)
 * @param title
 * @param files
 * @return 有数据则展示，无数据且必填时显示-，无数据且非必填不展示
 */
export const assembleFileData = (title: string, files: any[], required: boolean) : RowData | null => {
  return isNotEmptyAny(files) && files.length ? {
    type: 'file',
    title,
    files
  } : required ? assembleEmptyData(title) : null;
};

/**
 * @description 构建无数据的行
 * @param title
 * @param text
 * @return
 */
export const assembleEmptyData = (title: string) : RowData => {
  return {
    type: 'text',
    title,
    text: '-'
  };
};

/**
 * @description 竞品分析组件展示
 * @param name
 * @param value
 * @return
 */
export const contendInfo = (name, value) : RowData | RowData[] | null => {
  if (!isArray(value) || !value.length) {
    return null;
  }
  const infos: any[] = [];
  value.filter(item => Object.values(item).some(field => !!field))
    .map((item, index) => {
      contendInfoFields.map((field) => {
        const val = value[index]?.[field.name];
        const suffix = field.suffix;
        infos.push(assembleTextDataNoCheck(field.label, val ? `${val}${suffix ? ` ${suffix}` : ''}` : val));
      });
    });
  return infos;
};

/**
 * @description 商圈匹配信息组件展示
 * @param name
 * @param value
 * @return
 */
export const businessInfo = (name, value, required) : RowData | RowData[] | null => {
  if (!isNotEmptyAny(value)) {
    // 未选择地址
    return assembleTextData('所属商圈', '', required);
  } else if (!value.isInCluster) {
    // 无商圈
    return [
      assembleTextDataNoCheck('所属商圈', '该机会点不在商圈内'),
      assembleTextDataNoCheck('商圈类型', '-'),
      assembleTextDataNoCheck('商圈评分', '-'),
    ];
  } else {
    // 有所属商圈
    return [
      assembleTextDataNoCheck('所属商圈', value?.clusterName),
      assembleTextDataNoCheck('商圈类型', value?.clusterTypeName),
      assembleTextDataNoCheck('商圈评分', value?.clusterScore),
    ];
  };
};

/**
 * @description 日均客流预测组件展示
 * @param name
 * @param value
 * @return
 */
export const dailyFlowInfo = (name, value, required) : RowData | RowData[] | null => {
  if (value === null && !required) {
    return null;
  }
  const infos: any[] = [
    assembleTextDataNoCheck('客流采集时间段', value?.optionName),
    assembleTextDataNoCheck('采集客流量', value?.collection),
    assembleTextDataNoCheck('预测日均客流', `${isNotEmpty(value?.dailyPredict) ? `${value.dailyPredict}人/天` : '-'}`),
  ];
  return infos;
};

/**
 * @description 参考文件组件展示
 * @param name
 * @param value
 * @return
 */
export const referenceFileInfo = (name, propertyItem, required) : RowData | RowData[] | null => {

  const { templateRestriction } = propertyItem;
  if (!templateRestriction) {
    return required ? assembleEmptyData(name) : null;
  }

  const restriction = parseValueCatch(propertyItem, 'templateRestriction');
  if (!isNotEmptyAny(restriction)) {
    return required ? assembleEmptyData(name) : null;
  }

  const { url, urlName } = restriction;
  if (!url || !urlName) {
    return required ? assembleEmptyData(name) : null;
  }

  const files = [{
    url,
    name: urlName,
  }];
  return assembleFileData(name, files, required);
};

