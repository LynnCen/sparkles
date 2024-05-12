import { isNotEmptyAny, isUndef } from '@lhb/func';
import { useContext } from 'react';
import { ComovementRelationsProvider } from '../components/DetailForm';
import { KAComovementRelationsProvider } from '@/views/resmngka/pages/detail/components/DetailForm';
import { ResAuditRelationsProvider } from '@/views/resaudit/pages/add/entry';

interface ComovementRelation {
  currentValue: any,
  relationsComponent: number;
}

// function isValuePass(obj1, obj2) {
//   console.log('比较 ', obj1, obj2);
//   var o1 = obj1 instanceof Object;
//   var o2 = obj2 instanceof Object;
//   // 判断是不是对象
//   if (!o1 || !o2) {
//     return obj1 === obj2;
//   }
//   var aProps = Object.keys(obj1);
//   var bProps = Object.keys(obj2);
//   if (aProps.length !== bProps.length) {
//     return false;
//   }
//   for (var i = 0; i < aProps.length; i++) {
//     var propName = aProps[i];

//     var propA = obj1[propName];
//     var propB = obj2[propName];
//     // 2020-11-18更新，这里忽略了值为undefined的情况
//     // 故先判断两边都有相同键名
//     if (!obj2.hasOwnProperty(propName)) return false;
//     if ((propA instanceof Object)) {
//       if (!isValuePass(propA, propB)) {
//         return false;
//       }
//     } else if (propA !== propB) {
//       return false;
//     }
//   }
//   return true;
// }

// 是否符合
function checkValue(name, propertyId, permitedValues, value) {
  // console.log('被检查属性 ', name, propertyId, permitedValues, '依赖属性', relationsComponent, '依赖属性当前值', value);

  if (Array.isArray(permitedValues) && value) {
    if (value instanceof Object && !Array.isArray(value)) {
      // 对象
      const { selectedId } = value;
      return permitedValues.includes(selectedId);
    } else if (value instanceof Object && Array.isArray(value)) {
      // 对象数组
      const selectedIds = value.map(itm => itm.selectedId);
      return selectedIds.some(itm => permitedValues.includes(itm));
    }
  }
  return false;
}

const checkRelations = (name, propertyId, comovementRelations: ComovementRelation[], values: any) => {
  if (!comovementRelations) {
    return true;
  }

  if (comovementRelations.length === 0) {
    return true;
  }

  for (let i = 0; i < comovementRelations.length; i++) {
    const { currentValue: permitedValues, relationsComponent } = comovementRelations[i];
    if (!isNotEmptyAny(permitedValues) || isUndef(relationsComponent)) {
      console.log('组件关联信息异常 ，需要调查下，这次让通过', name, propertyId);
      return true;
    }
    const value = values[relationsComponent];
    if (checkValue(name, propertyId, permitedValues, value)) {
      return true;
    }
  }

  return false;
};

const useComovementRelations = (name, propertyId, comovementRelations: ComovementRelation[] = [], type: 'resmng'|'resmngka'|'resaudit') => {
  // 获取到当前所有值
  const resMngValues = useContext(ComovementRelationsProvider);
  const kaResMngValues = useContext(KAComovementRelationsProvider);
  const resAuditValues = useContext(ResAuditRelationsProvider);

  let values;
  // console.log('useComovementRelations type', type);
  if (type === 'resmng') {
    values = resMngValues;
  } else if (type === 'resmngka') {
    values = kaResMngValues;
  } else if (type === 'resaudit') {
    values = resAuditValues;
  } else {
    return true;
  }

  // console.log('useComovementRelations', comovementRelations, values);
  // 根据给定的组件id取出当前值
  const isShow = checkRelations(name, propertyId, comovementRelations, values);
  // !isShow && console.log('===不通过 将隐藏属性', name, propertyId, comovementRelations);
  return isShow;

};

export default useComovementRelations;
