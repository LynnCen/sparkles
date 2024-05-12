import { FC } from 'react';
// import cs from 'classnames';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import PieEcharts from '../../PieEcharts';
import cs from 'classnames';

const Sex: FC<any> = ({
  typeName,
  sex,
  isIntegration
}) => {

  return (
    <div className={cs(styles.crowdFlowPersonSex, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='04'
        name={`客群客流评估-客流概况（${typeName}）`}/>
      <div className={styles.flexCon}>
        <div className={styles.sectionLeftCon}>
          <div className='fs-19 bold'>
              性别比例
          </div>
          <PieEcharts
            config={{
              data: sex,
              legendLeft: 'left',
              legendTop: 12,
              tooltipConfig: {
                formatter: '{b}： {d}%',
              }
            }}
            height='250px'/>
        </div>
      </div>
      <div className={styles.leftFooterDoubleCircle}>
        <DoubleCircle layout='vertical'/>
      </div>
    </div>
  );
};

export default Sex;
