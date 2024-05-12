import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { get, post } from '@/common/request';
import { Drawer, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { PropertyTreeDrawProps } from '../../ts-config';
import PropertyFilters from './PropertyFilters';
import ShowMore from '@/common/components/Data/ShowMore';
import { refactorPermissions } from '@lhb/func';

const PropertyTreeDraw: React.FC<PropertyTreeDrawProps> = ({
  onSearch,
  propertyTreeDrawInfo,
  setPropertyTreeDrawInfo,
}) => {
  const { Text } = Typography;
  const [disabled, setDisabled] = useState<any>([]);
  const columns = [
    {
      key: 'sort',
    },
    {
      key: 'categoryName',
      title: '分类名称',
      width: 150,
      render: (text) => <ShowMore maxWidth='200px' text={text} />
    },
    {
      key: 'propertyAlias',
      title: '属性别名',
      width: 150,
      render: (text) => <ShowMore maxWidth='200px' text={text} />
    },
    {
      key: 'propertyCode',
      title: '属性标识',
      width: 150,
      render: (text) => <ShowMore maxWidth='200px' text={text} />
    },
    {
      key: 'op',
      title: '操作',
      render: (_, record) => {
        if (!record.isProperty) {
          return null;
        }
        if (disabled?.includes(record.oid) || propertyTreeDrawInfo.disabledOIds?.includes(record.oid)) {
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

  const [params, setParams] = useState({});

  const { loadData, onClose, onPropertySearch, ...methods } = useMethods({
    handleAdd(record) {
      const newDisabled: any = [].concat(disabled);
      newDisabled.push(record.propertyId);
      setDisabled(newDisabled);
      const params = {
        modelId: propertyTreeDrawInfo.modelId,
        attributeId: record.propertyId,
      };
      const url = '/shop/model/attribute/add';
      post(url, params, { proxyApi: '/blaster' }).then(() => {
        message.success(`已添加成功`);
        onSearch();
      });
    },
    onClose() {
      setPropertyTreeDrawInfo({ ...propertyTreeDrawInfo, visible: false });
    },
    loadData: async (params) => {
      // https://yapi.lanhanba.com/project/462/interface/api/45142
      const data = await get(
        '/shop/category/list',
        { ...params },
        { proxyApi: '/blaster', needCancel: false, isMock: false, needHint: true, mockId: 462 }
      );

      if (data.objectList && data.objectList.length) {
        const dataSource = data.objectList.map((item) => ({
          oid: 'category-' + item.id,
          isProperty: false,
          categoryName: item.name,
          categoryId: item.id,
          categoryCode: item.code,
          permissions: item.permissions,
          children:
            item.attributeList && item.attributeList.length
              ? item.attributeList.map((property) => ({
                oid: property.id,
                isProperty: true,
                propertyId: property.id,
                categoryId: item.id,
                propertyName: property.name,
                propertyAlias: property.aliaName,
                propertyCode: property.code,
                propertyIcon: property.icon,
                permissions: property.permissions,
              }))
              : [],
        }));
        return {
          dataSource: dataSource,
          count: 0,
        };
      } else {
        return {
          dataSource: [],
          count: 0,
        };
      }
    },
    // 查询/重置
    onPropertySearch(filter: any) {
      setParams({ ...params, ...filter });
    },
  });

  useEffect(() => {
    setDisabled([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyTreeDrawInfo.disabledOIds]);

  return (
    <Drawer destroyOnClose title={'新增属性'} size='large' onClose={onClose} zIndex={100} open={propertyTreeDrawInfo.visible}>
      {/* <PropertyFilters /> */}
      <PropertyFilters onSearch={onPropertySearch} />
      <Table
        bordered={false}
        rowKey='oid'
        size='small'
        onFetch={loadData}
        filters={params}
        pagination={false}
        columns={columns}
        onSearch={onPropertySearch}
        defaultExpendAll={true}
        scroll = {{ x: 'max-content', y: 600 }}
      />
    </Drawer>
  );
};
export default PropertyTreeDraw;
