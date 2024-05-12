//  KPI完成率+门店转化漏斗+进度卡片
import { FC } from 'react';
import styles from '../entry.module.less';
import { Col, Row } from 'antd';

const Card: FC<any> = () => {
  const taskList = [
    { title: '全部任务', total: 216, color: '#0050B3' },
    { title: '进行中', total: 82, color: '#006AFF' },
    { title: '已通过', total: 76, color: '#009963' },
    { title: '已开业', total: 58, color: '#132144' },

  ];
  return (
    <div className={styles.bottomCardCon}>

      <div className={styles.finish}>
        <div className={styles.title}>
          <span className='fs-16 bold pl-8'>
            KPI完成情况
          </span>
        </div>
        <div className={styles.kpiFinishBg}>
          <img
            src='https://staticres.linhuiba.com/project-custom/locationpc/demo/bg_pc_kpi_finish.png'
            width='100%'
            height='100%' />
        </div>
      </div>

      <div className={styles.funnel}>
        <div className={styles.title}>
          <span className='fs-16 bold pl-8'>
            门店转化漏斗
          </span>
        </div>
        <div className={styles.funnelBg}>
          <img
            src='https://staticres.linhuiba.com/project-custom/locationpc/demo/bg_pc_funnel.png'
            width='100%'
            height='100%' />
        </div>
      </div>

      <Row className={styles.taskCard} gutter={16}>
        {
          taskList.map((item, index) => (

            <Col span={12} key={index} >
              <div className={styles.card}>
                <span className={styles.circle} style={{ borderColor: item.color }}> </span>
                <div className={styles.cardTitle}>
                  {item.title}
                </div>
                <div className={styles.cardNums}>
                  {item.total}
                </div>
              </div>

            </Col>
          ))
        }
      </Row>
    </div>
  );
};
export default Card;
