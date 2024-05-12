import { propertyList } from '@/common/api/property';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { FormattingPermission, Permission } from '@/common/components/Operate/ts-config';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useMethods } from '@lhb/hook';
import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import { ResourceModalInfo, ResourceType } from '../ts-config';
import ResourceMergeModal from './Modal/ResourceMergeModal';
import { refactorPermissions } from '@lhb/func';

const ResourceTable: FC<any> = ({
  loadData,
  onSearch,
  resourceType,
  params,
  categoryChooseModalInfo,
  setCategoryChooseModalInfo,
  setActiveKey,
  setSpotParam,
  setResourceType,
}) => {
  const [toMergeItems, setToMergeItems] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [resourceModalInfo, setResourceModalInfo] = useState<ResourceModalInfo>({ visible: false });
  const [properties, setProperties] = useState<any>([]);

  const columns_place = [
    { key: 'id', title: '场地ID', width: 100 },
    { key: 'name', title: '场地名称', with: 300 },
    { key: 'categoryName', title: '场地类型', width: 80 },
    {
      key: 'spotCount',
      title: '点位数',
      width: 80,
      render: (value, record) => {
        return (
          <Button
            type='link'
            onClick={() => {
              setActiveKey('1');
              setSpotParam({ placeId: record.id });
              setResourceType(ResourceType.SPOT);
            }}
          >
            {value}
          </Button>
        );
      },
    },
    {
      key: 'placeContacts',
      title: '场地联系人',
      width: 100,
      render: (value, record) => renderPropertyColumn(record, 'placeContacts')
    },
    {
      key: 'placePersonInCharge',
      title: '场地负责人',
      width: 100,
      render: (value, record) => renderPropertyColumn(record, 'placePersonInCharge')
    },
    {
      key: 'managerName',
      title: '管理方',
      render: (value, record) => renderPropertyColumn(record, 'managerName')
    },
    {
      key: 'address',
      title: '详细地址',
      render: (value, record) => renderPropertyColumn(record, 'address')
    },
    {
      key: 'status',
      title: '状态',
      render: (_, record) => (record.status === 2 ? '已通过' : '待完善'),
    },
    {
      key: 'gmtModified',
      title: '更新时间',
      width: 200,
      render: (_, record) => record.gmtModified?.replace('T', ' ') || '',
    },
    {
      key: 'permissions',
      fixed: 'right',
      title: '操作',
      render: (value: Permission[], record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value)}
          onClick={(btn: FormattingPermission) => methods[btn.func](record)}
        />

      ),
    },
  ];

  const columns_spot = [
    { key: 'id', title: '点位ID', width: 100 },
    { key: 'placeName', title: '所属场地' },
    { key: 'name', title: '点位名称' },
    { key: 'categoryName', title: '点位类型' },
    {
      key: 'spotCode',
      title: '点位编号',
      render: (value, record) => renderPropertyColumn(record, 'spotCode')
    },
    {
      key: 'spotFloor',
      title: '楼层数',
      width: 80,
      render: (value, record) => renderPropertyColumn(record, 'spotFloor')
    },
    {
      key: 'spotTotalArea',
      title: '总面积（m²）',
      width: 120,
      render: (value, record) => renderPropertyColumn(record, 'spotTotalArea')
    },
    {
      key: 'stallPosition',
      title: '摆摊位置',
      render: (value, record) => renderPropertyColumn(record, 'stallPosition')
    },
    {
      key: 'status',
      title: '状态',
      width: 200,
      render: (_, record) => (record.status === 2 ? '已通过' : '待完善'),
    },
    {
      key: 'gmtModified',
      title: '更新时间',
      width: 200,
      render: (_, record) => record.gmtModified?.replace('T', ' ') || '',
    },
    {
      key: 'permissions',
      fixed: 'right',
      title: '操作',
      width: 200,
      render: (value: Permission[], record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value)}
          onClick={(btn: FormattingPermission) => methods[btn.func](record)}
        />
      ),
    },
  ];

  const { addToMerge, showMergeModal, onMerge, loadTpl, renderPropertyColumn, ...methods } = useMethods({
    addToMerge() {
      const set = new Set(toMergeItems.concat(selectedItems)); // 去重
      setToMergeItems(Array.from(set));
    },

    showMergeModal() {
      setResourceModalInfo({ toMergeItems, visible: true });
    },


    // 详情
    handleDetail(record: any) {
      const { id, categoryId, resourcePlaceId } = record;
      const newId = resourceType === 0 ? id : resourcePlaceId;
      const activeKey = resourceType === 0 ? resourceType : id;
      dispatchNavigate(`/resmng/real-detail?id=${newId}&resourceType=${resourceType}&categoryId=${categoryId}&isKA=false&activeKey=${activeKey}`);
    },

    // 新增点位
    handleCreateSpot(record) {
      setCategoryChooseModalInfo({
        ...categoryChooseModalInfo,
        resourceType: ResourceType.SPOT,
        visible: true,
        placeId: record.id,
      });
    },
    onMerge() {
      setToMergeItems([]);
      setSelectedItems([]);
    },
    loadTpl: async () => {
      const result = await propertyList({});
      setProperties(result.objectList);
    },
    // 属性展示列
    renderPropertyColumn: (record: any, identification: string) => {
      const propertyList = record.propertyValueList.filter(
        (item) => item.categoryPropertyGroupConfigIdentification === identification
      );
      if (propertyList && propertyList.length) {
        const controlType = propertyList[0].controlType;
        const textValue = propertyList[0].textValue;
        if (controlType === 1 || controlType === 2) {
          // 单选、多选类型，value为json，匹配到option后展示
          if (textValue) {
            const obj = JSON.parse(textValue);
            const property = properties.filter((property) => property.id === propertyList[0].propertyId);
            if (property && property.length && property[0].propertyOptionList && property[0].propertyOptionList.length) {
              const option = property[0].propertyOptionList.filter((item) => item.id === Number(obj.selectedId));
              if (option && option.length) {
                // console.log('匹配后展示', identification, option[0].name);
                return option[0].name;
              }
            }
          }
        } else if (controlType === 10) {
          // 地址类型
          const addressJson = JSON.parse(textValue);
          return addressJson?.address;
        } else {
          // 其他，直接展示
          return textValue;
        }
      }
      return '-';
    }
  });

  useEffect(() => {
    loadTpl();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Table
        rowKey='id'
        wrapStyle ={{ maxHeight: 'auto' }}
        props={{
          size: 'small',
        }}
        filters={params}
        paginationSlot={
          resourceType === ResourceType.PLACE ? (
            <>
              <Button type='primary' onClick={addToMerge}>
                加入待合并项目
              </Button>
              <Button type='primary' onClick={showMergeModal} style={{ marginLeft: 30 }}>
                待合并项目({toMergeItems.length})
              </Button>
            </>
          ) : (
            <></>
          )
        }
        {...(resourceType === ResourceType.PLACE && {
          rowSelection: {
            selectedRowKeys: selectedItems.map((item) => item.id),
            onChange: (_, selectedRows) => {
              setSelectedItems(selectedRows);
            },
          },
        })}
        onFetch={loadData}
        pagination={true}
        columns={resourceType === ResourceType.PLACE ? columns_place : columns_spot}
      />
      <ResourceMergeModal
        onMerge={onMerge}
        resourceType={resourceType}
        resourceModalInfo={resourceModalInfo}
        setResourceModalInfo={setResourceModalInfo}
        onSearch={onSearch}
      />
    </>
  );
};

export default ResourceTable;
