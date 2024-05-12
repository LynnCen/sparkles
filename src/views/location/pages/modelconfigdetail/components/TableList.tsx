import TableEmpty from '@/common/components/FilterTable/TableEmpty';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Operate from '@/common/components/Operate';
import { get, post } from '@/common/request';
import { MenuOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { refactorPermissions } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { Button, ConfigProvider, message, Space, Spin, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

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
        if ((child as any).key === 'categoryName') {
          return React.cloneElement(child as any, {
            children: (
              <Space direction='horizontal'>
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{ touchAction: 'none', cursor: 'move' }}
                  {...listeners}
                />
                <span className='ml-10 bold'>{(child as any).props.record.categoryName}</span>
              </Space>
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const TableList: FC<any> = ({ modelId, params, onSearch, propertyTreeDrawInfo, setPropertyTreeDrawInfo }) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [disabledOIds, setDisabledOIds] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const reorder = async (params) => {
    setLoading(true);
    post('/shop/model/relation/reorder', { ...params }, { proxyApi: '/blaster' }).then(() => {
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
      .children.map((item) => ({
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
    async loadData(params) {
      // https://yapi.lanhanba.com/project/331/interface/api/34329
      const objectList = await get('/shop/model/category/list', params, {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      });
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
          children:
            item.attributeList && item.attributeList.length
              ? item.attributeList.map((property) => ({
                key: item.id + '-' + property.id,
                isCategory: false,
                propertyId: property.id,
                categoryId: item.id,
                propertyName: property.name,
                propertyAlias: property.aliaName,
                sortIndex: ++sortNum,
                permissions: [{ name: '删除', event: 'delete' }],
              }))
              : [],
        }));
        const oids: any = [];
        const its: any = [];
        ds.forEach((item) => {
          its.push(item.key);
          item.children.length &&
            item.children.forEach((child) => {
              its.push(child.key);
              oids.push(child.propertyId);
            });
        });
        setDisabledOIds(oids);
        setPropertyTreeDrawInfo({ ...propertyTreeDrawInfo, disabledOIds: oids });
        setItems(its);
        setDataSource(ds);
      }

      setLoading(false);
    },
    handleDelete(record) {
      if (record.isCategory) {
        ConfirmModal({
          content: '此操作将删除该分类下所有的属性，确定继续吗？',
          onSure: (modal) => {
            post(
              '/shop/model/relation/delete',
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
              '/shop/model/relation/delete',
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
      width: 120,
      render: (value: any) => <div className='bold'>{value}</div>,
    },
    { title: '属性名称', dataIndex: 'propertyName', key: 'propertyName', width: 120 },
    { title: '属性别名', dataIndex: 'propertyAlias', key: 'propertyAlias', width: 120 },
    {
      title: '操作',
      dataIndex: 'permissions',
      key: 'permissions',
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

  useEffect(() => {
    // navigate方法绑定到document-event上，页面内需要调用navigate方法直接使用dispatchNavigate
    methods.loadData({ id: modelId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <Spin spinning={loading}>
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ConfigProvider renderEmpty={() => <TableEmpty>{emptyContent}</TableEmpty>}>
            <Table
              components={{
                body: {
                  row: Row,
                },
              }}
              rowKey='key'
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          </ConfigProvider>
        </SortableContext>
      </DndContext>
    </Spin>
  );
};

export default TableList;
