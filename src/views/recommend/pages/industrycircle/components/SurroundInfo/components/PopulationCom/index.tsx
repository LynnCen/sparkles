/**
 * @Description 周边人群
 */

import { FC } from 'react';
import V2Empty from '@/common/components/Data/V2Empty';
import V2Title from '@/common/components/Feedback/V2Title';
import { Row, Col } from 'antd';
import SingleDev from '../SingleDev';
import styles from '../../index.module.less';

const PopulationCom: FC<any> = ({
  list
}) => {


  return Array.isArray(list) && !!list.length
    ? <div className={styles.populationCom}>
      { list.map((raduisItem, index: number) => (
        <div key={index} className={styles.sheets}>
          <V2Title className={styles.title} text={raduisItem?.raduis + '范围半径'} type='H3' divider/>
          <Row gutter={8}>
            {raduisItem?.raduisInfo?.map((item, index) =>
              <Col span={12}>
                <SingleDev
                  index={index}
                  item={item}
                />
              </Col>
            )}
          </Row>
        </div>))}
    </div>
    : <div style={{ height: 315 }}>
      <V2Empty
        type='search'
        customTip= '正在查询中，请稍后查看！'
        centerInBlock
      />
    </div>;
};

export default PopulationCom;
