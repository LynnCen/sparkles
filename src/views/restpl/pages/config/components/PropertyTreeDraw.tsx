import { propertyClassificationList } from '@/common/api/property';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Drawer, message, Typography } from 'antd';
import React, { useState } from 'react';
import { PropertyTreeDrawProps } from '../ts-config';
import PropertyFilters from './PropertyFilters';
import { refactorPermissions, urlParams } from '@lhb/func';
import { OnlyLocation } from '@/common/enums/control';

const PropertyTreeDraw: React.FC<PropertyTreeDrawProps> = ({
  onSearch,
  propertyTreeDrawInfo,
  setPropertyTreeDrawInfo,
}) => {
  const { Text } = Typography;
  // const id = urlParams(location.search)?.id || '';
  const useType :string=urlParams(location.search).useType;

  const [disabled, setDisabled] = useState([]);
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
        if (propertyTreeDrawInfo.disabledOIds?.includes(record.oid)) {
          return <Text disabled>添加</Text>;
        }
        
        const disabled=()=>{
          // 如果模板来源为 2（location） 且属性类型为 27（子表单） 时，不可添加
          if(useType !=='2' && OnlyLocation.includes(record.controlType)){
            return true
          }else{ // 否则按原逻辑
            return disabled[record.id]
          }
        }
        
        return (
          <Operate
            onClick={(btn) => methods[btn.func](record)}
            operateList={refactorPermissions([{ name: '添加', event: 'add', disabled: disabled()}])}
          />
        );
      },
    },
  ];

  const [params, setParams] = useState({});
  const [filterOptions, setFilterOptions] = useState<any>([]);

  const { loop, loadData, onClose, setFilterInfo, debounceAdd, onPropertySearch, ...methods } = useMethods({
    handleAdd(record) {
      const newDisabled: any = [].concat(disabled);
      newDisabled[record.id] = true;
      setDisabled(newDisabled);
      const params = {
        categoryId: propertyTreeDrawInfo.categoryId,
        categoryTemplateId: propertyTreeDrawInfo.categoryTemplateId,
        categoryPropertyGroupId: propertyTreeDrawInfo.categoryPropertyGroupId,
        propertyId: record.id,
        propertyClassificationId: record.propertyClassificationId,
        name: record.name,
        identification: record.identification,
        controlType: record.controlType,
        required: record.required,
        duplicate: record.duplicate,
        superposition: record.superposition,
        restriction: record.restriction,
        ...(record.propertyOptionList && {
          propertyConfigOptionRequestList: record.propertyOptionList.map((item) => ({ name: item.name })),
        }),
      };
      const url = '/propertyGroup/saveProperty';
      post(url, params, true).then(() => {
        message.success(`添加属性成功`);
        onSearch();
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

  return (
    <Drawer title={'新增属性'} size='large' onClose={onClose} open={propertyTreeDrawInfo.visible} width={1000}>
      {/* <PropertyFilters /> */}
      <PropertyFilters onSearch={onPropertySearch} filterOptions={filterOptions} />
      <Table
        bordered={false}
        rowKey='oid'
        size='small'
        wrapStyle={{maxHeight: 'calc(100vh - 191px'}}
        onFetch={loadData}
        filters={params}
        pagination={false}
        columns={columns}
        onSearch={onPropertySearch}
        defaultExpendAll={true}
      />
    </Drawer>
  );
};
export default PropertyTreeDraw;
