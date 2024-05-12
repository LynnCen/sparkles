import { FC } from 'react';
import { Tooltip } from 'antd';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import CustomerEmpty from '@/common/components/Empty';

const AreaOverview: FC<any> = ({ data }) => {
  return (
    <div className={styles.overviewCon}>
      <div className='fs-20 bold'>开店计划分配</div>
      <div className={styles.valueCon}>
        {data.length > 0 ? data.map((item: any, index: number) => (
          <div key={index}>
            <div className='c-656'>
              <span className='fs-14 pr-6'>{item.groupName}</span>
              <Tooltip title={item.groupName}>
                <span>
                  <IconFont iconHref='iconquestion-o' />
                </span>
              </Tooltip>
            </div>
            <div className='mt-6'>
              <span className={styles.numStyle}>{item.count}</span>
            </div>
          </div>
        )) : <CustomerEmpty />}
      </div>
    </div>
  );
};

export default AreaOverview;
