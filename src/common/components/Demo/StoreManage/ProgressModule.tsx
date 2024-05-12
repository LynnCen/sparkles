import { FC, useEffect } from 'react';
import { Progress } from 'antd';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';

const ProgressModule: FC = () => {

  // const [state, setState] = useState<>();

  useEffect(() => {

  }, []);

  return (
    <div className={cs(styles.progressCon, 'mt-16')}>
      <div className='fs-20 bold'>
        开店计划进度统计
      </div>
      <div className={styles.mainCon}>
        <div className={styles.leftCon}>
          <div className={styles.titCon}>
            <div className={styles.iconCon}>
              <IconFont iconHref='iconic-xinkaimendian' className='color-white fs-16'/>
            </div>
            <div className='fs-18 bold pl-10'>
              新开门店完成率
            </div>
          </div>
          <div className='mt-36 ct'>
            <div className='fs-14 c-656'>
              当前完成率
            </div>
            <div className={styles.rateNum}>
              83.3%
            </div>
          </div>
          <div className={styles.progressSection}>
            <div className={cs(styles.easyFlex, 'fs-14 c-959')}>
              <div>0</div>
              <div>378</div>
            </div>
            <Progress
              percent={81.6}
              strokeColor={{
                '0%': '#0098fa',
                '100%': '#006af9',
              }}
              status='active'
              strokeWidth={12}
              showInfo={false}
              className='mt-10'/>
            <div className={cs(styles.easyFlex, 'mt-20 fs-12 c-656')}>
              <div>新店平均完成率：81.6%</div>
              {/* <div>
                <span>较昨日</span>
                <span className='pl-16 c-009 fs-14'>
                  <IconFont iconHref='icondown' className='fs-12'/>
                  <span className='vm'>12%</span>
                </span>
              </div> */}
            </div>
          </div>

        </div>
        <div className={styles.rightCon}>
          <div className='fs-20 bold'>
            开店情况拆解
          </div>
          <div className={styles.chartImgCon}>
            <div className={styles.imgPlanCon}>
              <img
                src='https://staticres.linhuiba.com/project-custom/locationpc/demo/bg_chart_ring_plan@2x.png'
                width='100%'
                height='100%'/>
            </div>
            <div className={styles.imgPracticalCon}>
              <img
                src='https://staticres.linhuiba.com/project-custom/locationpc/demo/bg_chart_ring_practical@2x.png'
                width='100%'
                height='100%'/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressModule;
