import { labelClassificationList } from '@/common/api/label';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Drawer, message, Typography } from 'antd';
import React, { useState } from 'react';
import { LabelTreeDrawProps } from '../ts-config';
import { refactorPermissions } from '@lhb/func';
// import LabelFilters from './LabelFilters';

const LabelTreeDraw: React.FC<LabelTreeDrawProps> = ({
  onSearch,
  labelTreeDrawInfo,
  setLabelTreeDrawInfo,
}) => {
  const { Text } = Typography;
  const [disabled, setDisabled] = useState([]);
  const columns = [
    {
      key: 'name',
      title: '分类名称',
      width: 150,
      render: (_, record) => {
        if (record.isLabel) {
          return null;
        }
        return <Text strong>{record.name}</Text>;
      },
    },
    {
      key: 'name',
      title: '属性名称',
      render: (_, record) => {
        if (record.isLabel) {
          return record.name;
        }
        return null;
      },
    },
    {
      key: 'identification',
      title: '属性标识',
      render: (_, record) => {
        if (record.isLabel) {
          return record.identification;
        }
        return null;
      },
    },
    {
      key: 'op',
      title: '操作',
      render: (_, record) => {
        if (!record.isLabel) {
          return null;
        }
        if (labelTreeDrawInfo.disabledOIds?.includes(record.oid)) {
          return <Text disabled>添加</Text>;
        }
        return (
          <Operate
            onClick={(btn) => methods[btn.func](record)}
            operateList={refactorPermissions([{ name: '添加', event: 'add', disabled: disabled[record.id] }])}
          />
        );
      },
    },
  ];

  const { loop, loadData, onClose, ...methods } = useMethods({
    handleAdd(record) {
      const newDisabled: any = [].concat(disabled);
      newDisabled[record.id] = true;
      setDisabled(newDisabled);
      const params = {
        labelGroupId: labelTreeDrawInfo.categoryLabelGroupId,
        labelIdList: [record.id]
      };
      const url = '/labelGroup/saveLabels';
      post(url, params, true).then(() => {
        message.success(`添加分组成功`);
        onSearch();
      });
    },
    onClose() {
      setLabelTreeDrawInfo({ ...labelTreeDrawInfo, visible: false });
    },
    loadData: async () => {
      const result = await labelClassificationList({});
      return { dataSource: loop(result.objectList) };
    },
    // 子分类和子属性组装成树状结构
    loop(objectList) {
      if (!objectList) {
        return [];
      }
      objectList.forEach((item) => {
        item.isLabel = false;
        item.oid = item.id;
        item.children = [];

        if (item.childList && item.childList.length) {
          item.children = item.children.concat(loop(item.childList));
        }
        if (item.labelResponseList && item.labelResponseList.length) {
          item.labelResponseList.forEach((label) => {
            label.oid = 'label-' + label.id;
            label.isLabel = true;
          });
          item.children = item.children.concat(item.labelResponseList);
        }
      });
      return objectList;
    },
  });

  return (
    <Drawer title={'新增标签'} size='large' onClose={onClose} open={labelTreeDrawInfo.visible}>
      {/* <LabelFilters /> */}
      <Table bordered={false} rowKey='oid' size='small' onFetch={loadData} pagination={false} columns={columns} />
    </Drawer>
  );
};
export default LabelTreeDraw;
