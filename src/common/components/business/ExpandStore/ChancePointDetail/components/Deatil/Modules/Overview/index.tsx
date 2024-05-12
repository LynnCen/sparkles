/**
 * @Description 项目综述
 */

import { FC } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';

const Overview:FC<any> = ({
  data,
}) => {
  const { projectOverviewModule } = data || {};
  return (
    <>
      <V2Title
        type='H2'
        text={data?.moduleTypeName}
        divider
        className='mt-20'
      />
      <div className={styles.overviewCon}>
        <div className={cs('mt-8 ft-space c-222 fs-14', styles.textAreaCon)}>
          {projectOverviewModule?.textValue }
        </div>
        <div className={styles.illustrationCon}>
          <img
            src='https://staticres.linhuiba.com/project-custom/locationpc/chancepoint_overview_illustration@2x.png'
            width='100%'
            height='100%'
          />
        </div>
      </div>
    </>
  );
};

export default Overview;
