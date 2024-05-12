import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { Divider, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid'; // 用来生成不重复的key
import PropertyFilters from './PropertyFilters';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import styles from '../index.module.less';
import { refactorPermissions, urlParams } from '@lhb/func';
import { SUB_FORM_SUPPORT_CONTROL_TYPE } from '@/common/enums/control';
import { propertyClassificationList } from '@/common/api/property';
import { OnlyLocation } from '@/common/enums/control';

export interface PropertyTreeDrawInfo {
  visible: boolean;
  propertyId?: React.Key;
  propertyConfigId: React.Key;
}


export interface PropertyTreeDrawProps {
  onAddRow: Function;
  setPropertyTreeDrawInfo: Function;
  propertyTreeDrawInfo: PropertyTreeDrawInfo;
}


const PropertyTreeDraw: React.FC<PropertyTreeDrawProps> = ({
  onAddRow,
  propertyTreeDrawInfo,
  setPropertyTreeDrawInfo,
}) => {
  const useType: string = urlParams(location.search).useType;
  const { Text } = Typography;
  const [params, setParams] = useState({});
  const [filterOptions, setFilterOptions] = useState<any>([]);
  const columns = [
    {
      key: 'name',
      title: '分类名称',
      width: 150,
      render: (_, record) => {
        if (record.isProperty) {
          return null;
        }
        return <Text strong>{record.name}</Text>;
      },
    },
    {
      key: 'name',
      title: '属性名称',
      render: (_, record) => {
        if (record.isProperty) {
          return record.name;
        }
        return null;
      },
    },
    {
      key: 'identification',
      title: '属性标识',
      render: (_, record) => {
        if (record.isProperty) {
          return record.identification;
        }
        return null;
      },
    },
    {
      key: 'op',
      title: '操作',
      render: (_, record) => {
        if (!record.isProperty) {
          return null;
        }
        if (!SUB_FORM_SUPPORT_CONTROL_TYPE?.includes(record.controlType)) {
          return <Text disabled>添加</Text>;
        }

        const disabled = () => {
          // 如果模板来源为 2（location） 且属性类型为 27（子表单） 时，不可添加
          if (useType !== '2' && OnlyLocation.includes(record.controlType)) {
            return true
          } else { // 否则按原逻辑
            return disabled[record.id]
          }
        }

        return (
          <Operate
            onClick={(btn) => methods[btn.func](record)}
            operateList={refactorPermissions([{ name: '添加', event: 'add', disabled: disabled() }])}
          />
        );
      },
    },
  ];

  const { loop, setFilterInfo, loadData, onClose, onPropertySearch, ...methods } = useMethods({
    handleAdd(record: any) {
      onAddRow({
        rowKey: v4(),// 列表唯一值，无其他用
        propertyConfigId: propertyTreeDrawInfo.propertyConfigId,
        ...record,
        propertyId: record.id,
        id: null // 新增时，id为空，编辑时用后端返回的 id
      });
    },
    onClose() {
      setPropertyTreeDrawInfo({ ...propertyTreeDrawInfo, visible: false });
    },
    loadData: async (params) => {
      const result = await propertyClassificationList(params);
      setFilterInfo(params, result.objectList);
      return { dataSource: loop(result.objectList) };
    },
    setFilterInfo(params, objectList) {
      if (params.propertyKeyWord === undefined && params.propertyClassificationId === undefined) {
        setFilterOptions(objectList.map((item) => ({ value: item.id, label: item.name })));
      }
    },
    // 子分类和子属性组装成树状结构
    loop(objectList) {
      if (!objectList) {
        return [];
      }
      objectList.forEach((item) => {
        item.isProperty = false;
        item.oid = item.id;
        item.children = [];

        if (item.childList && item.childList.length) {
          item.children = item.children.concat(loop(item.childList));
        }
        if (item.propertyResponseList && item.propertyResponseList.length) {
          item.propertyResponseList.forEach((property) => {
            property.oid = 'property-' + property.id;
            property.isProperty = true;
          });
          item.children = item.children.concat(item.propertyResponseList);
        }
      });
      return objectList;
    },
    // 查询/重置
    onPropertySearch(filter: any) {
      setParams({ ...params, ...filter });
    },
  });

  useEffect(() => {
    onPropertySearch({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyTreeDrawInfo]);

  return (
    <V2Drawer destroyOnClose onClose={onClose} open={propertyTreeDrawInfo.visible}>
      <V2Title type='H1' text='添加字段' />
      <Divider />
      <V2Container
        // 容器上下padding 24 16， title的高度22 及间距48
        style={{ height: 'calc(100vh - 40px - 22px - 48px)' }}
        extraContent={{
          top: <PropertyFilters onSearch={onPropertySearch} filterOptions={filterOptions} />,
        }}>

        <div className={styles.table}>
          <V2Table
            defaultColumns={columns}
            onFetch={loadData}
            filters={params}
            onSearch={onPropertySearch}
            rowKey='oid'
            pagination={false}
            scroll={{ x: 'max-content', y: 600 }}
          />
        </div>
      </V2Container>
    </V2Drawer>

  );
};
export default PropertyTreeDraw;
