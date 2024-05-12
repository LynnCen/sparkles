import { FC, useEffect } from 'react';
// import cs from 'classnames';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import PieEcharts from '../../PieEcharts';

const PersonSex: FC<any> = ({
  person,
  sex,
  showPerson,
  showSex
}) => {

  useEffect(() => {

  }, []);

  return (
    <div className={styles.crowdFlowPersonSex}>
      <Header
        hasIndex
        indexVal='04'
        name='客群客流评估-客流概况'/>
      <div className={styles.flexCon}>
        {
          showPerson ? <div className={styles.sectionLeftCon}>
            <div className='fs-19 bold'>
                人口占比
            </div>

            <PieEcharts
              config={{
                data: person,
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
          showSex ? <div className={styles.sectionRightCon}>
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
            : null
        }
      </div>
      <div className={styles.leftFooterDoubleCircle}>
        <DoubleCircle layout='vertical'/>
      </div>
    </div>
  );
};

export default PersonSex;
