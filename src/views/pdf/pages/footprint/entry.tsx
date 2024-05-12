import { FC, useEffect, useState } from 'react';
import { reviewExportPdf } from '@/common/api/pdf';
import { urlParams } from '@lhb/func';
import styles from './entry.module.less';
import Cover from '@/common/components/Pdf/Footprinting/FrontCover';
import Info from '@/common/components/Pdf/Footprinting/Info';
import PassengerFlowVideo from '@/common/components/Pdf/Footprinting/PassengerFlowVideo';
import TendencyChart from '@/common/components/Pdf/Footprinting/TendencyChart';
import BackCover from '@/common/components/Pdf/Footprinting/BackCover';
const Footprint: FC<any> = () => {
  const [data, setData] = useState<any>([]);
  const [tableList, setTableList] = useState<any>([]);
  const id: string | number = urlParams(location.search)?.id || '';
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

      {/* 尾页 */}
      <BackCover/>
    </div>
  );
};

export default Footprint;
