import { propertyClassificationList } from '@/common/api/property';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { PlusOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import { FC, useMemo, useState } from 'react';
import Filters from './components/Filters';
import PropertyClassificationModal from './components/Modal/PropertyClassificationModal';
import PropertyDraw from './components/PropertyDraw';
import styles from './entry.module.less';
import { PropertyClassificationModalInfo, PropertyDrawInfo } from './ts-config';
import { KeepAlive } from 'react-activation';
import V2Table from '@/common/components/Data/V2Table';
import V2Operate from '@/common/components/Others/V2Operate';
import V2Container from '@/common/components/Data/V2Container';
import { getKeysFromObjectArray, refactorPermissions } from '@lhb/func';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

const Property: FC<any> = () => {
  const { Text } = Typography;
  const [innerMainHeight, setInnerMainHeight] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]); // 展开的行
  const columns = [
    {
      key: 'name',
      title: '分类名称',
      dragChecked: true,
      dragDisabled: true,
      fixed: 'left',
      expandable: false,
      render: (_, record) => {
        if (record.isProperty) {
          return null;
        } else {
          return <Text strong className={styles.rowName}>{record.name}</Text>;
        }
      },
    },
    {
      key: 'propertyName',
      title: '属性名称',
      dragChecked: true,
      render: (_, record) => {
        if (record.isProperty) {
          return record.name;
        } else {
          return null;
        }
      },
    },
    {
      key: 'identification',
      title: '属性标识',
      dragChecked: true,
      render: (_, record) => {
        if (record.isProperty) {
          return record.identification;
        } else {
          return null;
        }
      },
    },
    {
      key: 'option',
      title: '属性配置',
      dragChecked: true,
      render: (_, record) => {
        if (record.isProperty) {
          if (record.controlType === 1 || record.controlType === 2) {
            if (record.propertyOptionList && record.propertyOptionList.length) {
              const option = record.propertyOptionList
                .map((item) => {
                  return item.name;
                })
                .join('、');
              return (
                <Tooltip title={option}>
                  <span>{option.substr(0, 20)}</span>
                </Tooltip>
              );
            }
          }
          if (record.controlType === 9) {
            if (record.restriction && record.restriction.includes('value')) {
              const value = JSON.parse(record.restriction).value;
              if (value === 1) {
                return '时间点（年，月，日）';
              }
              if (value === 2) {
                return '时间点（时，分，秒）';
              }
              if (value === 3) {
                return '时间段（年，月，日）';
              }
              if (value === 4) {
                return '时间段（时，分，秒）';
              }
            }
          }
          return '';
        } else {
          return null;
        }
      },
    },
    {
      key: 'remark',
      title: '备注',
      dragChecked: true,
      render: (_, record) => {
        if (record.isProperty) {
          return _;
        } else {
          return null;
        }
      },
    },
    {
      title: '操作',
      key: 'permissions',
      dragChecked: true,
      dragDisabled: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <V2Operate
            operateList={refactorPermissions(_)}
            onClick={(btn: any) => methods[btn.func](record)}
          />
        );
      },
    },
  ];
  const [params, setParams] = useState({});
  const [filterOptions, setFilterOptions] = useState<any>([]);
  // 操作按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const [propertyClassificationModalInfo, setPropertyClassificationModalInfo] =
    useState<PropertyClassificationModalInfo>({ visible: false });
  const [propertyDrawInfo, setPropertyDrawInfo] = useState<PropertyDrawInfo>({ visible: false });
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
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
  }, [operateExtra]);

  const methods = useMethods({
    loadData: async (params) => {
      const result = await propertyClassificationList(params);
      methods.setFilterInfo(params, result.objectList);
      setOperateExtra(result?.meta?.permissions || []);
      const data = methods.loop(result.objectList);
      if (params.propertyKeyWord) { // 如果有搜索关键字，展开有children字段的行
        const _expandedRowKeys = data.filter(item => item.children.length);
        setExpandedRowKeys(getKeysFromObjectArray(_expandedRowKeys, 'oid'));
      } else { // 没有默认不展开
        setExpandedRowKeys([]);
      }
      return { dataSource: data };
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
          item.children = item.children.concat(methods.loop(item.childList));
        }
        if (item.propertyResponseList && item.propertyResponseList.length) {
          item.propertyResponseList.forEach((property) => {
            property.oid = 'property-' + property.id;
            property.isProperty = true;
            property.propertyName = property.name;
          });
          item.children = item.children.concat(item.propertyResponseList);
        }
      });
      return objectList;
    },
    handleCreateClassification() {
      setPropertyClassificationModalInfo({ visible: true });
    },
    handleUpdateClassification(record) {
      setPropertyClassificationModalInfo({ ...record, visible: true });
    },
    handleDeleteClassification(record) {
      V2Confirm({
        onSure: () => {
          post('/propertyClassification/delete', { id: record.id }, true).then(() => {
            methods.onSearch();
          });
        },
        content: '此操作将永久删除该数据, 是否继续？'
      });
    },
    handleCreateProperty(record) {
      setPropertyDrawInfo({ propertyClassificationId: record.id, visible: true });
    },
    handleUpdate(record) {
      setPropertyDrawInfo({
        propertyClassificationId: record.propertyClassificationId,
        ...record,
        visible: true,
      });
    },
    handleDelete(record) {
      V2Confirm({
        onSure: (modal) => {
          post('/property/delete', { id: record.id }, true).then(() => {
            modal.destroy();
            methods.onSearch();
          });
        },
        content: '此操作将永久删除该数据, 是否继续？'
      });
    },

    // 查询/重置
    onSearch(filter: any) {
      setParams({ ...params, ...filter });
    },

    setFilterInfo(params, objectList) {
      if (params.propertyKeyWord === undefined && params.propertyClassificationId === undefined) {
        setFilterOptions(objectList.map((item) => ({ value: item.id, label: item.name })));
      }
    },
    onExpand(expanded, record) {
      const key = record['oid'];
      const arr = expandedRowKeys.slice();
      const targetIndex = arr.findIndex((item) => item === record['oid']);
      if (expanded) {
        arr.push(key);
      } else {
        arr.splice(targetIndex, 1);
      }
      setExpandedRowKeys(arr);
    }
  });


  return (
    // <KeepAlive saveScrollPosition>
    <div className={styles.container}>
      <V2Container
        style={{ height: 'calc(100vh - 120px)' }}
        emitMainHeight={(h) => setInnerMainHeight(h)}
        extraContent={{
          top: <>
            <Filters onSearch={methods.onSearch} filterOptions={filterOptions} />
            <div style={{ marginBottom: '10px' }}>
              <Operate operateList={operateList} onClick={(btn) => methods[btn.func](params)} />
            </div>
          </>,
        }}>
        <V2Table
          rowKey='oid'
          filters={params}
          scroll={{ x: 'max-content', y: innerMainHeight - 42 }}
          defaultColumns={columns}
          pagination={false}
          tableSortModule='SAASPropertyManageList'
          onFetch={methods.loadData}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: methods.onExpand
          }}
        />
      </V2Container>
      <PropertyClassificationModal
        propertyClassificationModalInfo={propertyClassificationModalInfo}
        setPropertyClassificationModalInfo={setPropertyClassificationModalInfo}
        onSearch={methods.onSearch}
      />
      <PropertyDraw
        propertyDrawInfo={propertyDrawInfo}
        setPropertyDrawInfo={setPropertyDrawInfo}
        onSearch={methods.onSearch}
      />
    </div>
    // </KeepAlive>
  );
};

export default ({ location }) => (
  <KeepAlive saveScrollPosition='screen' name={location.pathname}>
    <Property />
  </KeepAlive>
);
