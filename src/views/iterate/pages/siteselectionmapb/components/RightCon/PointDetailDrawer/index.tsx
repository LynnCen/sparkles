/**
 * @Description
 */
import { getMallLocationDetail, getModelClusterPopulation } from '@/common/api/networkplan';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import { FC, useEffect, useState } from 'react';
import PassengerFlowPortrait from '../../../../siteselectionmap/components/AreaDetailDrawer/PassengerFlowPortrait';
import TopInfo from './TopInfo';
const PointDetailDrawer:FC<any> = ({
  pointDrawerData, // 点位详情抽屉
  setPointDrawerData, // 控制点位详情抽屉开关
  setDrawerData, // 控制商圈详情抽屉开关
  drawerData, // 商圈详情抽屉
}) => {
  const [data, setData] = useState<any>(null);
  const [ageDetail, setAgeDetail] = useState<any>(null);
  const onClose = () => {
    setPointDrawerData({
      open: false,
      businessId: null,
      pointId: null
    });
  };
  useEffect(() => {
    if (!pointDrawerData.open) return;
    Promise.all([
      // 这里传点位id
      getMallLocationDetail({ id: pointDrawerData.pointId }),
      // 这里传商圈id
      getModelClusterPopulation({ id: pointDrawerData.businessId })
    ])
      .then(([data, ageDetail]) => {

        setData(data);
        setAgeDetail(ageDetail);
      });
  }, [pointDrawerData.open]);
  return <V2Drawer
    bodyStyle={{
      padding: '32px 37px 24px 40px',
    }}
    open={pointDrawerData.open}
    destroyOnClose
    onClose={onClose}
    // 这个className需要唯一
    className='pointDetailDrawerOnly'
  >
    {/* 客流画像 */}
    {data ? <TopInfo
      data={data}
      pointDrawerData={pointDrawerData}
      // setPointDrawerData={setPointDrawerData}
      setDrawerData={setDrawerData}
      drawerData={drawerData}
    /> : <></>}
    {ageDetail ? <PassengerFlowPortrait ageDetail={ageDetail}/> : <></>}

  </V2Drawer>;
};
export default PointDetailDrawer;
