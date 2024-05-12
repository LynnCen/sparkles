import { FC } from 'react';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import ItemTable from './ItemTable';
import cs from 'classnames';

const GasTrain: FC<any> = ({
  radius,
  gasStation,
  trainStation,
  type,
  isIntegration

}) => {
  return (
    <div className={cs(styles.trafficGasTrainCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='05'
        name='交通便利评估-交通概况'/>
      <div className={styles.flexCon}>
        { gasStation.length > 0
          ? (
            <div className={styles.sectionLeftCon}>
              <ItemTable
                type={type}
                radius={radius}
                label='加油站'
                listData={gasStation}/>
            </div>
          )
          : null
        }
        {
          trainStation.length > 0
            ? (
              <div className={styles.sectionRightCon}>
                <ItemTable
                  type={type}
                  radius={radius}
                  label='火车站'
                  listData={trainStation}/>
              </div>
            )
            : null
        }
      </div>
      <div className={styles.leftFooterDoubleCircle}>
        <DoubleCircle layout='vertical'/>
      </div>
    </div>
  );
};

export default GasTrain;
