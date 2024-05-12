import React from 'react';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { Image } from 'antd';

import { get, post } from '@/common/request';
import { useMethods } from '@lhb/hook';
import { PlusOutlined } from '@ant-design/icons';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import ShowMore from '@/common/components/Data/ShowMore';
import { refactorPermissions } from '@lhb/func';

const CategoryList: React.FC<any> = ({ filters, setOperateList, setOperateCategory, setOperateProperty, onSearch }) => {
  const columns = [
    {
      title: '分类名称',
      key: 'categoryName',
      width: 120,
      render: (value: any) => <div className='bold'>{value}</div>,
    },
    { title: '属性名称', key: 'propertyName', width: 120, render: (text) => <ShowMore maxWidth='200px' text={text} /> },
    { title: '属性别名', key: 'propertyAlias', width: 120, render: (text) => <ShowMore maxWidth='200px' text={text} /> },
    { title: '属性标识', key: 'propertyCode', width: 120, render: (text) => <ShowMore maxWidth='200px' text={text} /> },
    {
      title: 'ICON图',
      key: 'propertyIcon',
      width: 120,
      render: (value) => (value ? <Image width={100} src={value} /> : ''),
    },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      width: 200,
      render: (value: any, record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value)}
          onClick={(btn: any) => {
            methods[btn.func](record);
          }}
        />
      ),
    },
  ];

  const { ...methods } = useMethods({
    handleUpdate(record) {
      if (record.isCategory) {
        setOperateCategory({
          visible: true,
          id: record.categoryId,
          name: record.categoryName,
          code: record.categoryCode,
        });
      } else {
        setOperateProperty({
          visible: true,
          id: record.propertyId,
          categoryId: record.categoryId,
          name: record.propertyName,
          code: record.propertyCode,
          aliaName: record.propertyAlias,
          icon: record.propertyIcon,
        });
      }
    },
    handleCreate(record) {
      setOperateProperty({
        visible: true,
        categoryId: record.categoryId,
      });
    },
    handleDelete(record) {
      if (record.isCategory) {
        ConfirmModal({
          onSure: (modal) => {
            post('/shop/category/delete', { id: record.categoryId }, { proxyApi: '/blaster' }).then(() => {
              modal.destroy();
              onSearch();
            });
          },
        });
      } else {
        ConfirmModal({
          onSure: (modal) => {
            post('/shop/attribute/delete', { id: record.propertyId }, { proxyApi: '/blaster' }).then(() => {
              modal.destroy();
              onSearch();
            });
          },
        });
      }
    },
  });

  const loadData = async (params: any) => {
    // https://yapi.lanhanba.com/project/462/interface/api/45142
    const data = await get(
      '/shop/category/list',
      { ...params },
      { proxyApi: '/blaster', needCancel: false, isMock: false, needHint: true, mockId: 462 }
    );

    if (data.meta && data.meta.permissions && data.meta.permissions.length) {
      const list = refactorPermissions(data.meta.permissions);
      const operateList = list.map((item) => {
        const res: any = {
          name: item.text,
          event: item.event,
          func: item.func,
          type: item.isBatch ? 'default' : 'primary',
        };
        if (item.event === 'create') {
          res.icon = <PlusOutlined />;
        }
        return res;
      });
      setOperateList(operateList);
    }

    if (data.objectList && data.objectList.length) {
      const dataSource = data.objectList.map((item) => ({
        key: 'category' + item.id,
        isCategory: true,
        categoryName: item.name,
        categoryId: item.id,
        categoryCode: item.code,
        permissions: item.permissions,
        children:
          item.attributeList && item.attributeList.length
            ? item.attributeList.map((property) => ({
              key: 'property' + property.id,
              isCategory: false,
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
  };

  return (
    <>
      <Table filters={filters} rowKey='key' columns={columns} onFetch={loadData} pagination={false} />
    </>
  );
};

export default CategoryList;
