import { FC, useEffect, useMemo } from 'react';
import { Divider, Progress } from 'antd';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import PieEcharts from '../../PieEcharts';
import RotaryBarEcharts from '../../RotaryBarEcharts';
import cs from 'classnames';

const MarriageIndustry: FC<any> = ({
  typeName,
  showMarriage,
  showIndustry,
  car,
  married,
  childrenAge,
  industry,
  isIntegration
}) => {

  // const [state, setState] = useState<>();
  const carRatio = useMemo(() => {
    if (Array.isArray(car) && car.length) {
      const targetItem = car.find((item) => item.name === '是');
      if (targetItem) {
        return +((+targetItem.data * 100).toFixed(2));
      }
      return 0;
    }
    return 0;
  }, [car]);

  const marriedRatio = useMemo(() => {
    if (Array.isArray(married) && married.length) {
      const targetItem = married.find((item) => item.name === '已婚');
      if (targetItem) {
        return +((+targetItem.data * 100).toFixed(2));
      }
      return 0;
    }
    return 0;
  }, [married]);

  useEffect(() => {

  }, []);

  return (
    <div className={cs(styles.marriageIndustryCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='04'
        name={`客群客流评估-客流画像（${typeName}）`}/>
      <div className={styles.flexCon}>
        {
          showMarriage ? <div className={styles.sectionLeftCon}>
            <div>
              <div className='fs-19 bold'>
                婚姻情况
              </div>
              <div className={styles.flexSection}>
                <div className={styles.flexItem}>
                  <div className={styles.imgCon}>
                    <img
                      src='https://staticres.linhuiba.com/project-custom/location-insight/own-car.png'
                      width='100%'
                      height='100%' />
                  </div>
                  <div className='mt-8'>
                    <Progress
                      percent={carRatio}
                      showInfo={false}
                      strokeColor='#7546FF'
                      style={{ width: '90px' }}/>
                  </div>
                  <div className='fs-16'>
                    有车 {carRatio}%
                  </div>
                </div>
                <div className={styles.flexItem}>
                  <div className={styles.imgCon}>
                    <img
                      src='https://staticres.linhuiba.com/project-custom/location-insight/is-married.png'
                      width='100%'
                      height='100%' />
                  </div>
                  <div className='mt-8'>
                    <Progress
                      percent={marriedRatio}
                      showInfo={false}
                      strokeColor='#FFA755'
                      style={{ width: '90px' }}/>
                  </div>
                  <div className='fs-16'>
                  已婚 {marriedRatio}%
                  </div>
                </div>
              </div>
            </div>
            <Divider style={{ borderTopColor: '#4D4D4D' }}/>
            <div>
              <div className='fs-19 bold'>
                子女年龄情况
              </div>

              <PieEcharts
                config={{
                  data: childrenAge,
                  legendLeft: 'left',
                  legendTop: 12,
                  tooltipConfig: {
                    formatter: '{b}： {d}%',
                  }
                }}
                height='250px'/>
            </div>
          </div>
            : null
        }
        {
          showIndustry ? <div className={styles.sectionRightCon}>
            <div className='fs-19 bold'>
              所在行业分布
            </div>
            <RotaryBarEcharts
              config={{
                data: industry,
                isPercent: true
              }}
              width='100%'
              height='450px'/>
          </div>
            : null
        }
      </div>
      <div className={styles.leftFooterDoubleCircle}>
        <DoubleCircle layout='vertical'/>
      </div>
    </div>
  );
};

export default MarriageIndustry;
