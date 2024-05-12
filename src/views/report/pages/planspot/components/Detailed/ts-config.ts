/**
 * @Description 表单参数
 */

import { isNotEmpty, isNotEmptyAny } from '@lhb/func';
import { amountStr } from '@/common/utils/ways';

/**
 * @description 列表中狭窄列的共通设置
 */
const narrowCol = {
  width: 150,
  render: (value) => isNotEmptyAny(value) ? value : '-'
};

/**
 * @description 列表中宽列的共通设置
 */
const wideCol = {
  width: 200,
  render: (value) => isNotEmptyAny(value) ? value : '-'
};

// 默认明细
export const defaultColumns = [
  { key: 'name', title: '商圈名称', fixed: 'left', ...wideCol },
  { key: 'city', title: '城市', ...narrowCol },
  { key: 'district', title: '城区', ...narrowCol },
  { key: 'firstLevelCategory', title: '商圈一级', ...narrowCol },
  { key: 'secondLevelCategory', title: '商圈二级', ...narrowCol },
  { key: 'spotStatus', title: '商圈集客点状态', ...narrowCol },
  { key: 'spotPassCount', title: '已通过集客点数', ...narrowCol },
  { key: 'relationChancePoint', title: '是否关联机会点', ...narrowCol },

  { key: 'mainBrandsScore', title: '行业评分', ...narrowCol,
    render: (value) => Math.round(value) || '-'
  },
  { key: 'totalScore', title: '益禾堂评分', ...narrowCol,
    render: (value) => Math.round(value) || '-'
  },
  {
    key: 'salesAmountPredict', title: '预测日营业额',
    ...narrowCol,
    render: (val: number, record: any) => isNotEmpty(record?.lowSalesAmountPredict) && isNotEmpty(record?.upSalesAmountPredict)
      ? `${amountStr(record.lowSalesAmountPredict)}-${amountStr(record.upSalesAmountPredict)}`
      : `
      ${isNotEmpty(record?.lowSalesAmountPredict) ? `${amountStr(record.lowSalesAmountPredict)}` : ''}
      ${!isNotEmpty(record?.lowSalesAmountPredict) && !isNotEmpty(record?.upSalesAmountPredict) ? '-' : ''}
      ${isNotEmpty(record?.upSalesAmountPredict) ? ` ${amountStr(record.upSalesAmountPredict)}` : ''}
      `
  },
  { key: 'mainBrandsProba', title: '奶茶行业适合度',
    ...narrowCol,
    render: (value) => value ? `${value * 100}%` : '-'
  },
  { key: 'proba', title: '品牌适合度  ',
    ...narrowCol,
    render: (value) => value ? `${value * 100}%` : '-'
  },
  { key: 'approvalCreator', title: '录入人', ...narrowCol },
  { key: 'approvalCreateAt', title: '录入时间', ...wideCol },
];

// 集客点明细
export const planSpotColumns = [
  {
    key: 'name', title: '集客点名称',
    fixed: 'left',
    ...narrowCol,
    render: (value) => isNotEmptyAny(value) ? value.length > 10 ? value.slice(0, 10) + '...' : value : '-'
  },
  { key: 'planClusterName', title: '关联商圈', ...narrowCol },
  { key: 'city', title: '城市', ...narrowCol },
  { key: 'district', title: '城区', ...narrowCol },
  { key: 'firstLevelCategory', title: '商圈一级', ...narrowCol },
  { key: 'secondLevelCategory', title: '商圈二级', ...narrowCol },
  { key: 'thirdLevelCategory', title: '商圈三级', ...narrowCol },
  {
    key: 'editDescription', title: '动线始末',
    ...narrowCol,
    render: (value) => isNotEmptyAny(value) ? value.length > 10 ? value.slice(0, 10) + '...' : value : '-'
  },
  {
    key: 'pointName', title: '集客A类点',
    ...narrowCol,
    render: (value) => isNotEmptyAny(value) ? value.length > 10 ? value.slice(0, 10) + '...' : value : '-'
  },
  { key: 'estimatedDailyAmount', title: '预估日均金额(元)', ...narrowCol },
  { key: 'rent', title: '租金单价行情(元/㎡/月)', ...narrowCol },
  { key: 'assignmentFee', title: '转让费行情(元)', ...wideCol },
  { key: 'address', title: 'A类坐标点位置', ...wideCol },
  { key: 'spotStatus', title: '集客点状态', ...wideCol },
  { key: 'relationChancePoint', title: '是否关联机会点', ...wideCol },
  { key: 'creator', title: '录入人', ...wideCol },
  { key: 'createdAt', title: '录入时间', ...wideCol },

];
