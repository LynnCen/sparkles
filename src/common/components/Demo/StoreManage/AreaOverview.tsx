import { FC } from 'react';
import { Tooltip } from 'antd';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';

const AreaOverview: FC<any> = ({
  demoData,
  setTaregtData
}) => {
  return (
    <div className={styles.overviewCon}>
      <div className='fs-20 bold'>
        开店计划分配
      </div>
      <div className={styles.valueCon}>
        {
          demoData.map((item: any, index: number) => (
            <div key={index}>
              <div className='c-656'>
                <span className='fs-14 pr-6'>{item.name}</span>
                <Tooltip title={item.tooltipText}>
                  <span><IconFont iconHref='iconquestion-o'/></span>
                </Tooltip>
              </div>
              <div className='mt-6'>
                {/* {item.value} */}
                <span className={styles.numStyle}>{item.value}</span>
                <span className='c-006 fs-12 pl-8 vtt pointer' onClick={() => setTaregtData && setTaregtData(item)}>去查看</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default AreaOverview;
