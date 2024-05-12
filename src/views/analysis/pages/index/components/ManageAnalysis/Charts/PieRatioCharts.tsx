import { FC, useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import PieCharts from '@/common/components/EChart/PieChart';
import { orderProportion } from '@/common/api/order';
import { PieChartsProps } from '@/views/analysis/pages/index/ts-config';

const initPieData = { saleData: [], orderData: [] };

const percentValue = (totalNum: number, value: number) => {
  return totalNum === 0 ? 0 : Number((((value || 0) / totalNum) * 100).toFixed(2));
};

const PieRatioCharts: FC<PieChartsProps> = ({ filters }) => {
  const { start, end, storeIds } = filters;
  const [data, setData] = useState<any>(initPieData);

  useEffect(() => {
    if (start && end && storeIds) {
      const getPieChartsData = async () => {
        const result = await orderProportion({ storeIds: [storeIds], start, end });
        const proportionList = result.proportionList;
        const totalAmount = result?.total?.saleAmount || 0;
        const totalOrder = result?.total?.order || 0;
        if (Array.isArray(proportionList) && proportionList.length) {
          const data = proportionList[0];
          const saleData = {
            elePercent: percentValue(totalAmount, data?.elSaleAmount),
            mtPercent: percentValue(totalAmount, data?.mtSaleAmount),
          };
          const orderData = {
            elePercent: percentValue(totalOrder, data?.elOrder),
            mtPercent: percentValue(totalOrder, data?.mtOrder),
          };
          setData({
            saleData: [
              { name: '饿了么订单', value: saleData.elePercent },
              { name: '美团外卖', value: saleData.mtPercent },
              {
                name: '店内销售',
                value: totalAmount === 0 ? 0 : (100 - saleData.elePercent - saleData.mtPercent).toFixed(2),
              },
            ],
            orderData: [
              { name: '饿了么订单', value: orderData.elePercent },
              { name: '美团外卖', value: orderData.mtPercent },
              {
                name: '店内销售',
                value: totalOrder === 0 ? 0 : (100 - orderData.elePercent - orderData.mtPercent).toFixed(2),
              },
            ],
          });
        } else {
          setData(initPieData);
        }
      };
      getPieChartsData();
    }
  }, [start, end, storeIds]);

  return (
    <Row gutter={[40, 20]}>
      <Col span={12}>
        <Card>
          <PieCharts title='销售额来源占比' data={data.saleData} />
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <PieCharts title='订单来源占比' data={data.orderData} />
        </Card>
      </Col>
    </Row>
  );
};

export default PieRatioCharts;
