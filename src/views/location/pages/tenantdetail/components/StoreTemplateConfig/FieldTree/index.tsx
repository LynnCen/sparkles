/**
 * @Description 添加字段弹窗页
 * 该页面废弃，已迁移至src/common/business/Location/SelectPropertyModal/index.tsx
 * 该页面暂时保留，方便追溯
 */
import { dynamicPropertyList } from '@/common/api/property';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { isArray, refactorPermissions } from '@lhb/func';
import { post } from '@/common/request';
import { Modal, message, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import FieldFilters from './Filter';

const FieldTreeDraw: React.FC<any> = ({
  templateId,
  onSearch,
  propertyTreeDrawInfo,
  setPropertyTreeDrawInfo,
  setExpandedRowKeys,
}) => {
  const { Text } = Typography;
  const columns = [
    {
      key: 'name',
      title: '分类名称',
      width: 180,
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
      width: 180,
      render: (_, record) => {
        if (record.isProperty) {
          return record.name;
        }
        return null;
      },
    },
    {
      key: 'identification',
      title: '说明',
      width: 200,
      render: (_, record) => {
        if (record.isProperty) {
          return record.propertyOptionList ? record.propertyOptionList.map((item) => item.name).join('、') : '-';
        }
        return null;
      },
    },
    {
      key: 'op',
      title: '操作',
      align: 'center',
      render: (_, record) => {
        if (!record.isProperty) {
          return null;
        }
        // if (propertyTreeDrawInfo.disabledOIds?.includes(record.propertyId)) {
        //   return (
        //     <Text style={{ paddingRight: '15px' }} disabled>
        //       添加
        //     </Text>
        //   );
        // }
        // return (
        //   <Operate
        //     onClick={(btn) => methods[btn.func](record)}
        //     operateList={refactorPermissions([{ name: '添加', event: 'add' }])}
        //   />
        // );
        /**
         * https://confluence.lanhanba.com/pages/viewpage.action?pageId=98207281
         * 20230824版本逻辑变更，一个字段在一个二级菜单下不可重复添加，但是在不同二级菜单下可重复添加
         * 定制逻辑：踩点组件、周边查询组件、详细地址组件只允许添加一次(controlType对应的值是10、25、26)
         * controlType定义于src/common/enums/control.ts
         */
        return (
          <Operate
            onClick={(btn) => methods[btn.func](record)}
            operateList={refactorPermissions([{
              name: '添加',
              event: 'add',
              disabled: curSecondGroupPropertyIds.includes(record.propertyId)
            }])}
          />
        );
      },
    },
  ];
  const addLockRef = useRef(false);
  const [params, setParams] = useState({});
  const [filterOptions, setFilterOptions] = useState<any>([]);
  // 当前弹窗下添加的属性id
  const [curAddPropertyIds, setCurAddPropertyIds] = useState<number[]>([]);
  // 当前二级菜单分组下已添加的所有字段的属性id
  const curSecondGroupPropertyIds = useMemo(() => {
    const { rowData, customComIds } = propertyTreeDrawInfo;
    const alreadyExistIds = [...curAddPropertyIds, ...(isArray(customComIds) ? customComIds : [])];
    const { children } = rowData || {};
    if (isArray(children) && children.length) {
      return children.map((item) => item.propertyId).concat(alreadyExistIds);
    }
    return alreadyExistIds;
  }, [propertyTreeDrawInfo, curAddPropertyIds]);

  const { loadData, onClose, setFilterInfo, onPropertySearch, ...methods } = useMethods({
    handleAdd(record) {
      // 加锁
      if (addLockRef.current) return;
      addLockRef.current = true;
      const params = {
        templateId,
        propertyConfigRequestList: [
          {
            ...record,
            categoryId: propertyTreeDrawInfo.categoryId,
            categoryTemplateId: propertyTreeDrawInfo.categoryTemplateId,
            categoryPropertyGroupId: propertyTreeDrawInfo.categoryPropertyGroupId,
          },
        ],
      };
      const url = '/dynamic/property/add';
      post(url, params, { proxyApi: '/blaster' }).then(() => {
        message.success(`添加字段成功`);
        // 记录添加的属性id
        setCurAddPropertyIds((state) => ([...state, record.propertyId]));
        onSearch();
        // @ts-ignore
        setExpandedRowKeys((state) => [...state, propertyTreeDrawInfo.rowKey]);
      }).finally(() => {
        addLockRef.current = false;
      });
    },
    onClose() {
      setPropertyTreeDrawInfo({ ...propertyTreeDrawInfo, visible: false });
      setCurAddPropertyIds([]); // 清空当前操作的数据
    },
    loadData: async (params) => {
      const result = await dynamicPropertyList(params);
      setFilterInfo(params, result);
      if (result && result.length) {
        const dataSource = result.map((item) => {
          const newData = {
            ...item,
            oid: 'category-' + item.id,
            isProperty: false,
            name: item.name,
            categoryId: item.id,
            categoryCode: item.code,
            permissions: item.permissions,
            children:
              item.propertyVOList && item.propertyVOList.length
                ? item.propertyVOList.map((property) => {
                  return {
                    ...property,
                    oid: 'property-' + property.id,
                    isProperty: true,
                    propertyId: property.id,
                    categoryId: item.id,
                    name: property.name,
                    permissions: property.permissions,
                    propertyOptionList: property.propertyOptionList,
                  };
                })
                : [],
          };
          delete item.propertyVOList;
          return newData;
        });
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
    setFilterInfo(params, objectList) {
      if (params.propertyKeyWord === undefined && params.propertyClassificationId === undefined) {
        setFilterOptions(objectList.map((item) => ({ value: item.id, label: item.name })));
      }
    },

    // 查询/重置
    onPropertySearch(filter: any) {
      setParams({ ...params, ...filter });
    },
  });

  return (
    <Modal width={800} title={'添加字段'} onCancel={onClose} onOk={onClose} open={propertyTreeDrawInfo.visible}>
      {/* <PropertyFilters /> */}
      <FieldFilters onSearch={onPropertySearch} filterOptions={filterOptions} />
      <Table
        bordered={false}
        rowKey='oid'
        size='small'
        wrapStyle={{ maxHeight: '500px' }}
        onFetch={loadData}
        filters={params}
        pagination={false}
        columns={columns}
        onSearch={onPropertySearch}
        defaultExpendAll={true}
      />
    </Modal>
  );
};
export default FieldTreeDraw;
