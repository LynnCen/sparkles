/**
 * @Description 系统日志-列表
 */

import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { isArray, isNotEmpty } from '@lhb/func';
import { getSystemLog } from '@/common/api/system';

interface ListProps {
  mainHeight?: any;
  filters?: any;
}

const List: FC<ListProps> = ({
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  filters = {},
}) => {
  /**
   * @description 获取加载table表格数据。该函数依赖filters变化自动触发
   * @param params filters和搜索框参数
   * @return table数据
   */
  const loadData = async (params) => {
    console.log('loadData', params);

    const { orderBy, order } = params;
    const hasOrder = !!(orderBy && order);
    params.sortField = hasOrder ? orderBy : undefined;
    params.sort = hasOrder ? order : undefined;
    delete params.orderBy;
    delete params.order;

    const { objectList, totalNum } = await getSystemLog({ ...params });
    return {
      dataSource: isArray(objectList) ? objectList : [],
      count: totalNum,
    };
  };

  const defaultColumns = [
    {
      key: 'reportTime',
      title: '操作时间',
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (value) => isNotEmpty(value) ? value.replace('T', ' ').replaceAll('-', '.') : '-'
    },
    {
      key: 'branchCompanyName',
      title: '分公司',
      dragChecked: true,
      render: (value) => isNotEmpty(value) ? value : '-'
    },
    {
      key: 'positionName',
      title: '岗位',
      dragChecked: true,
      render: (value) => isNotEmpty(value) ? value : '-'
    },
    {
      key: 'userName',
      title: '操作人',
      dragChecked: true,
      render: (value) => isNotEmpty(value) ? value : '-'
    },
    {
      key: 'source',
      title: '操作平台',
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      key: 'menuModuleName',
      title: '操作菜单',
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (value) => isNotEmpty(value) ? value : '-'
    },
    {
      key: 'operationFunction',
      title: '操作功能',
      dragChecked: true,
      render: (value) => isNotEmpty(value) ? value : '-'
    },
    {
      key: 'eventName',
      title: '记录事件',
      dragChecked: true,
      render: (value) => isNotEmpty(value) ? value : '-'
    },
  ];

  return (
    <>
      <V2Table
        defaultColumns={defaultColumns}
        onFetch={loadData}
        hideColumnPlaceholder={true}
        filters={filters}
        rowKey='id'
        tableSortModule='consoleSystemLog1000'
        emptyRender
        // 64是分页模块的总大小， 42是table头部
        scroll={{ y: mainHeight - 64 - 42 }}
        pageSize={50}
      />
    </>
  );
};

export default List;
