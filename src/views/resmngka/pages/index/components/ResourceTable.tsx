import { propertyList } from '@/common/api/property';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { FormattingPermission, Permission } from '@/common/components/Operate/ts-config';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useMethods } from '@lhb/hook';
import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import { ResourceModalInfo, ResourceType } from '../ts-config';
import ResourceExportModal from './Modal/ResourceExportModal';
import { ControlType } from '@/common/enums/control';
import { refactorPermissions } from '@lhb/func';

const ResourceTable: FC<any> = ({
  loadData,
  onSearch,
  resourceType,
  params,
  setFilterProps,
  setActiveKey,
  setSpotParam,
  setResourceType,
  hasExportPermission,
}) => {
  const [toExportItems, setToExportItems] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [resourceModalInfo, setResourceModalInfo] = useState<ResourceModalInfo>({ visible: false });
  const [properties, setProperties] = useState<any>([]);

  const columns_place = [
    { key: 'id', title: '场地ID' },
    { key: 'name', title: '场地名称' },
    { key: 'publicName', title: '邻汇吧场地名称', render: (text) => <div style={{ minWidth: 80 }}>{text}</div> },
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
      key: 'kaCusNum',
      title: '客流量',
      render: (value, record) => {
        const kaCusNum = record.propertyValueList.filter(
          (item) => item.categoryPropertyGroupConfigIdentification === 'kaCusNum'
        );
        if (kaCusNum && kaCusNum.length) {
          const property = kaCusNum[0];
          if (property.controlType === ControlType.INPUT_NUMBER.value && property.textValue) {
            const textValue = JSON.parse(property.textValue);
            const { value, suffix } = textValue;
            return value || '' + suffix || '';
          }
          return property.textValue;
        }
        return '-';
      },
    },
    {
      key: 'kaLevel',
      title: '等级',
      width: 50,
      render: (value, record) => {
        const kaLevel = record.propertyValueList.filter(
          (item) => item.categoryPropertyGroupConfigIdentification === 'kaLevel'
        );
        if (kaLevel && kaLevel.length) {
          const property = properties.filter((property) => property.id === kaLevel[0].propertyId);
          if (property && property.length && property[0].propertyOptionList && property[0].propertyOptionList.length && kaLevel[0].textValue) {
            const selected = JSON.parse(kaLevel[0].textValue).selectedId;
            const option = property[0].propertyOptionList.filter((item) => item.id === Number(selected));
            if (option && option.length) {
              return option[0].name;
            }
          }
        }
        return '-';
      },
    },
    {
      key: 'kaCusType',
      title: '客群分类',
      render: (value, record) => {
        const kaCusType = record.propertyValueList.filter(
          (item) => item.categoryPropertyGroupConfigIdentification === 'kaCusType'
        );
        if (kaCusType && kaCusType.length) {
          const property = properties.filter((property) => property.id === kaCusType[0].propertyId);
          if (property && property.length && property[0].propertyOptionList && property[0].propertyOptionList.length && kaCusType[0].textValue) {
            const values = JSON.parse(kaCusType[0].textValue).map((item) => item.selectedId);
            const option = property[0].propertyOptionList.filter((item) => values.includes(item.id));
            let result = '';
            option.forEach((element) => {
              result += element.name + ' ';
            });
            return result;
          }
        }
        return '-';
      },
    },
    {
      key: 'kaOther',
      title: '其他资源',
      width: 100,
      render: (value, record) => {
        const kaCusType = record.propertyValueList.filter(
          (item) => item.categoryPropertyGroupConfigIdentification === 'kaOther'
        );
        if (kaCusType && kaCusType.length) {
          const property = properties.filter((property) => property.id === kaCusType[0].propertyId);
          if (property && property.length && property[0].propertyOptionList && property[0].propertyOptionList.length && kaCusType[0].textValue) {
            const values = JSON.parse(kaCusType[0].textValue).map((item) => item.selectedId);
            const option = property[0].propertyOptionList.filter((item) => values.includes(item.id));
            let result = '';
            option.forEach((element) => {
              result += element.name + ' ';
            });
            return result;
          }
        }
        return '-';
      },
    },
    {
      key: 'permissions',
      fixed: 'right',
      title: '操作',
      render: (value: Permission[], record) => (
        <Operate
          showBtnCount={5}
          operateList={refactorPermissions(value)}
          onClick={(btn: FormattingPermission) => methods[btn.func](record)}
        />
      ),
    },
  ];

  const columns_spot = [
    { key: 'id', title: '点位ID' },
    {
      key: 'name',
      title: '场地名称',
      render: (value, record) => {
        if (record.placePropertyValueList && record.placePropertyValueList.length) {
          const kaCusNum = record.placePropertyValueList.filter(
            (item) => item.categoryPropertyGroupConfigIdentification === 'name'
          );
          if (kaCusNum && kaCusNum.length) {
            return kaCusNum[0].textValue;
          }
        }

        return '-';
      },
    },
    { key: 'placePublicName', title: '邻汇吧场地名称', render: (text) => <div style={{ minWidth: 100 }}>{text}</div> },
    { key: 'name', title: '点位名称' },
    {
      key: 'kaSpotType',
      title: '展位类型',
      width: 80,
      render: (value, record) => {
        if (record && record.propertyValueList && record.propertyValueList.length) {
          const kaSpotType = record.propertyValueList.filter(
            (item) => item.categoryPropertyGroupConfigIdentification === 'kaSpotType'
          );
          if (kaSpotType && kaSpotType.length) {
            const property = properties.filter((property) => property.id === kaSpotType[0].propertyId);
            if (
              property &&
              property.length &&
              property[0].propertyOptionList &&
              property[0].propertyOptionList.length &&
              kaSpotType[0].textValue
            ) {
              const selected = JSON.parse(kaSpotType[0].textValue).selectedId;
              const option = property[0].propertyOptionList.filter((item) => item.id === Number(selected));
              if (option && option.length) {
                return option[0].name;
              }
            }
          }
        }

        return '-';
      },
    },
    {
      key: 'kaCusNum',
      title: '客流量',
      render: (value, record) => {
        if (record.placePropertyValueList && record.placePropertyValueList.length) {
          const kaCusNum = record.placePropertyValueList.filter(
            (item) => item.categoryPropertyGroupConfigIdentification === 'kaCusNum'
          );
          if (kaCusNum && kaCusNum.length) {
            const property = kaCusNum[0];
            if (property.controlType === ControlType.INPUT_NUMBER.value && property.textValue) {
              const textValue = JSON.parse(property.textValue);
              const { value, suffix } = textValue;
              return value || '' + suffix || '';
            }
            return property.textValue;
          }
        }

        return '-';
      },
    },
    {
      key: 'kaMaxArea',
      title: '最大面积（m²）',
      width: 140,
      render: (value, record) => {
        if (record.propertyValueList && record.propertyValueList.length) {
          const kaMaxArea = record.propertyValueList.filter(
            (item) => item.categoryPropertyGroupConfigIdentification === 'specLW'
          );
          if (kaMaxArea && kaMaxArea.length && kaMaxArea[0].textValue) {
            const area = JSON.parse(kaMaxArea[0].textValue).map((item) => Number(item.l) * Number(item.w));
            return area.reduce((n1, n2) => (n1 > n2 ? n1 : n2));
          }
        }

        return '-';
      },
    },
    {
      key: 'kaLevel',
      title: '等级',
      width: 50,
      render: (value, record) => {
        if (record && record.placePropertyValueList && record.placePropertyValueList.length) {
          const kaLevel = record.placePropertyValueList.filter(
            (item) => item.categoryPropertyGroupConfigIdentification === 'kaLevel'
          );
          if (kaLevel && kaLevel.length) {
            const property = properties.filter((property) => property.id === kaLevel[0].propertyId);
            if (
              property &&
              property.length &&
              property[0].propertyOptionList &&
              property[0].propertyOptionList.length &&
              kaLevel[0].textValue
            ) {
              const selected = JSON.parse(kaLevel[0].textValue).selectedId;
              const option = property[0].propertyOptionList.filter((item) => item.id === Number(selected));
              if (option && option.length) {
                return option[0].name;
              }
            }
          }
        }

        return '-';
      },
    },
    {
      key: 'kaCusType',
      title: '客群分类',
      render: (value, record) => {
        if (record && record.placePropertyValueList && record.placePropertyValueList.length) {
          const kaCusType = record.placePropertyValueList.filter(
            (item) => item.categoryPropertyGroupConfigIdentification === 'kaCusType'
          );
          if (kaCusType && kaCusType.length) {
            const property = properties.filter((property) => property.id === kaCusType[0].propertyId);
            if (
              property &&
              property.length &&
              property[0].propertyOptionList &&
              property[0].propertyOptionList.length &&
              kaCusType[0].textValue
            ) {
              const values = JSON.parse(kaCusType[0].textValue).map((item) => item.selectedId);
              const option = property[0].propertyOptionList.filter((item) => values.includes(item.id));
              let result = '';
              option.forEach((element) => {
                result += element.name + ' ';
              });
              return result;
            }
          }
        }

        return '-';
      },
    },
    {
      key: 'kaOther',
      title: '其他资源',
      width: 80,
      render: (value, record) => {
        if (record && record.placePropertyValueList && record.placePropertyValueList.length) {
          const kaCusType = record.placePropertyValueList.filter(
            (item) => item.categoryPropertyGroupConfigIdentification === 'kaOther'
          );
          if (kaCusType && kaCusType.length) {
            const property = properties.filter((property) => property.id === kaCusType[0].propertyId);
            if (
              property &&
              property.length &&
              property[0].propertyOptionList &&
              property[0].propertyOptionList.length &&
              kaCusType[0].textValue
            ) {
              const values = JSON.parse(kaCusType[0].textValue).map((item) => item.selectedId);
              const option = property[0].propertyOptionList.filter((item) => values.includes(item.id));
              let result = '';
              option.forEach((element) => {
                result += element.name + ' ';
              });
              return result;
            }
          }
        }

        return '-';
      },
    },
    {
      key: 'weekdayPrice',
      title: '工作日底价',
      render: (value, record) => {

        if (record.weekdayPrice) {
          return <div style={{ minWidth: 80 }}>{record.weekdayPrice + '元'}</div>;
        }
        if (record.weekdayPrice === 0) {
          return '0元';
        }

        return '-';
      }
    },
    {
      key: 'weekendPrice',
      title: '周末底价',
      render: (value, record) => {

        if (record.weekendPrice) {
          return <div style={{ minWidth: 80 }}>{record.weekendPrice + '元'}</div>;
        }
        if (record.weekendPrice === 0) {
          return '0元';
        }

        return '-';
      },
    },
    {
      key: 'holidayPrice',
      title: '节假日底价',
      render: (value, record) => {
        if (record.holidayPrice) {
          return <div style={{ minWidth: 80 }}>{record.holidayPrice + '元'}</div>;
        }
        if (record.holidayPrice === 0) {
          return '0元';
        }

        return '-';
      },
    },
    {
      key: 'weekPrice',
      title: '周底价',
      render: (value, record) => {
        if (record.weekPrice) {
          return <div style={{ minWidth: 80 }}>{record.weekPrice + '元'}</div>;
        }
        if (record.weekPrice === 0) {
          return '0元';
        }

        return '-';
      },
    },
    {
      key: 'monthlyPrice',
      title: '月底价',
      render: (value, record) => {
        if (record.monthlyPrice) {
          return <div style={{ minWidth: 80 }}>{record.monthlyPrice + '元'}</div>;
        }
        if (record.monthlyPrice === 0) {
          return '0元';
        }

        return '-';
      },
    },
    {
      key: 'weekdayPublicationExamplePrice',
      title: '工作日市场价',
      render: (value, record) => {
        if (record.weekdayPublicationExamplePrice) {
          return <div style={{ minWidth: 90 }}>{record.weekdayPublicationExamplePrice + '元'}</div>;
        }
        if (record.weekdayPublicationExamplePrice === 0) {
          return '0元';
        }

        return '-';
      },
    },
    {
      key: 'weekendPublicationExamplePrice',
      title: '周末市场价',
      width: 110,
      render: (value, record) => {
        if (record.weekendPublicationExamplePrice
        ) {
          return <div style={{ minWidth: 80 }}>{record.weekendPublicationExamplePrice + '元'}</div>;
        }
        if (record.weekendPublicationExamplePrice ===
 0) {
          return '0元';
        }

        return '-';
      },
    },
    {
      key: 'holidayPublicationExamplePrice',
      title: '市场价',
      render: (value, record) => {
        if (record.holidayPublicationExamplePrice) {
          return <div style={{ minWidth: 80 }}>{record.holidayPublicationExamplePrice + '元'}</div>;
        }
        if (record.holidayPublicationExamplePrice === 0) {
          return '0元';
        }

        return '-';
      },
    },
    {
      key: 'weekPublicationExamplePrice',
      title: '周市场价',
      render: (value, record) => {
        if (record.weekPublicationExamplePrice) {
          return <div style={{ minWidth: 80 }}>{record.weekPublicationExamplePrice + '元'}</div>;
        }
        if (record.weekPublicationExamplePrice === 0) {
          return '0元';
        }

        return '-';
      },
    },
    {
      key: 'monthlyPublicationExamplePrice',
      title: '月市场价',
      render: (value, record) => {
        if (record.monthlyPublicationExamplePrice) {
          return <div style={{ minWidth: 80 }}>{record.monthlyPublicationExamplePrice + '元'}</div>;
        }
        if (record.monthlyPublicationExamplePrice === 0) {
          return '0元';
        }

        return '-';
      },
    },
    {
      key: 'reportPrice',
      title: '报批费',
      render: (value, record) => {
        if (record.propertyValueList && record.propertyValueList.length) {
          const kaCurrentPrice = record.propertyValueList.filter(
            (item) => item.categoryPropertyGroupConfigIdentification === 'kaCurrentPrice'
          );
          if (kaCurrentPrice && kaCurrentPrice.length && kaCurrentPrice[0].textValue) {
            const currentPrice = JSON.parse(kaCurrentPrice[0].textValue);
            if (currentPrice?.reportPrice) {
              return <div style={{ minWidth: 80 }}>{currentPrice.reportPrice}</div>;
            }
            if (currentPrice?.reportPrice === 0) {
              return '0';
            }
          }
        }

        return '-';
      },
    },
    {
      key: 'permissions',
      title: '操作',
      fixed: 'right',
      render: (value: Permission[], record) => (
        <Operate
          showBtnCount={5}
          operateList={refactorPermissions(value)}
          onClick={(btn: FormattingPermission) => methods[btn.func](record)}
        />
      ),
    },
  ];

  const { addToExport, showExportModal, onExport, loadTpl, getTplId, getCategoryId, ...methods } = useMethods({
    addToExport() {
      const set = new Set(toExportItems.concat(selectedItems)); // 去重
      setToExportItems(Array.from(set));
    },

    showExportModal() {
      setResourceModalInfo({ toExportItems, visible: true });
    },

    // 更新
    handleUpdate(record) {
      const categoryTemplateId = getTplId();
      const categoryId = getCategoryId();
      dispatchNavigate(
        `/resmngka/detail?id=${record.id}&resourceType=${resourceType}&categoryId=${categoryId}&categoryTemplateId=${categoryTemplateId}&isKA=true`
      );
    },

    // 详情
    handleDetail(record: any) {
      const { id, categoryId, resourcePlaceId } = record;
      const newId = resourceType === 0 ? id : resourcePlaceId;
      const activeKey = resourceType === 0 ? resourceType : id;
      dispatchNavigate(`/resmng/real-detail?id=${newId}&resourceType=${resourceType}&categoryId=${categoryId}&isKA=true&activeKey=${activeKey}`);

    },

    onExport() {
      setToExportItems([]);
      setSelectedItems([]);
    },

    loadTpl: async () => {
      const result = await propertyList({});
      setProperties(result.objectList);
      setFilterProps(result.objectList);
    },

    getTplId() {
      if (Number(resourceType) === 0) {
        return process.env.KA_TPL_ID_PLACE;
      } else {
        return process.env.KA_TPL_ID_SPOT;
      }
    },
    getCategoryId() {
      if (Number(resourceType) === 0) {
        return process.env.KA_CATEGORY_ID_PLACE;
      } else {
        return process.env.KA_CATEGORY_ID_SPOT;
      }
    },
  });

  useEffect(() => {
    loadTpl();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Table
        rowKey='id'
        props={{
          size: 'small',
        }}
        filters={params}
        paginationSlot={
          resourceType === ResourceType.SPOT ? (
            <>
              <Button type='primary' onClick={addToExport}>
                加入导出列表
              </Button>
              <Button type='primary' onClick={showExportModal} style={{ marginLeft: 30 }}>
                导出列表({toExportItems.length})
              </Button>
            </>
          ) : (
            <></>
          )
        }
        {...(resourceType === ResourceType.SPOT &&
          hasExportPermission && {
          rowSelection: {
            selectedRowKeys: selectedItems.map((item) => item.id),
            onChange: (_, selectedRows) => {
              setSelectedItems(selectedRows);
            },
          },
        })}
        {...(resourceType === ResourceType.SPOT &&
          hasExportPermission && {
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
      <ResourceExportModal
        onExport={onExport}
        resourceType={resourceType}
        resourceModalInfo={resourceModalInfo}
        setResourceModalInfo={setResourceModalInfo}
        setToExportItems={setToExportItems}
        onSearch={onSearch}
      />
    </>
  );
};

export default ResourceTable;
