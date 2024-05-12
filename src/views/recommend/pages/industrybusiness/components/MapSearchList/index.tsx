/**
 * @Description 分公司地图规划左侧搜索列表
 */

import { FC, useEffect, useRef, useState } from 'react';
import MapDrawer from '@/common/components/business/MapDrawer';
import Wrapper from './components/Wrapper';

const MapSearchList: FC<any> = ({
  // planId,
  // branchCompanyId,
  data,
  loading,
  // isReset,
  // setIsReset,
  appendData,
  searchParams,
  setSearchParams,
  setDetailData,
  detailData,
  // isBranch,
  pageRef,
  totalInfo
}) => {
  const [rightDrawerVisible, setRightDrawerVisible] = useState<boolean>(true);// 右侧列表及详情收缩按钮
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
          loading={loading}
          // isReset={isReset}
          // isBranch={isBranch}
          // planId={planId}
          // branchCompanyId={branchCompanyId}
          data={data}
          setDetailData={setDetailData}
          detailData={detailData}
          searchParams={searchParams}
          // setIsReset={setIsReset}
          setSearchParams={setSearchParams}
          appendData={appendData}
          totalInfo={totalInfo}
        />
      </MapDrawer>
    </>
  );
};

export default MapSearchList;
