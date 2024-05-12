import { Button, Modal, Space, Switch, Typography } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { deepCopy, gatherMethods, refactorPermissions } from '@lhb/func';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from 'immutability-helper';
import { useMethods } from '@lhb/hook';

import { resTemplateDetail } from '@/common/api/template';
import Table from '@/common/components/FilterTable';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Operate from '@/common/components/Operate';
import { post } from '@/common/request';
import { GroupModalInfo, GroupType, PropertyConfigModalInfo, PropertyTreeDrawInfo } from '../../ts-config';
import GroupModal from '../Modal/GroupModal';
import PropertyConfigModal from '../Modal/PropertyConfigModal';
import PropertyTreeDraw from '../PropertyTreeDraw';
import { dataType, findFromData, getParam, optionsTyps } from './components/common';
import { DraggableBodyRow } from './components/row';
import IconFont from '@/common/components/IconFont';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useForm } from 'antd/lib/form/Form';

const { Text } = Typography;

const PropertyConfigTab: FC<any> = ({ categoryId, categoryTemplateId, parentCategoryId }) => {
  const [propertyTreeDrawInfo, setPropertyTreeDrawInfo] = useState<PropertyTreeDrawInfo>({
    visible: false,
    disabledOIds: [],
  });
  const [groupModalInfo, setGroupModalInfo] = useState<GroupModalInfo>({
    visible: false,
    categoryId: categoryId,
    categoryTemplateId: categoryTemplateId,
    groupType: GroupType.PROPERTY,
  });

  const [propertyConfigModalInfo, setPropertyConfigModalInfo] = useState<PropertyConfigModalInfo>({
    visible: false,
  });
  // const [params, setParams] = useState<any>({});
  const [anotherNameVisible, setAnotherNameVisible] = useState(false);
  const [anotherNameForm] = useForm()
  const [anotherNameConfigId, setAnotherNameConfigId] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]); // 展开的行keys
  const columns = [
    {
      title: '排序',
      key: 'sort',
      width: 100,
      className: 'drag-visible',
      expandRowByClick: true,
      // render: () => <DragHandle />,
    },
    {
      key: 'name',
      title: '分组名称',
      width: 150,
      render: (_, record) => {
        if (record.isProperty) {
          return null;
        } else {
          return <Text strong>{record.name}</Text>;
        }
      },
    },
    {
      key: 'name',
      title: '属性名称',
      width: 150,
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
      width: 150,
    },
    {
      key: 'anotherName',
      title: '属性别名',
      width: 220,
      render: (value, record) => {
        if (record.isProperty) {
          return <div><span className='mr-4'>{value}</span><IconFont iconHref='pc-common-icon-ic_edit' onClick={() => clickEditAnotherName(record.id, value)}></IconFont></div>;
        } else {
          return null;
        }
      },
    },
    {
      key: 'required',
      title: '是否必填',
      render: (val, record) => {
        if (record.isProperty) {
          return <Switch defaultChecked={val === 1} onChange={(value) => updateSingleCategory(record.id, 'required', value)} />;
        }
        return null;
      }
    },
    {
      key: 'quickCreation',
      title: '是否快速创建字段',
      render: (val, record) => {
        if (record.isProperty) {
          return <Switch defaultChecked={val === 1} onChange={(value) => updateSingleCategory(record.id, 'quickCreation', value)} />;
        }
        return null;
      }
    },
    {
      key: 'duplicate',
      title: '是否去重',
      render: (val, record) => {
        if (record.isProperty) {
          return <Switch defaultChecked={val === 1} onChange={(value) => updateSingleCategory(record.id, 'duplicate', value)} />;
        }
        return null;
      }
    },
    {
      key: 'h5CustomerDisplay',
      title: '是否展示给客户',
      render: (val, record) => {
        if (record.isProperty) {
          return <Switch defaultChecked={val === 1} onChange={(value) => updateSingleCategory(record.id, 'h5CustomerDisplay', value)} />;
        }
        return null;
      }
    },
    { // pms定制字段
      key: 'listDisplay',
      title: '是否列表展示',
      render: (val, record) => {
        if (record.isProperty) {
          return <Switch defaultChecked={val === 1} onChange={(value) => updateSingleCategory(record.id, 'listDisplay', value)} />;
        }
        return null;
      }
    },
    {
      title: '操作',
      key: 'op',
      fixed: 'right',
      width: 180,
      render: (_, record) => {
        if (!record.children) {
          return (
            <Operate
              onClick={(btn) => methods[btn.func](record)}
              operateList={refactorPermissions([
                { name: '编辑', event: 'editProperty' },
                { name: '删除', event: 'deleteProperty' },
              ])}
            />
          );
        }
        return (
          <Operate
            showBtnCount={4}
            onClick={(btn) => methods[btn.func](record)}
            operateList={refactorPermissions([
              { name: '新增属性', event: 'addProperty' },
              { name: '编辑', event: 'editGroup' },
              { name: '删除', event: 'deleteGroup' },
            ])}
          />
        );
      },
    },
  ];
  const [dataSource, setDataSource] = useState<any>([]);

  const { loop, loadData, onSearch, handleAddGroup, ...methods } = useMethods({
    handleAddGroup() {
      setGroupModalInfo({ categoryId, categoryTemplateId, groupType: GroupType.PROPERTY, visible: true });
    },
    handleEditGroup(record) {
      setGroupModalInfo({
        categoryId,
        categoryTemplateId,
        name: record.name,
        visible: true,
        id: record.id,
        groupType: GroupType.PROPERTY,
      });
    },
    handleAddProperty(record) {
      setPropertyTreeDrawInfo({
        categoryId,
        categoryTemplateId,
        disabledOIds: propertyTreeDrawInfo.disabledOIds,
        categoryPropertyGroupId: record.id,
        visible: true,
      });
    },

    handleDeleteGroup(record) {
      ConfirmModal({
        onSure: () => {
          post('/propertyGroup/delete', { id: record.id }, true).then(() => {
            onSearch();
          });
        },
      });
    },
    handleEditProperty(record) {
      setPropertyConfigModalInfo({
        ...record, categoryId,
        categoryTemplateId, visible: true, id: record.id
      });
    },
    handleDeleteProperty(record) {
      ConfirmModal({
        onSure: () => {
          post('/propertyGroup/removeProperty', { id: record.id }, true).then(() => {
            onSearch();
          });
        },
      });
    },

    loadData: async () => {
      let result = await resTemplateDetail({ categoryId, categoryTemplateId });
      if (
        result.labelGroupVOList.length === 0 &&
        result.propertyGroupVOList.length === 0 &&
        result?.specVOList?.length === 0
      ) {
        result = await post('/categoryTemplate/copyConfigInfo', {
          categoryTemplateId: categoryTemplateId,
          copyFromCategoryId: parentCategoryId,
          copyToCategoryId: categoryId,
        }, true);
      }
      // 作用1:子分类和子属性组装成树状结构
      // 作用2: 设置属性库页面不可选择项集合
      const disabledOIds = [];
      const dataSource = loop(result.propertyGroupVOList, disabledOIds)
      const data = { dataSource };
      // setDataSource(dataSource)
      setPropertyTreeDrawInfo({ ...propertyTreeDrawInfo, disabledOIds: disabledOIds });
      return data;
    },
    onSearch() {
      loadData().then(res => {
        setDataSource([...res.dataSource])
        setExpandedRowKeys(res.dataSource.map((item: any) => item.id))// 展开所有
      });
    },

    loop(objectList, disabledOIds) {
      if (!objectList) {
        return [];
      }
      objectList.forEach((item) => {
        item.isProperty = false;
        item.children = [];

        if (item.childList && item.childList.length) {
          item.children = item.children.concat(loop(item.childList, disabledOIds));
        }
        if (item.propertyConfigList && item.propertyConfigList.length) {
          item.propertyConfigList.forEach((property) => {
            property.id = property.id;
            property.isProperty = true;
            property.parentId = item.id;
            // 设置属性库页面不可选择项集合
            disabledOIds.push('property-' + property.propertyId);
          });
          item.children = item.children.concat(item.propertyConfigList);
        }
      });
      return objectList;
    },
    onExpand(bol: Boolean, data: any) { // table展开
      const keys: any[] = deepCopy(expandedRowKeys);
      if (bol) {
        setExpandedRowKeys(gatherMethods([data.id], keys))
      } else {
        setExpandedRowKeys(keys.filter(item => item !== data.id))
      }
    },
  });

  const updateSingleCategory = (configId, type, value) => {
    let val = value ? 1 : 0;
    // 后端定义脑抽了，历史是否用了 1、2，所以需要定制化区分代码
    if (type === 'required' || type === 'duplicate') {
      val = value ? 1 : 2;
    }
    // https://yapi.lanhanba.com/project/321/interface/api/60122
    post('/categoryTemplate/updateConfig', { configId, [type]: val }, { needCancel: false }).then((res) => {

    }, (() => {
      window.location.reload();
    }));
  }

  const clickEditAnotherName = (configId, value) => {
    anotherNameForm.setFieldsValue({ anotherName: value });
    setAnotherNameConfigId(configId);
    setAnotherNameVisible(true);
  }

  const anotherNameUpdate = () => {
    anotherNameForm.validateFields().then((values) => {
      post('/categoryTemplate/updateConfig', { configId: anotherNameConfigId, anotherName: values.anotherName }, { needCancel: false }).then((res) => {
        onSearch();
      }).finally(() => {
        setAnotherNameVisible(false);
      });
    })
  }

  const sortByDrag = async (parentId: any, data: any) => {
    const items = data.map((item, index) => ({ id: item.id, index }));
    await post(parentId === null ? '/propertyGroup/reorder' : '/propertyGroup/property/reorder', { parentId, items }, true);
    // setParams({ random: Math.random() });
    loadData().then(res => {
      setDataSource(res.dataSource)
    });
  }


  const findRow = (id) => {
    // 通过原始数据，根据id查询到对应数据信息和索引
    const { row, index, parentIndex } = findFromData(dataSource, id);
    return {
      row,
      rowIndex: index,
      rowParentIndex: parentIndex
    };
  };

  const moveRow = useCallback(
    (props) => {
      let {
        dragId, //拖拽id
        dropId, //放置id
        dropParentId, //放置父id
        operateType, //操作
        originalIndex // 原始索引
      } = props;

      let {
        dragRow, // 拖拽row
        dropRow, // 放置row
        dragIndex, //拖拽索引
        dropIndex, // 放置索引
        dragParentIndex, // 拖拽子节点的父节点索引
        // dropParentIndex // 放置子节点父节点索引
      } = getParam(dataSource, dragId, dropId);

      // 拖拽是否是组
      let dragIsGroup = dragRow.type === dataType.group || !dragRow.parentId;
      // 放置的是否是组
      let dropIsGroup = !dropParentId;

      // 根据变化的数据查找拖拽行的row和索引
      const {
        row,
        index: rowIndex,
      } = findFromData(dataSource, dragId);


      let newData = dataSource;
      // 组拖拽
      if (dragIsGroup && dropIsGroup) {
        // 超出出拖拽区域还原
        if (operateType === optionsTyps.didDrop) {
          newData = update(dataSource, {
            $splice: [
              [rowIndex, 1], //删除目前拖拽的索引的数据
              [originalIndex, 0, row] // 将拖拽数据插入原始索引位置
            ]
          });
        } else {
          // 修改拖拽后位置
          newData = update(dataSource, {
            $splice: [
              [dragIndex, 1],
              [dropIndex, 0, dragRow]
            ]
          });
        }
      }
      // 同一组下的子项拖拽
      else if (dragRow.parentId === dropRow?.parentId) {
        // 超出拖拽区域还原
        if (operateType === optionsTyps.didDrop) {
          newData = update(dataSource, {
            [dragParentIndex]: {
              children: {
                $splice: [
                  [rowIndex, 1],
                  [originalIndex, 0, row]
                ]
              }
            }
          });
        } else {
          // 修改拖拽后位置
          newData = update(dataSource, {
            [dragParentIndex]: {
              children: {
                $splice: [
                  [dragIndex, 1],
                  [dropIndex, 0, dragRow]
                ]
              }
            }
          });
        }
      }
      let dragData: any[] = [] // 拖拽的数据
      if (dropParentId) { //如果有父级id，需要获取父级的children
        dragData = newData.filter(item => item.id === dropParentId)?.[0].children
      } else {
        dragData = newData
      }
      sortByDrag(dropParentId, dragData)
      setDataSource(newData);
    },
    [dataSource]
  );


  useEffect(() => {
    onSearch()
  }, [])
  return (
    <>
      <Space style={{ marginBottom: 10 }}>
        <Button type='primary' onClick={handleAddGroup}>
          添加一级分组
        </Button>
      </Space>
      <DndProvider backend={HTML5Backend}>
        <Table
          bordered={false}
          size='small'
          dataSource={dataSource}
          // onFetch={loadData}
          pagination={false}
          // filters={params}
          columns={columns}
          components={{
            body: {
              // wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
          expandable={{
            defaultExpandAllRows: true,
            expandedRowKeys: expandedRowKeys,
            onExpand: (bol: Boolean, data: any) => methods.onExpand(bol, data),
          }}
          rowKey={(record) => record.id}
          onRow={(record, index) => ({
            record,  // 当前数据
            data: dataSource,    // 完整数据
            index,   // 当前数据索引
            moveRow, // 移动后修改数据的方法
            findRow
          })}
        />
      </DndProvider>
      <PropertyTreeDraw
        onSearch={onSearch}
        propertyTreeDrawInfo={propertyTreeDrawInfo}
        setPropertyTreeDrawInfo={setPropertyTreeDrawInfo}
      />
      <GroupModal onSearch={onSearch} groupModalInfo={groupModalInfo} setGroupModalInfo={setGroupModalInfo} />
      <PropertyConfigModal
        onSearch={onSearch}
        propertyConfigModalInfo={propertyConfigModalInfo}
        setPropertyConfigModalInfo={setPropertyConfigModalInfo}
      />
      <Modal
        title='修改属性别名'
        open={anotherNameVisible}
        onOk={anotherNameUpdate}
        // 两列弹窗要求336px
        width={336}
        onCancel={() => setAnotherNameVisible(false)}
        forceRender
      >
        <V2Form form={anotherNameForm}>
          <V2FormInput
            label='属性别名'
            name='anotherName'
            rules={[{ required: false, message: '请输入属性别名' }]}
            maxLength={20}
          />
        </V2Form>
      </Modal>
    </>
  );
};

export default PropertyConfigTab;
