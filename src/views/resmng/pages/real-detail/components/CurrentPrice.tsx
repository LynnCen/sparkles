import { FC } from 'react';
import { Descriptions } from 'antd';
import DetailTable from './DetailTable';

const { Item } = Descriptions;

interface CurrentPriceProps {
  reportPrice?: number
  otherPrice?: number
  orderPrice?: number
  remark?: number,
  columns?: any;
  dataSource?: any;
}

const CurrentPrice: FC<CurrentPriceProps> = ({ reportPrice,
  orderPrice,
  otherPrice,
  remark,
  columns,
  dataSource
}) => {
  return (
    <>
      <Descriptions bordered column={3}>
        <Item label='报批费'>{reportPrice}</Item>
        <Item label='其他杂费'>{otherPrice}</Item>
        <Item label='押金'>{orderPrice}</Item>
        <Item label='备注'>{remark}</Item>
      </Descriptions>
      <DetailTable columns={columns} dataSource={dataSource}/>
    </>
  );
};

export default CurrentPrice;
