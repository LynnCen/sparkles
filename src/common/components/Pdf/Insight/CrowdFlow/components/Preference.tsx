import { FC, useEffect } from 'react';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import RotaryBarEcharts from '../../RotaryBarEcharts';
import cs from 'classnames';

const Preference: FC<any> = ({
  typeName,
  showVisiting,
  showApp,
  visiting,
  app,
  isIntegration
}) => {

  // const [state, setState] = useState<>();

  useEffect(() => {

  }, []);

  return (
    <div className={cs(styles.preferenceCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='04'
        name={`客群客流评估-客群偏好（${typeName}）`}/>
      <div className={styles.flexCon}>
        {
          showVisiting ? <div className={styles.sectionLeftCon}>
            <div className='fs-19 bold'>
              到访偏好
            </div>
            <RotaryBarEcharts
              config={{
                data: visiting,
                isPercent: true
              }}
              width='100%'
              height='450px'/>
          </div>
            : null
        }
        {
          showApp ? <div className={styles.sectionRightCon}>
            <div className='fs-19 bold'>
              APP偏好
            </div>
            <RotaryBarEcharts
              config={{
                data: app,
                isPercent: true
              }}
              width='100%'
              height='450px'/>
          </div>
            : null
        }
      </div>
      <DoubleCircle/>
    </div>
  );
};

export default Preference;
