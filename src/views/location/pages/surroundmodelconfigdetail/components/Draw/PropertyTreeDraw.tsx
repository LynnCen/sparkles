import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { get, post } from '@/common/request';
import { Divider, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { PropertyTreeDrawProps } from '../../ts-config';
import PropertyFilters from './PropertyFilters';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import styles from '../index.module.less';
import { refactorPermissions } from '@lhb/func';

const PropertyTreeDraw: React.FC<PropertyTreeDrawProps> = ({
  onSearch,
  propertyTreeDrawInfo,
  setPropertyTreeDrawInfo,
}) => {
  const { Text } = Typography;
  const [params, setParams] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const columns = [
    {
      key: 'categoryName',
      title: '分类名称',
      render: (text) => <div className='bold'>{text}</div>
    }
  ];

  const childColumns = [
    {
      key: 'propertyAlias',
      title: '属性别名',
      width: 150,
    },
    {
      key: 'propertyCode',
      title: '属性标识',
      width: 150,
    },
    {
      key: 'op',
      title: '操作',
      render: (_, record) => {
        if (!record.isProperty) {
          return null;
        }
        if (propertyTreeDrawInfo.disabledOIds?.includes(record.oid)) {
          return <Text disabled>添加</Text>;
        }
        return (
          <Operate
            onClick={(btn) => methods[btn.func](record)}
            operateList={refactorPermissions([{ name: '添加', event: 'add' }])}
          />
        );
      },
    },
  ];

  const { loadData, onClose, onPropertySearch, ...methods } = useMethods({
    handleAdd(record) {
      const params = {
        modelId: propertyTreeDrawInfo.modelId,
        attributeId: record.propertyId,
      };
      const url = '/surround/model/attribute/add';
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
          attributes:
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
        setExpandedRowKeys(dataSource.map(item => item.oid));
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

  const expandedRowRender = (record) => {
    return (
      <div className={styles.childTable}>
        <V2Table
          rowKey='oid'
          onFetch={() => ({ dataSource: record.attributes })}
          defaultColumns={childColumns}
          pagination={false}
          hideColumnPlaceholder
          // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
          // scroll={{ y: mainHeight - 48 - 42 }}
        />
      </div>
    );
  };

  const onExpandedRowsChange = (expandedRows) => {
    setExpandedRowKeys(expandedRows);
  };

  useEffect(() => {
    console.log(111333, propertyTreeDrawInfo.disabledOIds);
    onPropertySearch({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyTreeDrawInfo.disabledOIds]);

  return (

    <V2Drawer destroyOnClose onClose={onClose} open={propertyTreeDrawInfo.visible}>
      <V2Title type='H1' text='新增属性'/>
      <Divider/>
      <V2Container
        // 容器上下padding 24 16， title的高度22 及间距48
        style={{ height: 'calc(100vh - 40px - 22px - 48px)' }}
        extraContent={{
          top: <PropertyFilters onSearch={onPropertySearch} />,

        }}>

        <div className={styles.table}>
          <V2Table
            defaultColumns={columns}
            onFetch={loadData}
            filters={params}
            onSearch={onPropertySearch}
            rowKey='oid'
            pagination={false}
            expandable={{ expandedRowRender, expandedRowKeys: expandedRowKeys, onExpandedRowsChange }}
            scroll = {{ x: 'max-content', y: 600 }}
          />
        </div>
      </V2Container>
    </V2Drawer>

  );
};
export default PropertyTreeDraw;
