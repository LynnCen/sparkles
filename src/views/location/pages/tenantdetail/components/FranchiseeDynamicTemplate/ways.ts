/**
 * @Description 加盟商动态模板相关方法
 */
import { ControlType } from '@/common/enums/control';
import { isArray } from '@lhb/func';

// 格式化接口返回的数据
export function templateDataFormatting(dataSource: any[]) {
  let sortNum = 0;
  return dataSource?.map((item: any) => {
    // 遍历二级菜单（childList存放的是二级菜单）
    const childList =
    item.childList && isArray(item.childList) &&
    item.childList.map((secondGroup) => ({
      ...secondGroup,
      // 构造唯一值
      key: 'secondGroup-' + item.id + '-' + secondGroup.id,
      isGroup: true,
      sortIndex: ++sortNum,
      permissions: getIsGroupFixed(secondGroup)
        ? [{ name: '添加字段', event: 'addField' }]
        : [
          { name: '添加字段', event: 'addField' },
          { name: '删除', event: 'delete' },
        ],
      children:
        // 二级菜单下的字段
        secondGroup.propertyConfigVOList &&
        secondGroup.propertyConfigVOList.map((property) => ({
          ...property,
          key: 'secondProperty-' + item.id + '-' + secondGroup.id + '-' + property.id,
          isGroup: false,
          parentId: secondGroup.id,
          propertyName: property.name,
          remark: property.propertyConfigOptionVOList
            ? property.propertyConfigOptionVOList.map((item) => item.name).join('、')
            : '-',
          anotherName: property.anotherName,
          sortIndex: ++sortNum,
          permissions: getFieldsRowBtnPermissions(property),
        })),
    }));
    // 按目前所有字段挂在二级菜单下的约定，这里的propertyConfigVOList永远都是空数组
    const propertyConfigVOList =
    item.propertyConfigVOList &&
    item.propertyConfigVOList.map((property) => ({
      ...property,
      key: 'firstProperty-' + item.id + '-' + property.id,
      isGroup: false,
      parentId: item.id,
      propertyName: property.name,
      remark: property.propertyConfigOptionVOList
        ? property.propertyConfigOptionVOList.map((item) => item.name).join('、')
        : '-',
      anotherName: property.anotherName,
      sortIndex: ++sortNum,
      permissions: getFieldsRowBtnPermissions(property),
    }));

    return {
      key: 'firstGroup-' + item.id,
      isGroup: true,
      name: item.name,
      id: item.id,
      parentId: null,
      sortIndex: ++sortNum,
      permissions: getIsGroupFixed(item)
        ? [
          { name: '添加二级', event: 'addSecondGroup' },
          // 目前约定的场景，一级菜单不能添加字段
          { name: '添加字段', event: 'addField', disabled: true },
        ]
        : [
          { name: '添加二级', event: 'addSecondGroup' },
          // 目前约定的场景，一级菜单不能添加字段
          { name: '添加字段', event: 'addField', disabled: true },
          { name: '删除', event: 'delete' },
        ],
      children: propertyConfigVOList.concat(childList),
    };
  });
}

// 获取字段行显示的按钮权限
export function getFieldsRowBtnPermissions(property: any) {
  // isFixed 是否可修改
  const permissions = property.isFixed === 0 ? [] : [{ name: '删除', event: 'delete' }];
  const controlType = property.controlType;
  if (property.isFixed === 1 &&
    (
      controlType === ControlType.INPUT.value ||
      controlType === ControlType.TEXT_AREA.value ||
      controlType === ControlType.UPLOAD.value ||
      controlType === ControlType.INPUT_NUMBER.value ||
      controlType === ControlType.CHECK_BOX.value
    )
  ) {
    permissions.unshift({ name: '限制', event: 'bindLimit' });
  }
  if (controlType === ControlType.SINGLE_RADIO.value || controlType === ControlType.CHECK_BOX.value) {
    permissions.unshift({ name: '关联显示', event: 'bindShow' });
  }
  if (controlType === ControlType.INPUT_NUMBER.value) {
    permissions.unshift({ name: '编辑', event: 'bindCompute' });
  }
  if (controlType === ControlType.SURROUND_SEARCH.value) {
    permissions.unshift({ name: '编辑', event: 'bindSurroundSearch' });
  }
  // if (controlType === ControlType.SINGLE_RADIO.value || controlType === ControlType.CHECK_BOX.value) {
  //   permissions.unshift({ name: '标红设置', event: 'bindSelectRedMark' });
  // }
  // if (controlType === ControlType.INPUT_NUMBER.value) {
  //   permissions.unshift({ name: '标红设置', event: 'bindNumberRedMark' });
  // }
  return permissions;
}
// 判断行是否可删除
export function getIsGroupFixed(group: any) {
  const { propertyConfigVOList, childList } = group;
  if (isArray(propertyConfigVOList) && propertyConfigVOList.length) {
    // 有不能删除的属性
    if (propertyConfigVOList.filter((property) => property.isFixed === 0).length > 0) {
      return true;
    }
  }
  // 有不能删除的子类
  if (isArray(childList) && childList.length) {
    const len = childList.length;
    for (let i = 0; i < len; i++) {
      if (getIsGroupFixed(childList[i])) {
        return true;
      }
    }
  }
  return false;
}

// 获取templateRestriction
export function getRestriction(row: any) {
  const { templateRestriction } = row || {};
  return templateRestriction ? JSON.parse(templateRestriction) : {};
}

// 操作类弹窗数据初始值
export function initModalData() {
  return {
    open: false,
    data: null
  };
}

