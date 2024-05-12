import { FC } from 'react';
// useEffect, useState
// import { targetMaxItem } from '@/common/utils/ways';
import styles from '../../entry.module.less';
import Header from '../../Header';
import BarEcharts from '../../BarEcharts';
import DoubleCircle from '../../DoubleCircle';
import cs from 'classnames';

const Exponent: FC<any> = ({
  typeName,
  flowHour,
  isIntegration
}) => {

  return (
    <div className={cs(styles.crowdFlowExponent, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='04'
        name={`客群客流评估-月${typeName}每小时客流指数`}/>
      <div className='mt-20'>
        <BarEcharts
          config={{
            data: flowHour,
            // isPercent: true
          }}
          width='100%'
          height='480px'/>
      </div>
      <DoubleCircle/>
    </div>
  );
};

export default Exponent;
