/**
 * @Description 商圈详情概览
 */

import { FC } from 'react';
import { isNotEmpty } from '@lhb/func';
// import cs from 'classnames';
import styles from './index.module.less';
import Evaluations from './Evaluations';
import Basic from './Basic';

const AreaOverview: FC<any> = ({
  overViewData,
  detail
}) => {

  return (
    <div className={styles.mainBacCon}>
      <div className={styles.basCon}>
        <Evaluations detail ={overViewData}/>
        <Basic
          detail={detail}
          overView={overViewData}
        />
      </div>
      {/* 行业密度 */}
      {isNotEmpty(overViewData?.densityIntro) ? <div className={styles.descCon}>
        <span className='bold c-222'>行业密度：</span>{overViewData.densityIntro || '-'}
      </div> : <></>}
    </div>
  );
};

export default AreaOverview;
