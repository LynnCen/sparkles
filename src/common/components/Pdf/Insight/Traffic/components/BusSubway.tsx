import { FC } from 'react';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import ItemTable from './ItemTable';
import cs from 'classnames';

const BusSubway: FC<any> = ({
  radius,
  busStop,
  subwayStation,
  type,
  isIntegration
}) => {

  return (
    <div className={cs(styles.trafficBusSubwayCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='05'
        name='交通便利评估-交通概况'/>
      <div className={styles.flexCon}>
        { busStop.length > 0
          ? (
            <div className={styles.sectionLeftCon}>
              <ItemTable
                type={type}
                radius={radius}
                label='公交站'
                listData={busStop}/>
            </div>
          )
          : null
        }
        {
          subwayStation.length > 0
            ? (
              <div className={styles.sectionRightCon}>
                <ItemTable
                  type={type}
                  radius={radius}
                  label='地铁站'
                  listData={subwayStation}/>
              </div>
            )
            : null
        }
      </div>
      <DoubleCircle/>
    </div>
  );
};

export default BusSubway;
