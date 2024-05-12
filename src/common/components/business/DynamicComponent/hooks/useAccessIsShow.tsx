import {
  useMemo
} from 'react';

/**
   * @description 支持提交审批时是否可见，结合isShow最终决定是否展示
   * @param item
   * @return
   */
export const isShowWhenApprovalProcess = ({
  supportDirectApproval,
  propertyItem,
  isEvaluation, // 是否点位评估编辑页，是的话item的显示、禁用，参照的是机会点拓店模板、非流程设置
  isChancepoint = true, // 是否机会点表单，加盟商时false
}) => {
  // 支持提交审批时（即走配置的审批流时）
  if (isChancepoint && supportDirectApproval === 1 && !isEvaluation) {
    const { access } = propertyItem;
    // access 1：仅可见  2：可写 3:不可见 null:历史数据的不可见
    return access === 1 || access === 2;
  }
  return true;
};


export function useAccessIsShow({
  supportDirectApproval,
  propertyItem,
  isEvaluation, // 是否点位评估编辑页，是的话item的显示、禁用，参照的是机会点拓店模板、非流程设置
  isChancepoint = true, // 是否机会点表单，加盟商时false
}
) {
  return useMemo(() => {
    // 支持提交审批时（即走配置的审批流时）
    if (isChancepoint && supportDirectApproval === 1 && !isEvaluation) {
      const { access } = propertyItem;
      // access 1：仅可见  2：可写 3:不可见 null:历史数据的不可见
      return access === 1 || access === 2;
    }
    return true;
  }, [propertyItem, supportDirectApproval, isEvaluation, isChancepoint]);
}
