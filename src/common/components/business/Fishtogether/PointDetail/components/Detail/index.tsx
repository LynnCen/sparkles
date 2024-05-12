import { FC, forwardRef, useState, useImperativeHandle } from 'react';
import { Spin } from 'antd';
import Header from './Header';
import Basic from './Basic';
import { DynamicDetail } from '@/common/components/business/StoreDetail';
import { getYNChancepointDetail } from '@/common/api/fishtogether';
import { shopEvaluationDetail } from '@/common/api/approveworkbench';

/*
  机会点详情
*/
const Detail: FC<any> = forwardRef(({
  id,
  isPoint, // 是否点位，true则id代表点位评估id，false则id代表机会点id
  setImportInfo,
  setFormDrawerData,
  setAssociatedTaskModal,
  onSearch,
  // setImportChancePointId
}, ref) => {
  useImperativeHandle(ref, () => ({
    onload: () => {
      getDetail();
    },
  }));

  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any>({}); // 点位详情、或机会点详情

  const getDetail = async () => {
    setLoading(true);
    if (isPoint) {
      // 点位详情时，调用点位评估详情
      const evaluationDetail = await shopEvaluationDetail({ id }).finally(() => {
        setLoading(false);
      });
      evaluationDetail && setDetail(evaluationDetail);

      // const data = await getYNChancepointDetail({ id: evaluationDetail.chancePointId }).finally(() => {
      //   setLoading(false);
      // });
      // setDetail(data);
    } else { // 机会点详情，只需调用机会点详情
      const data = await getYNChancepointDetail({ id }).finally(() => {
        setLoading(false);
      });
      data && setDetail(data);
    }
  };

  return (
    <Spin spinning={loading}>
      <Header
        detail={detail}
        isPoint={isPoint}
        setImportInfo={setImportInfo}
        setFormDrawerData={setFormDrawerData}
        onSearch={onSearch}
        setAssociatedTaskModal={setAssociatedTaskModal}
        // setImportChancePointId={setImportChancePointId}
      />
      <Basic
        detail={detail}
        isPoint={isPoint}
      />
      {/* https://confluence.lanhanba.com/pages/viewpage.action?pageId=67530577 加了独占一行的逻辑 */}
      <DynamicDetail title='' data={detail} anchorCustomStyle={{ top: '530px' }} isTopSticky={false}/>
    </Spin>
  );
});

export default Detail;
