import { FC, useMemo } from 'react';
import { showTargetChart } from '@/common/utils/ways';
import cs from 'classnames';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import PieEcharts from '../../PieEcharts';

const LeisureService: FC<any> = ({
  leisure,
  service,
  isIntegration
}) => {
  const targetLeisureStr = useMemo(() => {
    // 接口数据是降序返回
    if (leisure.length && +leisure[0].data) {
      return `占比最高:${leisure[0].name}相关门店,门店数${leisure[0].data}家`;
    }
    return '';
  }, [leisure]);

  const targetServiceStr = useMemo(() => {
    // 接口数据是降序返回
    if (service.length && +service[0].data) {
      return `占比最高:${service[0].name}相关门店,门店数${service[0].data}家`;
    }
    return '';
  }, [service]);

  const showLeisure = useMemo(() => {
    return showTargetChart(leisure);
  }, [leisure]);

  const showService = useMemo(() => {
    return showTargetChart(service);
  }, [service]);

  return (
    <div className={cs(styles.leisureServiceCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='03'
        name='商业氛围评估-休闲&服务业态'/>
      <div className={styles.flexCon}>
        {
          showLeisure && (
            <div className={styles.sectionLeftCon}>
              <div className='fs-19 bold'>
                休闲业态
              </div>
              { targetLeisureStr && <div className={cs(styles.summaryStrCon, 'mb-10')}>{targetLeisureStr}</div>}
              <PieEcharts
                config={{
                  data: leisure,
                  legendLeft: 'left',
                  legendTop: 12,
                  tooltipConfig: {
                    formatter: '{b}： {d}%',
                  }
                }}
                height='250px'/>
            </div>
          )
        }
        {
          showService && (
            <div className={styles.sectionRightCon}>
              <div className='fs-19 bold'>
                服务业态
              </div>
              { targetServiceStr && <div className={cs(styles.summaryStrCon, 'mb-10')}>{targetServiceStr}</div>}
              <PieEcharts
                config={{
                  data: service,
                  legendLeft: 'left',
                  legendTop: 12,
                  tooltipConfig: {
                    formatter: '{b}： {d}%',
                  }
                }}
                height='250px'/>
            </div>
          )
        }
      </div>
      <div className={styles.leftFooterDoubleCircle}>
        <DoubleCircle layout='vertical'/>
      </div>
    </div>
  );
};

export default LeisureService;
