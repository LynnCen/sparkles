import { FC } from 'react';
// import cs from 'classnames';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import PieEcharts from '../../PieEcharts';
import cs from 'classnames';


const EducationAge: FC<any> = ({
  typeName,
  education,
  age,
  showEducation,
  showAge,
  isIntegration

}) => {

  return (
    <div className={cs(styles.crowdFlowPersonSex, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='04'
        name={`客群客流评估-客流画像（${typeName}）`}/>
      <div className={styles.flexCon}>
        {
          showEducation ? <div className={styles.sectionLeftCon}>
            <div className='fs-19 bold'>
              学历分布
            </div>

            <PieEcharts
              config={{
                data: education,
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
          showAge ? <div className={styles.sectionRightCon}>
            <div className='fs-19 bold'>
              年龄分布
            </div>
            <PieEcharts
              config={{
                data: age,
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

export default EducationAge;
