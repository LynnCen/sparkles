import ScrollListCard from '../../ScrollListCard';
import { replaceEmpty } from '@lhb/func';
import { Typography } from 'antd';
import React from 'react';

const { Text } = Typography;


const TrainStationList: React.FC<any> = ({
  data = {}
}) => {


  // 范围内火车站 相关
  const columns: any[] = [
    {
      dataIndex: 'name', title: '序号', width: 50
    },
    { dataIndex: 'value', title: '火车站名称', render: (_) => <Text style={{ width: 220 }} ellipsis={{ tooltip: _ }}>{replaceEmpty(_)}</Text> },
    { dataIndex: 'value2', title: '距离(m)', width: 100 },
  ];


  return (
    <ScrollListCard
      title='范围内火车站(3km)'
      columns={columns}
      dataSource={data?.data || []}
      titleTips={data?.tips}
    />
  );
};


export default TrainStationList;
