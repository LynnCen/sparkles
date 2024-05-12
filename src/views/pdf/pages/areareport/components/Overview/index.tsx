/**
 * @Description 整体情况
 */

import { FC, useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { getModelClusterOverView } from '@/common/api/networkplan';
import { ChildreClass } from '../../ts-config';
import { PageHeader, PageFooter } from '../Layout';
import cs from 'classnames';
import styles from './index.module.less';
import Basic from './Basic';
import Evaluations from './Evaluations';

const Overview: FC<any> = ({
  token,
  detail,
  homeData,
  targetChildClass,
  isChancepoint,
  // computeModuleMap,
}) => {
  const { id } = detail || {};
  const [overviewData, setOverviewData] = useState<any>({});

  useEffect(() => {
    id && loadData();
    // id && computeModuleMap('overallRating', true);
  }, [id]);

  const { loadData } = useMethods({
    loadData: async () => {
      const res = await getModelClusterOverView({
        id,
        pdfPageUserToken: token,

      });
      setOverviewData(res);

    }
  });
  return (
    <div className={cs(ChildreClass, targetChildClass || '', styles.overviewCon)}>
      <PageHeader
        moduleCount={1}
        title={ isChancepoint ? '商圈·整体评价' : '整体评价'}
      />
      <div className={styles.contentCon}>
        <Basic
          token={token}
          detail={detail}
        />
        <Evaluations
          detail={overviewData}
        />
        {/* 行业密度 */}
        {(overviewData?.densityIntro) ? <div className={styles.descCon}>
          <span className='font-weight-500 c-222'>行业密度：</span>{overviewData.densityIntro || '-'}
        </div> : <></>}
      </div>
      <div className={styles.footerCon}>
        <PageFooter logo={homeData?.tenantLogo}/>
      </div>
    </div>
  );
};

export default Overview;
