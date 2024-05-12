
import { FC, useEffect, useState } from 'react';
import Card from './card';
import { floorKeep } from '@lhb/func';
import { Col, Row } from 'antd';

import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';

const AdaptiveCards:FC<any> = ({
  searchParams = {},
}) => {
  const [data, setData] = useState<any[]>([]);

  const methods = useMethods({
    getBulletinData() {
      // https://yapi.lanhanba.com/project/532/interface/api/70391
      post('/standard/home/data/bulletin', { ...searchParams }).then(({ values }) => {
        setData(values);
      });

    }
  });

  const renderCards = () => {
    const _colSpan = floorKeep(24, data.length, 4, 0);
    switch (data.length) {
      case 5:
        return <div className={styles.content_five}>
          {data.map((item, index) => {
            return <div key={index} className={styles['content_five-item']}>
              <Card data={item}/>
            </div>;
          })}
        </div>;
      case 7:
        const firstArr:any[] = data.slice(0, 4);
        const secondArr:any[] = data.slice(4, 8);
        return <Row gutter={[12, 12]}>
          {firstArr.map((item, index) => {
            return <Col span={6}key={index}>
              <Card data={item}/>
            </Col>;
          })}
          {secondArr.map((item, index) => {
            return <Col span={8}key={index}>
              <Card data={item}/>
            </Col>;
          })}
        </Row>;
      case 8:
        return <Row gutter={[12, 12]}>
          {data.map((item, index) => {
            return <Col span={6}key={index}>
              <Card data={item}/>
            </Col>;
          })}
        </Row>;
    }

    return <Row gutter={[12, 12]}>
      {data.map((item, index) => {
        return <Col span={_colSpan}key={index}>
          <Card data={item}/>
        </Col>;
      })}
    </Row>;

  };

  useEffect(() => {
    methods.getBulletinData();
  }, [searchParams]);


  return <div className={styles.adaptiveCardsCon}>
    {renderCards()}
  </div>;
};

export default AdaptiveCards;
