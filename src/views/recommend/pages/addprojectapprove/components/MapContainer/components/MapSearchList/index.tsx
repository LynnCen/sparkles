/**
 * @Description 分公司地图规划左侧搜索列表
 */

import { FC, useEffect } from 'react';
import MapDrawer from '@/common/components/business/MapDrawer';
import Wrapper from './components/Wrapper';

const MapSearchList: FC<any> = ({
  loading,
  setIsReset,
  data,
  appendData,
  setDetailData,
  detailData,
  pageRef,
  totalInfo,
  setRightDrawerVisible,
  rightDrawerVisible,
  approvalDetail,
  getApprovalDetails
}) => {

  // const firstRef = useRef<boolean>(true);// 是否第一次进入

  // 右侧边栏默认展示
  // useEffect(() => {
  //   // 当第一次请求接口拿到数据后消失
  //   if (firstRef.current && data?.length) {
  //     setRightDrawerVisible(false);
  //     firstRef.current = false;
  //   }
  // }, [data]);
  useEffect(() => {
    if (detailData.visible) {
      setRightDrawerVisible(true);
    }
  }, [detailData.id]);

  return (
    <>
      <MapDrawer
        placement='right'
        mapDrawerStyle={{
          width: '300px',
          top: '10px',
          right: '10px',
          bottom: '10px',
          transform: rightDrawerVisible ? 'translateX(0%)' : 'translateX(310px)'
        }}
        closeConStyle={{
          top: 42,
        }}
        visible={rightDrawerVisible}
        setVisible={setRightDrawerVisible}
      >
        <Wrapper
          pageRef={pageRef}
          data={data}
          detailData={detailData}
          loading={loading}
          setIsReset={setIsReset}
          setDetailData={setDetailData}
          appendData={appendData}
          totalInfo={totalInfo}
          approvalDetail={approvalDetail}
          getApprovalDetails={getApprovalDetails}
        />
      </MapDrawer>
    </>
  );
};

export default MapSearchList;
