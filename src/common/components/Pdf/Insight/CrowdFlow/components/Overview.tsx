import { FC, useEffect, useMemo } from 'react';
import { Descriptions } from 'antd';
import cs from 'classnames';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import Gauge from './Gauge';

const Overview: FC<any> = ({
  info,
  isIntegration
}) => {
  const complexInfo = useMemo(() => (info.complex || {}), [info]);
  const flowInfo = useMemo(() => (info.flow || {}), [info]);
  // const [state, setState] = useState<>();

  useEffect(() => {

  }, []);

  return (
    <div className={cs(styles.crowdFlowOverviewCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='04'
        name='客群客流评估-客流概况'/>
      <div className={styles.flexCon}>
        <div className={styles.sectionLeftCon}>
          <div className='fs-19 bold'>
            客流指数
            <div className={cs(styles.summaryStrCon, 'mb-10')}>
              周期内使用过LBS定位服务的人数，一天到访多次计为1次，多用于客流趋势的判断及多位置或区域之间的对比
            </div>
            <div className={styles.flexSection}>
              <Gauge data={flowInfo}/>
              <div>
                <div className={styles.dailyCon}>
                  <div className='color-white'>
                    { flowInfo.workdayFlow }
                  </div>
                  <div>
                    工作日日均
                  </div>
                </div>
                <div className={cs(styles.dailyCon, 'mt-12')}>
                  <div className='color-white'>
                    { flowInfo.holidayFlow }
                  </div>
                  <div>
                    节假日日均
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.sectionRightCon}>
          <div className='fs-19 bold'>
            客群客流评估
          </div>
          <div>
            <span className='c-02e fs-50'>{complexInfo?.preferenceScoreDescription}</span>
            {/* <span className='fs-14 cOpaWhite pl-8'>分/100</span> */}
          </div>
          <div className='fs-14 cOpaWhite'>
            {complexInfo?.message}
          </div>
          <Descriptions column={24} className='mt-30'>
            <Descriptions.Item
              label='客流概况'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {complexInfo.flowStatus ? `客流${complexInfo.flowStatus}` : ''}
            </Descriptions.Item>
            <Descriptions.Item
              label='客流画像'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {`${complexInfo.man ? `男性${(complexInfo.man * 100).toFixed(2)}%` : ''}${complexInfo.women ? `女性${(complexInfo.women * 100).toFixed(2)}%` : ''}${complexInfo.man || complexInfo.women ? '，' : ''}${complexInfo.age ? `${complexInfo.age}岁，` : ''}${complexInfo.education ? `${complexInfo.education}学历为主` : ''}`}
            </Descriptions.Item>
            <Descriptions.Item
              label='客群消费水平'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {`${complexInfo.consumptionLevel ? `消费水平${complexInfo.consumptionLevel}，` : ''}${complexInfo.housePrice ? `居住社区房价${complexInfo.housePrice}` : ''}`}
            </Descriptions.Item>
            <Descriptions.Item
              label='客群偏好'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {`${complexInfo.visiting ? `${complexInfo.visiting}为主，` : ''}${complexInfo.app ? `${complexInfo.app}为主` : ''}`}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <DoubleCircle/>
    </div>
  );
};

export default Overview;
