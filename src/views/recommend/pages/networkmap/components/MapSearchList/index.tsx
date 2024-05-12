/**
 * @Description 分公司地图规划左侧搜索列表
 */

import { FC, useEffect, useRef } from 'react';
import MapDrawer from '@/common/components/business/MapDrawer';
import Wrapper from './components/Wrapper';

const MapSearchList: FC<any> = ({
  planId,
  branchCompanyId,
  loading,
  setIsReset,
  data,
  appendData,
  searchParams,
  setSearchParams,
  setDetailData,
  detailData,
  isBranch,
  pageRef,
  totalInfo,
  isActive, // 是否生效中的公司
  isShape, // 是否选中绘制商圈
  setRightDrawerVisible,
  rightDrawerVisible,
  selectedBusinessDistrict, // 选中的商区围栏
  setSelectedBusinessDistrict, // 设置选中的商区围栏
  curClickTypeRef,
  curSelectRightList
}) => {

  const firstRef = useRef<boolean>(true);// 是否第一次进入

  // 右侧边栏默认展示
  useEffect(() => {
    // 当第一次请求接口拿到数据后消失
    if (firstRef.current && data?.length) {
      setRightDrawerVisible(false);
      firstRef.current = false;
    }
  }, [data]);
  useEffect(() => {
    if (detailData.visible || selectedBusinessDistrict.visible) {
      setRightDrawerVisible(true);
    }
  }, [detailData.id, selectedBusinessDistrict?.id]);

  useEffect(() => {
    // 选中绘制商圈，收起右侧抽屉
    if (isShape)setRightDrawerVisible(false);
  }, [isShape]);

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
          loading={loading}
          isBranch={isBranch}
          planId={planId}
          branchCompanyId={branchCompanyId}
          data={data}
          setDetailData={setDetailData}
          detailData={detailData}
          searchParams={searchParams}
          setIsReset={setIsReset}
          setSearchParams={setSearchParams}
          appendData={appendData}
          totalInfo={totalInfo}
          isActive={isActive}
          selectedBusinessDistrict={selectedBusinessDistrict}
          setSelectedBusinessDistrict={setSelectedBusinessDistrict}
          curClickTypeRef={curClickTypeRef}
          curSelectRightList={curSelectRightList}
        />
      </MapDrawer>
    </>
  );
};

export default MapSearchList;
