import { insightDetail, reviewExportPdf } from '@/common/api/pdf';
import BackCover from '@/common/components/Pdf/Footprinting/BackCover';
import Cover from '@/common/components/Pdf/Footprinting/FrontCover';
import Info from '@/common/components/Pdf/Footprinting/Info';
import PassengerFlowVideo from '@/common/components/Pdf/Footprinting/PassengerFlowVideo';
import TendencyChart from '@/common/components/Pdf/Footprinting/TendencyChart';
import Business from '@/common/components/Pdf/Insight/Business';
import Catalog from '@/common/components/Pdf/Insight/Catalog';
import City from '@/common/components/Pdf/Insight/City';
import CrowdFlow from '@/common/components/Pdf/Insight/CrowdFlow';
import Overview from '@/common/components/Pdf/Insight/Overview';
import Traffic from '@/common/components/Pdf/Insight/Traffic';
import { urlParams } from '@lhb/func';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './entry.module.less';
const Integration: FC<any> = () => {
  const [data, setData] = useState<any>([]);
  const [tableList, setTableList] = useState<any>([]);
  // const id: string | number = urlParams(location.search)?.id || '';
  const id: number | string = urlParams(location.search)?.id || '';
  const businessReportId: number | string = urlParams(location.search)?.businessReportId || '';
  const [detailInfo, setDetailInfo] = useState<any>({});
  // 是否显示目录
  const showWhole = useMemo(() => (detailInfo?.report?.process === 4), [detailInfo]);
  const reportName = useMemo(() => (`${detailInfo?.report?.name || ''}评估报告`), [detailInfo]);

  useEffect(() => {
    +id && getDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDetail = async () => {
    const data = await insightDetail(businessReportId as number);
    data && setDetailInfo(data);
  };
  useEffect(() => {
    (async () => {
      const result = await reviewExportPdf(+id);
      setData(result);
      const listData: Array<any> = [];
      // 将tableDatas数据分组以达到分页效果
      result.tableDatas?.map((item, index) => {
        const indexVal = Math.floor(index / 10);
        listData[indexVal] === undefined ? listData[indexVal] = [item] : listData[indexVal].push(item);
      });
      setTableList(listData);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div className={styles.container}>

      {/* 封面 */}
      <Cover name={data?.pdfTitle}/>

      {/* 踩点信息/场地信息/店铺信息 */}
      <Info data={data}/>

      {/* 客流视频 */}
      {tableList.length ? tableList?.map((item, index:number) => (
        <PassengerFlowVideo
          tableChartTitle={data?.tableChartTitle}
          tableDatas={item}
          key={index}
          indexVal={index}
        />
      )) : null}

      {/* 趋势图 */}
      {data?.lineDatas?.length ? <TendencyChart
        lineChartTitle={data?.lineChartTitle}
        lineDatas={data?.lineDatas}/> : null}



      {showWhole && <Catalog detailInfo={detailInfo} name={reportName} isIntegration={true}/>}
      {showWhole && <Overview detailInfo={detailInfo} name={reportName} isIntegration={true}/>}
      <City isComplete={showWhole} detailInfo={detailInfo} name={reportName} isIntegration={true}/>
      {showWhole && <Business detailInfo={detailInfo} name={reportName} isIntegration={true}/>}
      {showWhole && <CrowdFlow detailInfo={detailInfo} name={reportName} isIntegration={true}/>}
      {showWhole && <Traffic detailInfo={detailInfo} name={reportName} isIntegration={true}/>}
      {/* 尾页 */}
      <BackCover/>
    </div>);
};

export default Integration;
