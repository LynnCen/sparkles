import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { Typography } from 'antd';
const { Link } = Typography;

interface IProps {
  loadData: Function;
  params: Record<string, any>;
  openDetail: Function; // 打开详情
  mainHeight?: any;
}

const List: FC<IProps> = ({
  loadData,
  params,
  openDetail,
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
}) => {
  const columns = [
    {
      title: '区域名称',
      key: 'name',
      dragChecked: true,
      render: (text, record) => <Link onClick={() => openDetail(record)}>{text}</Link>,
    },
    {
      title: '所属省市',
      key: 'area',
      importWidth: true,
      dragChecked: true,
    },
    {
      title: '评分',
      key: 'score',
      importWidth: true,
      dragChecked: true,
    },
  ];

  return (
    <V2Table
      onFetch={loadData}
      filters={params}
      rowKey='id'
      // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
      scroll={{ y: mainHeight - 64 - 42 }}
      defaultColumns={columns}
      hideColumnPlaceholder
      emptyRender
    />
  );
};

export default List;
