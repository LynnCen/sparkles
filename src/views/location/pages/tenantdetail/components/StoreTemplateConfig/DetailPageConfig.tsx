import V2Table from '@/common/components/Data/V2Table';
import TableEmpty from '@/common/components/FilterTable/TableEmpty';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import V2Operate from '@/common/components/Others/V2Operate';
import { DragOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMethods } from '@lhb/hook';
import { Button, ConfigProvider, Space, Spin, message } from 'antd';
import React, { FC, useState } from 'react';
import styles from './entry.module.less';
import ModuleConfigDraw from './ModuleConfig/ModuleConfigDraw';
import AddModuleOperate from './Modal/AddModuleOperate';
import ImportModal from '@/common/components/Business/ImportModal';
import { expandConfiguredModules, expandModuleDelete, expandModuleReorder, expandModuleUpdate } from '@/common/api/storeTemplateConfig';
import { refactorPermissions } from '@lhb/func';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

// 可添加模块
enum DetailModuleType {
  BASIC = 1, // 核心
  REGION = 2, // 区域评分
  BENIFIT = 3, // 收益预估
  DETAILFORM = 4, // 详细信息
  FOOTPRINT = 5, // 区域评分
  ESTIMATE = 6, // 评估预测（亚瑟士等）
}

const canEditModuleTypes: number[] = [
  DetailModuleType.BASIC,
  DetailModuleType.REGION,
  DetailModuleType.BENIFIT,
  DetailModuleType.DETAILFORM,
];

const DetailPageConfig: FC<any> = ({ id, tenantId, templateId, setFormConfigDraw }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);
  const [curList, setCurList] = useState<any>([]);
  const [params, setParams] = useState<any>({});
  const [configDraw, setConfigDraw] = useState<any>({ visible: false });
  const [visible, setVisible] = useState<any>(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importModalLoading, setImportModalLoading] = useState(false);
  const [configuredTypes, setConfiguredTypes] = useState<any>([]);
  const [customUploadParams, setCustomUploadParams] = useState<any>({});

  const getPermissions = (moduleType: number) => {
    if (canEditModuleTypes.includes(moduleType)) {
      return [{ name: '编辑', event: 'edit' }, { name: '删除', event: 'delete' }];
    }
    return [{ name: '删除', event: 'delete' }];
  };
  const Row = ({ children, ...props }: RowProps) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
      id: props['data-row-key'],
    });

    const style: React.CSSProperties = {
      ...props.style,
      transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
      transition,
      ...(isDragging ? { position: 'relative', zIndex: 99 } : {}),
    };

    return (
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {React.Children.map(children, (child) => {
          if ((child as any).key === 'permissions') {
            return React.cloneElement(child as any, {
              children: (
                <div className={styles.row}>
                  <V2Operate
                    showBtnCount={4}
                    operateList={refactorPermissions(getPermissions((child as any).props.record.moduleType))}
                    onClick={(btn: any) => {
                      methods[btn.func]((child as any).props.record);
                    }}
                  />
                  <DragOutlined
                    ref={setActivatorNodeRef}
                    style={{ touchAction: 'none', cursor: 'move' }}
                    {...listeners}
                    className='fn-16'
                  />
                </div>
              ),
            });
          }
          return child;
        })}
      </tr>
    );
  };

  const reorder = (active, over, list) => {
    // 1、 将active插入到over的后边/前面
    const activeItem = list.find(item => item.id === active.id);
    const overItem = list.find(item => item.id === over.id);
    if (activeItem.sortIndex < overItem.sortIndex) { // 插入到后边
      activeItem.sortIndex = overItem.sortIndex + 0.1;
    } else { // 插入到前边
      activeItem.sortIndex = overItem.sortIndex;
      overItem.sortIndex = overItem.sortIndex + 0.1;
    }
    // 2、重排序
    list.sort((a, b) => a.sortIndex - b.sortIndex);
    let idx = 0;
    list.forEach(item => {
      item.index = ++idx;
    });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setLoading(true);
      const list = curList.slice();
      reorder(active, over, list);
      expandModuleReorder({ relationId: id, items: list.map(item => ({ id: item.id, sort: item.index })) }).finally(() => {
        onSearch();
        setLoading(false);
      });
    }
  };

  const onSearch = (values?) => {
    setParams({ ...params, ...values });
  };

  const handleAddModule = () => {
    setVisible(true);
  };

  const methods = useMethods({
    async loadData() {
      const objectList = await expandConfiguredModules({ relationId: id });
      if (Array.isArray(objectList)) {
        setItems(objectList.map(item => item.id));
        const ds = objectList.map((item, index) => ({ ...item, no: index + 1, sortIndex: index + 1 }));
        setCurList(ds);
        setConfiguredTypes(ds.map(item => item.moduleType) || []);
        return { dataSource: ds, count: 0 };
      }
      return {};
    },
    handleDelete(record) {
      ConfirmModal({
        content: '确定删除该模块？',
        onSure: (modal) => {
          expandModuleDelete({ groupId: record.id }).then(() => {
            modal.destroy();
            onSearch();
          });
        },
      });
    },
    async handleEdit(record) {
      if (record.moduleType === DetailModuleType.REGION) {
        setImportModalVisible(true);
        setCustomUploadParams({ groupId: record.id, relationId: id, moduleName: record.moduleName, moduleType: record.moduleType, tenantId, templateId });
        return;
      }
      if (record.moduleType === DetailModuleType.DETAILFORM) { // 详情表单配置弹框
        setFormConfigDraw && setFormConfigDraw({ visible: true, templateId });
        return;
      }
      setConfigDraw({ visible: true, id, tenantId, templateId, module: record });
    },
    async customUploadFetch(values, callbackFn) {
      setImportModalLoading(true);
      try {
        await expandModuleUpdate({ ...customUploadParams, property: JSON.stringify({ url: values.file[0].url, urlName: values.file[0].name }) });
        message.success('上传成功！');
        setImportModalVisible(false);
        callbackFn?.();
        setImportModalLoading(false);
      } catch (error) {
        callbackFn?.({ isError: true });
        setImportModalLoading(false);
      }
    },
  });

  const emptyContent = (
    <>
      <div>暂无内容，请先新增～</div>
    </>
  );

  const columns = [
    {
      title: '排序',
      dataIndex: 'no',
      key: 'no',
      width: 100,
      dragChecked: true,
    },
    {
      title: '模块名称',
      dataIndex: 'moduleName',
      key: 'moduleName',
      width: 'auto',
      render: (value: any) => <div className='bold'>{value}</div>,
      dragChecked: true,
    },
    {
      title: '操作',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 200,
      dragChecked: true,
    },
  ];

  return (
    <div className={styles.table}>
      <Spin spinning={loading}>
        <Space style={{ marginBottom: 10, position: 'sticky', left: 0 }}>
          <Button type='primary' onClick={handleAddModule}>
                添加模块
          </Button>
        </Space>
        <DndContext onDragEnd={onDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ConfigProvider renderEmpty={() => <TableEmpty>{emptyContent}</TableEmpty>}>
              <V2Table
                components={{
                  body: {
                    row: Row,
                  },
                }}
                rowKey='id'
                onFetch={methods.loadData}
                filters={params}
                defaultColumns={columns}
                pagination={false}
                hideColumnPlaceholder
                emptyRender={emptyContent}
                // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
                // scroll={{ y: mainHeight - 48 - 42 }}
              />
            </ConfigProvider>
          </SortableContext>
        </DndContext>
      </Spin>
      {/* 收益预估模块&核心信息模块编辑页 */}
      <ModuleConfigDraw configDraw={configDraw} setConfigDraw={setConfigDraw} onSearch={onSearch}/>
      {/* 新增模块Modal */}
      <AddModuleOperate visible={visible} setVisible={setVisible} id={id} tenantId={tenantId} onSearch={onSearch} configuredTypes={configuredTypes}/>
      {/* 雷达图导入excel Modal */}
      <ImportModal
        visible={importModalVisible}
        setVisible={setImportModalVisible}
        templateId={templateId}
        importModalLoading={importModalLoading}
        customUploadFetch={methods.customUploadFetch}
      />
    </div>
  );
};

export default DetailPageConfig;
