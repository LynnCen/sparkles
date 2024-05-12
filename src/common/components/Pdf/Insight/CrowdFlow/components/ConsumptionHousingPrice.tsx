import { FC, useEffect } from 'react';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import PieEcharts from '../../PieEcharts';
import cs from 'classnames';

const ConsumptionHousingPrice: FC<any> = ({
  typeName,
  consumption,
  housePrice,
  showConsumption,
  showHousePrice,
  isIntegration

}) => {

  // const [state, setState] = useState<>();

  useEffect(() => {

  }, []);

  return (
    <div className={cs(styles.consumptionHousingPrice, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='04'
        name={`客群客流评估-客群消费水平（${typeName}）`}/>
      <div className={styles.flexCon}>
        {
          showConsumption ? <div className={styles.sectionLeftCon}>
            <div className='fs-19 bold'>
              消费水平
            </div>

            <PieEcharts
              config={{
                data: consumption,
                legendLeft: 'left',
                legendTop: 12,
                tooltipConfig: {
                  formatter: '{b}： {d}%',
                }
              }}
              height='250px'/>
          </div>
            : null
        }
        {
          showHousePrice ? <div className={styles.sectionRightCon}>
            <div className='fs-19 bold'>
              居住社区房价等级
            </div>
            <PieEcharts
              config={{
                data: housePrice,
                legendLeft: 'left',
                legendTop: 12,
                tooltipConfig: {
                  formatter: '{b}： {d}%',
                }
              }}
              height='250px'/>
          </div>
            : null
        }
      </div>
      <DoubleCircle/>
    </div>
  );
};

export default ConsumptionHousingPrice;
