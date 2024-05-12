import { TargetChild } from '../ts-config';

export function formatSearchFormLabel(target: TargetChild) {
  let result = '';
  switch (target.metaType) {
    case '学历': result = `${target.metaType}（${target.nameCh}）`; break;
    case '年龄': result = `${target.metaType}：${target.nameCh}`; break;
    case '性别': result = `${target.nameCh}性占比`; break;
    case '是否有车': result = `${target.nameCh}占比`; break;
    case '餐饮消费水平': result = `${target.metaType}${target.nameCh}`; break;
    default: result = `${target.metaType}_${target.nameCh}`; break;
  }
  return result;
}

export function formatTableTitle(target: TargetChild) {
  let result = '';
  switch (target.metaType) {
    case '年龄': result = `${target.metaType}：${target.nameCh}`; break;
    case '性别': result = `${target.nameCh}性占比`; break;
    case '是否有车': result = `${target.nameCh}占比`; break;
    case '餐饮消费水平': result = `${target.metaType}${target.nameCh}`; break;
    default: result = `${target.metaType}_${target.nameCh}`; break;
  }
  return `${result}(%)`;
}
