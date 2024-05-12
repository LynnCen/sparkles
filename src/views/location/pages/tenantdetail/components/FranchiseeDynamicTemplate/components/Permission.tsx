/**
 * @Description 按钮权限操作相关
 */

import { FC } from 'react';
import { refactorPermissions } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import {
  dynamicTemplateAddGroup,
  dynamicTemplateGroupDelete,
  dynamicTemplatePropertyDelete
} from '@/common/api/location';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
// import cs from 'classnames';
// import styles from './entry.module.less';
import Operate from '@/common/components/Operate';

const Permission: FC<any> = ({
  value,
  templateId, // 模板id
  record, // 行数据
  loadData, // 更新table数据
  propertyTreeDrawInfo, // 选择字段的弹窗数据
  setPropertyTreeDrawInfo,
  setExpandedRowKeys, // 设置展开行
  setLimitData, // 限制弹窗
  setFormulaData, // 计算公式
  setAssociatedDisplayData, // 设置关联显示
}) => {

  const methods = useMethods({
    // 添加二级分组
    handleAddSecondGroup: () => {
      const params = {
        templateId,
        categoryTemplateId: templateId,
        parentId: record.id,
        name: '二级分组'
      };
      dynamicTemplateAddGroup(params).then(() => {
        loadData();
        setExpandedRowKeys((state) => [...state, record.key]);
      });
    },
    // 添加字段
    handleAddField: () => {
      setPropertyTreeDrawInfo({
        ...propertyTreeDrawInfo,
        categoryTemplateId: templateId,
        categoryPropertyGroupId: record.id,
        visible: true,
        rowKey: record.key,
        rowData: record,
      });
    },
    // 删除
    handleDelete: (record) => {
      // 一级分组/二级分组
      if (record.isGroup) {
        if (record.children && record.children.length) {
          V2Confirm({
            content: '该分组下存在字段或分组，无法删除',
            onSure: (modal) => {
              modal.destroy();
            }
          });
          return;
        }
        V2Confirm({
          content: '删除后，拓店人员提报时无法看到该分组',
          onSure: (modal) => {
            dynamicTemplateGroupDelete({ id: record.id, templateId }).then(() => {
              modal.destroy();
              loadData && loadData();
            });
          }
        });
        return;
      }
      // 字段
      V2Confirm({
        content: '删除后，拓店人员提报时无法看到该字段',
        onSure: (modal) => {
          dynamicTemplatePropertyDelete({ templateId, propertyIds: [record.id] }).then(
            () => {
              modal.destroy();
              loadData && loadData();
            }
          );
        }
      });
    },
    handleBindLimit: (record) => { // 限制
      setLimitData({
        open: true,
        data: record
      });
    },
    handleBindCompute(record) { // 计算公式
      setFormulaData({
        open: true,
        data: record
      });
    },
    handleBindShow() { // 关联显示
      setAssociatedDisplayData({
        open: true,
        data: record
      });
    },
  });
  return (
    <Operate
      showBtnCount={4}
      operateList={refactorPermissions(value)}
      onClick={(btn: any) => {
        methods[btn.func](record);
      }}
    />
  );
};

export default Permission;
