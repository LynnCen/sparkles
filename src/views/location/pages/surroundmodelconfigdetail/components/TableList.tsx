import V2Table from '@/common/components/Data/V2Table';
import TableEmpty from '@/common/components/FilterTable/TableEmpty';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Operate from '@/common/components/Operate';
import { get, post } from '@/common/request';
import { DragOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMethods } from '@lhb/hook';
import { Button, ConfigProvider, message, Spin } from 'antd';
import React, { FC, useState } from 'react';
import styles from './index.module.less';
import SetBrandModal from './SetBrandModal';
import { refactorPermissions } from '@lhb/func';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const TableList: FC<any> = ({ modelId, params, onSearch, propertyTreeDrawInfo, setPropertyTreeDrawInfo }) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [disabledOIds, setDisabledOIds] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [brandModal, setBrandModal] = useState<any>({ // 品牌设置弹窗
    open: false,
    target: null
  });
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
                  <Operate
                    showBtnCount={4}
                    operateList={refactorPermissions((child as any).props.record.permissions)}
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

  const reorder = async (params) => {
    setLoading(true);
    post('/surround/model/relation/reorder', { ...params }, { proxyApi: '/blaster' }).then(() => {
      onSearch();
      setLoading(false);
    });
  };

  const swapCategory = (active, over) => {
    const cs: any = dataSource.map((item) => ({
      key: item.key,
      sortIndex: item.sortIndex,
    }));

    cs.forEach((item) => {
      if (item.key === active.id) {
        item.index = cs.filter((it) => it.key === over.id)[0].sortIndex;
        return;
      }
      if (item.key === over.id) {
        item.index = cs.filter((it) => it.key === active.id)[0].sortIndex;
        return;
      }
      item.index = item.sortIndex;
    });

    reorder({
      relationType: 3,
      modelId,
      items: cs.map((item) => ({ id: item.key.split('-')[1], index: item.index })),
    });
  };

  const swapProperty = (active, over) => {
    const cs: any = dataSource
      .filter((item) => Number(item.categoryId) === Number(active.id.split('-')[0]))[0]
      .properties.map((item) => ({
        key: item.key,
        sortIndex: item.sortIndex,
      }));

    cs.forEach((item) => {
      if (item.key === active.id) {
        item.index = cs.filter((it) => it.key === over.id)[0].sortIndex;
        return;
      }
      if (item.key === over.id) {
        item.index = cs.filter((it) => it.key === active.id)[0].sortIndex;
        return;
      }
      item.index = item.sortIndex;
    });

    reorder({
      relationType: 2,
      modelId,
      items: cs.map((item) => ({ id: item.key.split('-')[1], index: item.index })),
    });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      if ((active.id as any).includes('category') && (over?.id as any).includes('category')) {
        swapCategory(active, over);
        return;
      }
      if ((active.id as any).includes('category') || (over?.id as any).includes('category')) {
        message.warn('不支持跨分类移动！');
        return;
      }
      if ((active.id as any).split('-')[0] !== (over?.id as any).split('-')[0]) {
        message.warn('不支持跨分类移动！');
        return;
      }
      swapProperty(active, over);
    }
  };

  const methods = useMethods({
    async loadData() {
      // https://yapi.lanhanba.com/project/331/interface/api/34329
      const objectList = await get(
        '/surround/model/category/list',
        { id: modelId },
        {
          isMock: false,
          mockId: 331,
          mockSuffix: '/api',
          needHint: true,
          proxyApi: '/blaster',
        }
      );
      let sortNum = 0;
      if (objectList && objectList.length) {
        const ds = objectList.map((item) => ({
          key: 'category-' + item.id,
          isCategory: true,
          categoryName: item.name,
          categoryId: item.id,
          categoryCode: item.code,
          sortIndex: ++sortNum,
          permissions: [
            { name: '删除', event: 'delete' },
            { name: '新增属性', event: 'bindProperty' },
          ],
          properties:
            item.attributeList && item.attributeList.length
              ? item.attributeList.map((property) => ({
                key: item.id + '-' + property.id,
                isCategory: false,
                propertyId: property.id,
                categoryId: item.id,
                propertyName: property.name,
                propertyAlias: property.aliaName,
                sortIndex: ++sortNum,
                permissions: [
                  { name: '删除', event: 'delete' },
                  { name: '品牌设置', event: 'setBrand' },
                ],
                brandStr: property.data
              }))
              : [],
        }));
        const oids: any = [];
        const its: any = [];
        ds.forEach((item) => {
          its.push(item.key);
          item.properties.length &&
            item.properties.forEach((child) => {
              its.push(child.key);
              oids.push(child.propertyId);
            });
        });
        setDisabledOIds(oids);
        setPropertyTreeDrawInfo({ ...propertyTreeDrawInfo, disabledOIds: oids });
        setItems(its);
        setDataSource(ds);
        setLoading(false);
        return { dataSource: ds };
      }
      setLoading(false);
      return { dataSource: [], count: 0 };
    },
    handleDelete(record) {
      if (record.isCategory) {
        ConfirmModal({
          content: '此操作将删除该分类下所有的属性，确定继续吗？',
          onSure: (modal) => {
            post(
              '/surround/model/relation/delete',
              { modelId: propertyTreeDrawInfo.modelId, relationId: record.categoryId, relationType: 3 },
              { proxyApi: '/blaster' }
            ).then(() => {
              modal.destroy();
              onSearch();
            });
          },
        });
      } else {
        ConfirmModal({
          onSure: (modal) => {
            post(
              '/surround/model/relation/delete',
              { modelId: propertyTreeDrawInfo.modelId, relationId: record.propertyId, relationType: 2 },
              { proxyApi: '/blaster' }
            ).then(() => {
              modal.destroy();
              onSearch();
            });
          },
        });
      }
    },
    handleBindProperty() {
      setPropertyTreeDrawInfo({ ...propertyTreeDrawInfo, disabledOIds: disabledOIds, visible: true });
    },
    handleAddProperty() {
      setPropertyTreeDrawInfo({ ...propertyTreeDrawInfo, visible: true });
    },
    // 品牌设置
    handleSetBrand(record) {
      setBrandModal({
        open: true,
        target: {
          ...record,
          modelId: +modelId
        }
      });
    }
  });

  const emptyContent = (
    <>
      <div>暂无内容，请先新增～</div>
      <Button type='primary' onClick={methods.handleAddProperty} className='mt-10'>
        新增属性
      </Button>
    </>
  );

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 500,
      render: (value: any) => <div className='bold'>{value}</div>,
      dragChecked: true,
    },
    {
      title: '操作',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 'auto',
      render: (value: any, record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value)}
          onClick={(btn: any) => {
            methods[btn.func](record);
          }}
        />
      ),
      dragChecked: true,
    },
  ];

  const childColumns = [
    { title: '属性名称', dataIndex: 'propertyName', key: 'propertyName', width: 250, dragChecked: true },
    { title: '属性别名', dataIndex: 'propertyAlias', key: 'propertyAlias', width: 250, dragChecked: true },
    {
      title: '操作',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 'auto',
      render: (value: any, record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value)}
          onClick={(btn: any) => {
            methods[btn.func](record);
          }}
        />
      ),
      dragChecked: true,
    },
  ];

  const expandedRowRender = (record) => {
    return (
      <div className={styles.childTable}>
        <DndContext onDragEnd={onDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ConfigProvider>
              <V2Table
                components={{
                  body: {
                    row: Row,
                  },
                }}
                rowKey='key'
                onFetch={() => ({ dataSource: record.properties })}
                filters={params}
                defaultColumns={childColumns}
                pagination={false}
                hideColumnPlaceholder
                // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
                // scroll={{ y: mainHeight - 48 - 42 }}
              />
            </ConfigProvider>
          </SortableContext>
        </DndContext>
      </div>
    );
  };

  return (
    <div className={styles.table}>
      <Spin spinning={loading}>
        <DndContext onDragEnd={onDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ConfigProvider renderEmpty={() => <TableEmpty>{emptyContent}</TableEmpty>}>
              <V2Table
                components={{
                  body: {
                    row: Row,
                  },
                }}
                rowKey='key'
                onFetch={methods.loadData}
                filters={params}
                defaultColumns={columns}
                pagination={false}
                hideColumnPlaceholder
                emptyRender={emptyContent}
                expandable={{ expandedRowRender }}
                // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
                // scroll={{ y: mainHeight - 48 - 42 }}
              />
            </ConfigProvider>
          </SortableContext>
        </DndContext>
      </Spin>

      <SetBrandModal
        open={brandModal.open}
        detail={brandModal.target}
        update={onSearch}
        close={() => setBrandModal({ target: null, open: false })}/>
    </div>
  );
};

export default TableList;
