import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Col, Row, Table, Divider } from 'antd';
import { FC, useEffect, useState } from 'react';
import DetailInfo from '@/common/components/business/DetailInfo';

interface IProps {
  result: any;
  isFood?: boolean;
}

const CompeteInfo: FC<IProps> = ({
  result,
  isFood
}) => {
  const [data, setData] = useState<any>([]);
  const columns = [
    {
      title: '竞品编号',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: '品牌名称',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: '所在楼层',
      dataIndex: 'floor',
      key: 'floor',
      render: (value: any) => (value ? `${value}层` : '-')
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      render: (value: any) => (value ? `${value}㎡` : '-')
    },
    {
      title: '距离本店铺',
      dataIndex: 'distance',
      key: 'distance',
      render: (value: any) => (value ? `${value}m` : '-')
    },
  ];

  useEffect(() => {
    if (
      result?.competeBrandOverview?.competeInformationList &&
      result?.competeBrandOverview?.competeInformationList.length
    ) {
      let noStart = 1;
      result.competeBrandOverview.competeInformationList.forEach((item) => {
        item.no = noStart;
        noStart += 1;
      });
      setData(result.competeBrandOverview.competeInformationList);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <>
      {
        isFood ? (<>
          <TitleTips name='竞品概述' showTips={false} />
          <Row>
            <DetailInfo title='直接相邻品牌' value='蜀味香' />
            <DetailInfo title='相似品牌年销售额（元/年）' value='300000' />
            <DetailInfo title='竞争力分析' value='特色菜品较多' />
          </Row>
          <Divider/>
          <TitleTips name='竞品详情' showTips={false} />
          <div className='fs-16'>
            竞品一
          </div>
          <Row className='mt-12'>
            <DetailInfo title='品牌名称' value='蜀味香' />
            <DetailInfo title='所在楼层（F）' value='1' />
            <DetailInfo title='竞对店铺面积（平米）' value='74' />
            <DetailInfo title='距离本店铺（米）' value='300' />
            <DetailInfo title='竞对客流情况（人/天）' value='蜀味香' />
            <DetailInfo title='竞对店铺门宽（米）' value='4' />
            <DetailInfo title='竞对店铺视频' value='-' />
          </Row>
        </>) : (<>
          <TitleTips name='竞品信息' showTips={false} />
          <Row>
            <Col span={24}>
              <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                rowKey='no'
              />
            </Col>
          </Row>
        </>)
      }
    </>
  );
};

export default CompeteInfo;
