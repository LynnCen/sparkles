/**
 * @Description 价格记录列表
 */
import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { OperateButtonProps } from '@/common/components/Others/V2Operate';
import { isNotEmptyAny } from '@lhb/func';

interface TableProps {
  onRefresh?: (value: any) => void; // 刷新列表
  mainHeight?: number; // 高度
  onFetch?: () => void; // 加载列表
  filters?: any; // 筛选数据
  permissions?: OperateButtonProps[]; // 按钮列表
  /** 重新加载 */
  reload?: () => void;
}



const TableList: FC<TableProps> = ({
  onFetch, // 加载数据
  mainHeight = 0,
  filters, // 筛选参数
  ...props
}) => {
  const columns = [
    {
      title: '行政区划代码',
      key: 'regionCode',
      dataIndex: 'regionCode',
      dragChecked: true,
      width: 170,
      render: (val: string) => isNotEmptyAny(val) ? val : '-',
    },
    {
      title: '省份',
      key: 'provinceName',
      dataIndex: 'provinceName',
      dragChecked: true,
      width: 170,
      render: (val: string) => isNotEmptyAny(val) ? val : '-',
    },
    {
      title: '城市',
      key: 'cityName',
      dataIndex: 'cityName',
      dragChecked: true,
      width: 170,
      render: (val: string) => isNotEmptyAny(val) ? val : '-',
    },
    {
      title: '区县',
      dataIndex: 'countyName',
      key: 'countyName',
      dragChecked: true,
      width: 170,
      render: (val: string) => isNotEmptyAny(val) ? val : '-',
    },
    {
      title: '默认类型',
      dragChecked: true,
      dataIndex: 'defaultType',
      key: 'defaultType',
      width: 170,
      render: (val: string) => isNotEmptyAny(val) ? val : '-',
    },
    {
      title: '实际类型',
      key: 'actualType',
      dataIndex: 'actualType',
      dragChecked: true,
      render: (val: string) => isNotEmptyAny(val) ? val : '-',
    },
  ];

  return (
    <V2Table
      rowKey='regionCode'
      filters={filters}
      scroll={{ x: 'max-content', y: mainHeight - 64 - 42 - 18 }}
      defaultColumns={columns}
      onFetch={onFetch}
      hideColumnPlaceholder
      emptyRender={true}
      {...props}
    />
  );
};

export default TableList;
