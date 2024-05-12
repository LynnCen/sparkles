/**
 * @Description 网规组件展示
 */

import { beautifyThePrice, isDef, isNotEmptyAny } from '@lhb/func';
import { RowData, assembleTextData, assembleTextDataNoCheck } from './config';

/**
   * @description 展示最近商圈距离机会点
   */
const showDistance = (info) => {
  const val = '';
  if (info && info.distance) {
    const dist = info.distance;
    return dist > 100 ? beautifyThePrice(dist / 1000.0, ',', 1) + 'km' : `${dist}m`;
  }
  return val;
};

/**
 * @description 组件展示
 * @param name
 * @param info
 * @return
 */
export const businessPlanningInfos = (name, info, required: boolean) : RowData | RowData[] | null => {
  if (!isNotEmptyAny(info)) {
    return assembleTextData('所属商圈', '', required);
  }
  if (!info) {
    // 未选择地址
    return assembleTextData('所属商圈', '', required);
  } else if (!isDef(info.isInCluster)) {
    // 无商圈数据
    return [
      assembleTextDataNoCheck('所属商圈', '该机会点不在规划商圈中'),
      assembleTextDataNoCheck('商圈类型', info?.manualTypeName)
    ];
  } else if (info.isInCluster) {
    // 有所属商圈
    return [
      assembleTextDataNoCheck('所属商圈', info.clusterName),
      assembleTextDataNoCheck('商圈类型', info.clusterTypeName),
      assembleTextDataNoCheck('商圈评分', info.clusterScore),
      assembleTextDataNoCheck('所在集客点', info.planSpotName),
      assembleTextDataNoCheck('规划门店数量', info.planStores),
      assembleTextDataNoCheck('已开门店数量', info.openStores),
    ];
  } else {
    // 附近有商圈
    return [
      assembleTextDataNoCheck('所属商圈', '该机会点不在规划商圈中'),
      assembleTextDataNoCheck('10km最近商圈', info.clusterName),
      assembleTextDataNoCheck('距离当前机会点', showDistance(info)),
      assembleTextDataNoCheck('商圈类型', info.manualTypeName),
    ];
  }
};
