/**
 * @Description 加盟商 列表
 */

import { FC, useEffect, useRef, useState } from 'react';
import { isArray, isNotEmptyAny, refactorPermissions } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import styles from './index.module.less';
import V2Operate from '@/common/components/Others/V2Operate';
import V2Table from '@/common/components/Data/V2Table';
import TaskCreateDrawer from '@/common/components/business/ExpandStore/TaskCreateDrawer';
import { analysisTableTitle } from '@/common/components/business/DynamicComponent/config';
import { franchiseeDynamicPage } from '@/common/api/expandStore/franchisee';

const List: FC<any> = ({
  mainHeight,
  filters,
  onClickDetail,
}) => {
  const tableRef: any = useRef(null);
  const [column, setColumn] = useState<any>([]);
  const [curRecord, setCurRecord] = useState<any>({}); // 选中的列表数据
  const [showCreateTaskDrawer, setShowCreateTaskDrawer] = useState<boolean>(false); // 创建拓店任务是否可见

  useEffect(() => {
    franchiseeDynamicPage({ page: 1, size: 5 }).then((data) => {
      // 固定写死机会点名称，对应的开发经理，机会点状态
      let targetArray: any[] = [];
      if (isArray(data?.objectList) && data?.objectList.length && isArray(data?.objectList[0]?.columns) && data?.objectList[0]?.columns.length) {
        const res = data.objectList[0].columns?.map((item) => {
          return {
            key: item.identification,
            title: item.propertyName,
            dragChecked: true,
            width: 160,
            render: (value: string,) => renderColumn(value)
          };
        });
        targetArray = res || [];
      }
      (targetArray as any[]).splice(0, 0, ...prefixColumns, { key: 'uniqueId', title: data.objectList[0].uniqueName, width: 160 });
      (targetArray as any[]).splice(targetArray.length, 0, ...suffixColumns);
      setColumn(targetArray || []);
    });
  }, []);

  /**
   * @description 获取加载table表格数据。该函数依赖fitles变化自动触发
   * @param params fitles和搜索框参数（当前页面只有keyword）
   * @return table数据
   */
  const loadData = async (params: any) => {
    const data = await franchiseeDynamicPage(params);
    let arr:any = {};
    const res = data.objectList?.map((item) => {
      item?.columns?.map((i) => {
        const res = analysisTableTitle(i);
        arr = {
          ...arr,
          [i.identification]: res
        };
      });
      return {
        id: item.id,
        // 固定写死项目
        name: item.name,
        statusName: item.statusName,
        uniqueId: item.uniqueId,
        // 动态表头项目
        ...arr,
      };
    });

    return {
      dataSource: res,
      count: data.totalNum,
    };
  };

  const prefixColumns = [
    {
      key: 'name',
      title: '加盟商姓名',
      width: 120,
      importWidth: true,
      render: (value, record) => {
        return isNotEmptyAny(value) ? (
          <span className={styles.name} onClick={() => onClickDetail && onClickDetail(record)}>
            {value}
          </span>
        ) : '-';
      }
    },
    { key: 'statusName', title: '加盟商状态', width: 120 },
    // { key: 'uniqueId', title: '唯一标识', width: 160 }, 加入动态表头
  ];

  const suffixColumns = [
    {
      key: 'operations',
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (value, record) => {
        return <V2Operate operateList={refactorPermissions([{ event: 'createTask',
          name: '创建拓店任务' }])} onClick={(btn) => methods[btn.func](record)}/>;
      }
    }
  ];

  // 渲染内容
  const renderColumn = (value: any) => {
    if (value?.isImg) {
      return <>
        { value?.component?.map((item) => {
          return <span className='mr-6 inline-block' dangerouslySetInnerHTML={{ __html: item }}></span>
          ;
        })}
      </>;
    }
    return isNotEmptyAny(value) ? value : '-';
  };

  const methods = useMethods({
    handleCreateTask(record: any) {
      setCurRecord(record);
      setShowCreateTaskDrawer(true);
    },
    refreshCurrentPage() {
      (tableRef.current as any).onload(true);
    }
  });

  return (
    <>
      {(isArray(column) && column.length) ? <V2Table
        ref={tableRef}
        defaultColumns={column}
        onFetch={loadData}
        hideColumnPlaceholder
        filters={filters}
        rowKey='id'
        // 64是分页模块的总大小， 42是table头部
        scroll={{ y: mainHeight - 64 - 42 }}
      /> : <></>}
      <TaskCreateDrawer
        showDrawer={showCreateTaskDrawer}
        franchiseeId={curRecord.id}
        setShowDrawer={setShowCreateTaskDrawer}
        refresh={methods.refreshCurrentPage}
      />
    </>
  );
};

export default List;
