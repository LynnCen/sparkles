/** 婚姻情况表 */
import BoardCard from '../../BoardCard';
import { Empty, Progress } from 'antd';
import React, { useMemo } from 'react';
import styles from './index.module.less';
import { beautifyThePrice } from '@lhb/func';


const MaritalStatus: React.FC<any> = ({
  data = [],
}) => {

  const carRatio = useMemo(() => {
    return data.find(item => item.name === '有车')?.value || 0;
  }, [data]);

  const marriedRatio = useMemo(() => {
    return data.find(item => item.name === '已婚')?.value || 0;
  }, [data]);

  return (
    <BoardCard title='婚姻情况'>
      {(data).length
        ? <div className={styles['marital-con']}>
          { !!carRatio &&
                <div className={styles['flex-item']}>
                  <div className={styles['img-con']}>
                    <img
                      src='https://staticres.linhuiba.com/project-custom/pms/img/car.png'
                      width='60'
                      height='60' />
                  </div>
                  <Progress
                    percent={carRatio}
                    showInfo={false}
                  />
                  <div className={styles['label']}>
                    有车 {beautifyThePrice(carRatio, ',', 2)}%
                  </div>
                </div>
          }
          { !!marriedRatio &&
                <div className={styles['flex-item']}>
                  <div className={styles['img-con']}>
                    <img
                      src='https://staticres.linhuiba.com/project-custom/pms/img/married.png'
                      width='60'
                      height='60' />
                  </div>
                  <Progress
                    percent={marriedRatio}
                    showInfo={false}
                  />
                  <div className={styles['label']}>
                    已婚 {beautifyThePrice(marriedRatio, ',', 2)}%
                  </div>
                </div>
          }
        </div>
        : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default MaritalStatus;
