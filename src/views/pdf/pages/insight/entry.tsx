import { FC, useEffect, useMemo, useState } from 'react';
import { urlParams } from '@lhb/func';
import { getReportDetail, reviewExportPdf } from '@/common/api/pdf';
import styles from './entry.module.less';
import Overview from '@/common/components/Pdf/Insight/Overview';
import City from '@/common/components/Pdf/Insight/City';
import Business from '@/common/components/Pdf/Insight/Business';
import CrowdFlow from '@/common/components/Pdf/Insight/CrowdFlow';
import Traffic from '@/common/components/Pdf/Insight/Traffic';
import Catalog from '@/common/components/Pdf/Insight/Catalog';
import Cover from '@/common/components/Pdf/Insight/Cover';
import PdfList from '@/common/components/Pdf/Insight/PdfList';
import OverviewOfPassengerFlow from '@/common/components/Pdf/Insight/OverviewOfPassengerFlow';
import PeripheralData from '@/common/components/Pdf/Insight/PeripheralData ';

const Insight: FC<any> = () => {
  const id: number | string = urlParams(location.search)?.id || '2058';
  const [detailInfo, setDetailInfo] = useState<any>(null);
  const [surroundData, setSurroundData] = useState<any>(null);
  // 是否显示目录
  const showWhole = useMemo(() => (surroundData?.report?.process === 4), [surroundData]);

  const reportName = useMemo(() => {
    const brandName = detailInfo?.shopInfo?.brandName || '';
    const address = detailInfo?.checkSpotInfo?.address || '';

    return brandName ? brandName + '/' + address : address;
  }, [detailInfo]);

  useEffect(() => {
    +id && getDetail();
    +id && getSurroundData();
  }, [id]);

  const getDetail = async () => {
    const data = await reviewExportPdf(+id);
    data && setDetailInfo(data);
  };
  const getSurroundData = async () => {
    const surroundData = await getReportDetail({
      relationId: +id,
      relationType: 4, // 接口说写死4-踩点类型
    });
    setSurroundData(surroundData);
  };

  return (
    <div className={styles.container}>
      {/* 封面页 */}
      <Cover name={reportName} />
      {/* 目录页 */}
      <PdfList name={reportName} />
      {/* 1客流概览 */}
      {detailInfo && <OverviewOfPassengerFlow detailInfo={detailInfo} name={reportName} />}
      {/* 2周边数据 */}
      {detailInfo && <PeripheralData detailInfo={detailInfo} name={reportName}/>}

      {/* 3周边分析 */}
      {showWhole && surroundData && <Overview detailInfo={surroundData} name={reportName} />}
      {/* 应该有一种类型报告只显示·城市市场评估·这时候不显示目录只显示城市市场评估的模块页 */}
      {showWhole && surroundData && <Catalog detailInfo={surroundData} name={reportName} pageIndex={2}/>}
      {surroundData && <City isComplete={showWhole} detailInfo={surroundData} name={reportName} />}
      {showWhole && surroundData && <Business detailInfo={surroundData} name={reportName} />}
      {showWhole && surroundData && <CrowdFlow detailInfo={surroundData} name={reportName} />}
      {showWhole && surroundData && <Traffic detailInfo={surroundData} name={reportName} />}
    </div>
  );
};

export default Insight;
