import { resTemplateDetail } from '@/common/api/template';
import Table from '@/common/components/FilterTable';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Button, Space, Typography } from 'antd';
import { FC, useState } from 'react';
import { GroupModalInfo, GroupType, LabelTreeDrawInfo } from '../ts-config';
import GroupModal from './Modal/GroupModal';
import LabelTreeDraw from './LabelTreeDraw';
import { refactorPermissions } from '@lhb/func';

const { Text } = Typography;

const LabelConfigTab: FC<any> = ({ categoryId, categoryTemplateId }) => {
  const [labelTreeDrawInfo, setLabelTreeDrawInfo] = useState<LabelTreeDrawInfo>({
    visible: false,
    disabledOIds: [],
  });
  const [groupModalInfo, setGroupModalInfo] = useState<GroupModalInfo>({
    visible: false,
    categoryId: categoryId,
    categoryTemplateId: categoryTemplateId,
    groupType: GroupType.PROPERTY,
  });

  const [params, setParams] = useState<any>({});
  const columns = [
    {
      key: 'name',
      title: '分组名称',
      width: 150,
      render: (_, record) => {
        if (record.isLabel) {
          return null;
        } else {
          return <Text strong>{record.name}</Text>;
        }
      },
    },
    {
      key: 'name',
      title: '标签名称',
      render: (_, record) => {
        if (record.isLabel) {
          return record.name;
        } else {
          return null;
        }
      },
    },
    {
      title: '操作',
      key: 'op',
      render: (_, record) => {
        if (record.oid.search('label') != -1) {
          return (
            <Operate
              onClick={(btn) => methods[btn.func](record)}
              operateList={refactorPermissions([
                { name: '删除', event: 'deleteLabel' },
              ])}
            />
          );
        }
        return (
          <Operate
            showBtnCount={4}
            onClick={(btn) => methods[btn.func](record)}
            operateList={refactorPermissions([
              { name: '新增标签', event: 'addLabel' },
              { name: '编辑', event: 'editGroup' },
              { name: '删除', event: 'deleteGroup' },
            ])}
          />
        );
      },
    },
  ];
  const { loop, loadData, onSearch, handleAddGroup, ...methods } = useMethods({
    handleAddGroup() {
      setGroupModalInfo({ categoryId, categoryTemplateId, groupType: GroupType.LABEL, visible: true });
    },
    handleEditGroup(record) {
      setGroupModalInfo({
        categoryId,
        categoryTemplateId,
        name: record.name,
        visible: true,
        id: record.id,
        groupType: GroupType.LABEL,
      });
    },
    handleAddLabel(record) {
      setLabelTreeDrawInfo({
        categoryId,
        categoryTemplateId,
        disabledOIds: labelTreeDrawInfo.disabledOIds,
        categoryLabelGroupId: record.id,
        visible: true,
      });
    },

    handleDeleteGroup(record) {
      ConfirmModal({
        onSure: () => {
          post('/labelGroup/delete', { id: record.id }, true).then(() => {
            onSearch();
          });
        },
      });
    },
    handleDeleteLabel(record) {
      ConfirmModal({
        onSure: () => {
          post('/labelGroup/removeLabels', { labelGroupId: record.labelGroupId, labelIdList: [record.id] }, true).then(() => {
            onSearch();
          });
        },
      });
    },

    loadData: async () => {
      const result = await resTemplateDetail({ categoryId, categoryTemplateId });
      // 作用1:子分类和子标签组装成树状结构
      // 作用2: 设置标签库页面不可选择项集合
      const disabledOIds = [];
      const data = { dataSource: loop(result.labelGroupVOList, disabledOIds) };
      console.log(1111111);
      setLabelTreeDrawInfo({ ...labelTreeDrawInfo, disabledOIds: disabledOIds });
      return data;
    },
    onSearch() {
      setParams({ random: Math.random() });
    },

    loop(objectList, disabledOIds) {
      if (!objectList) {
        return [];
      }
      objectList.forEach((item) => {
        item.isLabel = false;
        item.oid = '' + item.id;
        item.children = [];

        if (item.childList && item.childList.length) {
          item.children = item.children.concat(loop(item.childList, disabledOIds));
        }
        if (item.labelResponseList && item.labelResponseList.length) {
          item.labelResponseList.forEach((label) => {
            label.oid = 'label-' + item.id + label.id;
            label.isLabel = true;
            label.labelGroupId = item.id;
            // 设置属性库页面不可选择项集合
            disabledOIds.push('label-' + item.id + label.id);
          });
          item.children = item.children.concat(item.labelResponseList);
        }
      });
      return objectList;
    },
  });

  return (
    <>
      <Space style={{ marginBottom: 10 }}>
        <Button type='primary' onClick={handleAddGroup}>
          添加一级分组
        </Button>
      </Space>
      <Table
        bordered={false}
        rowKey='oid'
        size='small'
        onFetch={loadData}
        pagination={false}
        filters={params}
        columns={columns}
      />
      <LabelTreeDraw
        onSearch={onSearch}
        labelTreeDrawInfo={labelTreeDrawInfo}
        setLabelTreeDrawInfo={setLabelTreeDrawInfo}
      />
      <GroupModal onSearch={onSearch} groupModalInfo={groupModalInfo} setGroupModalInfo={setGroupModalInfo} />
    </>
  );
};

export default LabelConfigTab;
