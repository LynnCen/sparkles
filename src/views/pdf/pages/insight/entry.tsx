import { FC, useEffect, useMemo, useState } from 'react';
import { urlParams } from '@lhb/func';
import { insightDetail } from '@/common/api/pdf';
import styles from './entry.module.less';
import Catalog from '@/common/components/Pdf/Insight/Catalog';
import Overview from '@/common/components/Pdf/Insight/Overview';
import City from '@/common/components/Pdf/Insight/City';
import Business from '@/common/components/Pdf/Insight/Business';
import CrowdFlow from '@/common/components/Pdf/Insight/CrowdFlow';
import Traffic from '@/common/components/Pdf/Insight/Traffic';
import Cover from '@/common/components/Pdf/Insight/Cover';


const Insight: FC<any> = () => {
  const id: number | string = urlParams(location.search)?.id || '';
  const [detailInfo, setDetailInfo] = useState<any>({});
  // 是否显示目录
  const showWhole = useMemo(() => (detailInfo?.report?.process === 4), [detailInfo]);
  const reportName = useMemo(() => (`${detailInfo?.report?.name || ''}评估报告`), [detailInfo]);

  useEffect(() => {
    +id && getDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDetail = async () => {
    const data = await insightDetail(id as number);
    data && setDetailInfo(data);
  };

  return (
    <div className={styles.container}>
      <Cover name={reportName}/>
      {showWhole && <Catalog detailInfo={detailInfo} name={reportName}/>}
      {showWhole && <Overview detailInfo={detailInfo} name={reportName}/>}
      <City isComplete={showWhole} detailInfo={detailInfo} name={reportName}/>
      {showWhole && <Business detailInfo={detailInfo} name={reportName}/>}
      {showWhole && <CrowdFlow detailInfo={detailInfo} name={reportName}/>}
      {showWhole && <Traffic detailInfo={detailInfo} name={reportName}/>}
    </div>
  );
};

export default Insight;
