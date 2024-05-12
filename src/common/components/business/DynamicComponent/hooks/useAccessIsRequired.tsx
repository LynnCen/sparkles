/**
 * @Description 配合审批流的可读配置来显示动态组件是否必填
 */

import {
  useMemo
} from 'react';
import { AlwaysRequiredChanceIndentifications } from '../customize';

export function useAccessIsRequired({
  propertyItem,
  isChancepoint = true, // 是否机会点表单，加盟商时false
}) {
  return useMemo(() => {
    // 机会点时指定特定identification必填字段
    const isIdentiRequired = isChancepoint && Array.isArray(AlwaysRequiredChanceIndentifications) && AlwaysRequiredChanceIndentifications?.includes(propertyItem?.identification);

    return isIdentiRequired || !!propertyItem.required;
  }, [propertyItem]);
}

