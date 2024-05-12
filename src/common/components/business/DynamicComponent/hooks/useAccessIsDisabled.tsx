
/**
 * @Description 配合审批流的可读配置来显示动态组件是否处于禁用状态
 */
import {
  useMemo
} from 'react';

export function useAccessIsDisabled({
  supportDirectApproval,
  propertyItem,
  isEvaluation, // 是否点位评估编辑页，是的话item的显示、禁用，参照的是机会点拓店模板、非流程设置
  isChancepoint = true, // 是否机会点表单，加盟商时false
}
) {
  return useMemo(() => {
    const { access } = propertyItem;
    // 支持提交审批时（即走配置的审批流时）；点位评估时，虽然支持审批，但是读取的是拓店模板设置，不参照流程设置
    if (isChancepoint && supportDirectApproval === 1 && !isEvaluation) {
      // access 1：仅可见  2：可写 3:不可见 null:历史数据的不可见
      return access === 1;
    }

    const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};
    return !!restriction?.disable;
  }, [propertyItem, supportDirectApproval, isEvaluation]);
}

