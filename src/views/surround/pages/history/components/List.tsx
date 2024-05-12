/**
 * @Description 周边查询历史-列表组件
 */
import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { Typography } from 'antd';
import { isDef } from '@lhb/func';
import { fixNumberSE } from '@/common/utils/ways';
const { Link } = Typography;

interface IProps {
  loadData: Function;
  openDetail: Function; // 打开详情
  mainHeight?: any;
}

const List: FC<IProps> = ({
  loadData,
  openDetail,
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
}) => {
  const columns = [
    { title: '查询地点', key: 'address', render: (text, record) => `${record?.borders ? '【自定义形状】' : ''}${text}` },
    { title: '查询范围', key: 'radius', render: (text, record) =>
      record?.borders
      // 自定义商圈
        ? `${record?.area > 1 ? record?.area?.toFixed(2) + 'k㎡' : record?.area * 1000 * 1000 + '㎡'}`
        : isDef(text) ? (+text < 1000 ? `${+text}m` : `${fixNumberSE(text / 1000.0)}km`) : '-' },
    { title: '查询时间', key: 'createdAt' },
    { title: '操作', key: 'operation', render: (_, record) => <Link onClick={() => openDetail(record)}>查看详情</Link>, },
  ];

  return (
    <V2Table
      onFetch={loadData}
      type='easy'
      rowKey='id'
      // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
      scroll={{ y: mainHeight - 64 - 42 }}
      defaultColumns={columns}
      hideColumnPlaceholder={true}
    />
  );
};

export default List;
