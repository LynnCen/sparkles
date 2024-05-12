/**
 * @Description 模板table
 */
import { FC, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { message } from 'antd';
import { useMethods } from '@lhb/hook';
import { initModalData } from '../ways';
import { dynamicTemplateGroupReorder, dynamicTemplatePropertyReorder } from '@/common/api/location';
// import cs from 'classnames';
// import styles from './index.module.less';
import RechristenModal from './HandleModal/RechristenModal';
import LimitModal from './HandleModal/LimitModal';
import FormulaModal from '@/common/business/Location/Formula';
import AssociatedDisplayModal from './HandleModal/AssociatedDisplayModal';
import TableContent from './TableContent';

const TemplateTable: FC<any> = ({
  templateId, // 模板id
  keys, // 所有行的key
  dataSource, // Table数据源
  expandedRowKeys, // 展开行的keys
  propertyTreeDrawInfo, // 选择字段的弹窗数据
  setPropertyTreeDrawInfo, // 设置选择字段的弹窗数据
  loadData, // 更新Table
  setExpandedRowKeys, // 设置展开行
}) => {
  const [rechristenData, setRechristenData] = useState<any>(initModalData()); // 重命名
  const [limitData, setLimitData] = useState<any>(initModalData()); // 限制
  const [formulaData, setFormulaData] = useState<any>(initModalData()); // 计算公式
  const [associatedDisplayData, setAssociatedDisplayData] = useState<any>(initModalData()); // 计算公式

  const dragMethods = useMethods({
    // -------------拖拽排序相关start-------------
    // 拖拽排序相关的逻辑从原本的代码里拷贝出来的 TODO 逻辑梳理及是否能简化
    onDragEnd: ({ active, over }) => {
      if (active.id !== over?.id) {
        if ((active.id as any).includes('firstGroup') && (over?.id as any).includes('firstGroup')) {
          dragMethods.swapFirstGroup(active, over);
          return;
        }
        if ((active.id as any).includes('secondGroup') && (over?.id as any).includes('secondGroup') && ((active.id as any).split('-')[1] === (over?.id as any).split('-')[1])) {
          dragMethods.swapSecondGroup(active, over);
          return;
        }
        // if (
        //   (active.id as any).includes('firstProperty') &&
        // (over?.id as any).includes('firstProperty') &&
        // (active.id as any).split('-')[1] === (over?.id as any).split('-')[1]
        // ) {
        //   dragMethods.swapFirstProperty(active, over);
        //   return;
        // }
        if (
          (active.id as any).includes('secondProperty') &&
        (over?.id as any).includes('secondProperty') &&
        (active.id as any).split('-')[2] === (over?.id as any).split('-')[2]
        ) {
          dragMethods.swapSecondProperty(active, over);
          return;
        }
        message.warn('不支持跨分类移动！');
      }
    },
    swapFirstGroup: (active, over) => {
      const cs: any = dataSource.map((item) => ({
        key: item.key,
        sortIndex: item.sortIndex,
      }));
      dragMethods.reorder(active, over, cs);
      dragMethods.groupSort({ templateId, orders: cs.map((item) => ({ id: item.key.split('-')[1], index: item.index })) });
    },
    // swapFirstProperty: (active, over) => {
    //   const cs: any = dataSource
    //     .filter((item) => Number(item.id) === Number(active.id.split('-')[1]))[0]
    //     .children.filter((item) => !item.isGroup)
    //     .map((item) => ({
    //       key: item.key,
    //       sortIndex: item.sortIndex,
    //     }));
    //   dragMethods.reorder(active, over, cs);
    //   dragMethods.propertySort({ templateId, orders: cs.map((item) => ({ id: item.key.split('-')[2], index: item.index })) });
    // },
    swapSecondGroup: (active, over) => {
      const cs: any = dataSource
        .filter((item) => Number(item.id) === Number(active.id.split('-')[1]))[0]
        .children.filter((item) => item.isGroup)
        .map((item) => ({
          key: item.key,
          sortIndex: item.sortIndex,
        }));

      dragMethods.reorder(active, over, cs);
      dragMethods.groupSort({ templateId, orders: cs.map((item) => ({ id: item.key.split('-')[2], index: item.index })) });
    },
    swapSecondProperty: (active, over) => {
      const cs: any = dataSource
        .filter((item) => Number(item.id) === Number(active.id.split('-')[1]))[0]
        .children.filter((item) => item.isGroup && Number(item.id) === Number(active.id.split('-')[2]))[0]
        .children.map((item) => ({
          key: item.key,
          sortIndex: item.sortIndex,
        }));
      dragMethods.reorder(active, over, cs);
      dragMethods.propertySort({ templateId, orders: cs.map((item) => ({ id: item.key.split('-')[3], index: item.index })) });
    },
    propertySort: (params) => {
      dynamicTemplatePropertyReorder(params).then(() => {
        loadData && loadData();
      });
    },
    reorder: (active, over, list) => {
      // 1、 将active插入到over的后边/前面
      const activeItem = list.find(item => item.key === active.id);
      const overItem = list.find(item => item.key === over.id);
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
    },
    groupSort: (params) => {
      dynamicTemplateGroupReorder(params).then(() => {
        loadData && loadData();
      });
    }
    // -------------拖拽排序相关end-------------
  });

  return (
    <>
      <DndContext onDragEnd={dragMethods.onDragEnd}>
        <SortableContext items={keys} strategy={verticalListSortingStrategy}>
          <TableContent
            templateId={templateId} // 模板id
            expandedRowKeys={expandedRowKeys} // 展开行的keys
            dataSource={dataSource} // 数据源
            propertyTreeDrawInfo={propertyTreeDrawInfo} // 选择字段的弹窗数据
            setRechristenData={setRechristenData} // 设置重命名
            setExpandedRowKeys={setExpandedRowKeys} // 设置展开行
            setPropertyTreeDrawInfo={setPropertyTreeDrawInfo} // 设置选择字段的弹窗数据
            setLimitData={setLimitData} // 设置限制弹窗数据
            setFormulaData={setFormulaData} // 设置计算公式
            setAssociatedDisplayData={setAssociatedDisplayData} // 设置关联显示
            loadData={loadData}
          />
        </SortableContext>
      </DndContext>
      {/* 重命名弹窗 */}
      <RechristenModal
        modalData={rechristenData}
        templateId={templateId}
        loadData={loadData}
        close={() => setRechristenData(initModalData())}
      />
      {/* 文件、输入框、限制弹窗 */}
      <LimitModal
        modalData={limitData}
        templateId={templateId}
        loadData={loadData}
        close={() => setLimitData(initModalData())}
      />
      {/* 计算公式 */}
      <FormulaModal
        modalData={formulaData}
        templateId={templateId}
        loadData={loadData}
        close={() => setFormulaData(initModalData())}
      />
      {/* 关联显示 */}
      <AssociatedDisplayModal
        modalData={associatedDisplayData}
        templateId={templateId}
        loadData={loadData}
        close={() => setAssociatedDisplayData(initModalData())}
      />
    </>
  );
};

export default TemplateTable;
