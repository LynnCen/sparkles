/**
 * @Description 商圈列表内容
 */

import { FC, useState } from 'react';
// import cs from 'classnames';
import styles from '../index.module.less';
import V2Container from '@/common/components/Data/V2Container';
import Top from './Top';
import List from './List';
import Footer from './Footer';

const Wrapper: FC<any> = ({
  pageRef,
  data,
  isBranch, // 是否是分公司
  detailData, // 列表详情页相关（与地图联动）
  loading,
  setIsReset,
  planId, // 规划id
  searchParams,
  setSearchParams, // 设置接口请求参数
  setDetailData, // 设置详情
  appendData,
  totalInfo, // 总商圈个数和已开门店个数
  isActive, // 是否生效中的公司
  selectedBusinessDistrict, // 选中的商区围栏
  setSelectedBusinessDistrict, // 设置选中的商区围栏
  curClickTypeRef,
  curSelectRightList,
  onRefresh
}) => {
  const [searchKeywords, setSearchKeywords] = useState<string>(''); // 搜索关键词
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);// 列表勾选规划 id

  return (
    <V2Container
      style={{
        // height: 'calc(100vh - 48px - 32px - 16px - 5px)'
        // 20 距离顶部12+底部12
        height: 'calc(100vh - 24px)'
      }}
      extraContent={{
        top: <Top
          // isReset={isReset}
          totalInfo={totalInfo}
          detailData={detailData}
          setDetailData={setDetailData}
          searchParams={searchParams}
          setSearchKeywords={setSearchKeywords}
          setSearchParams={setSearchParams}
          selectedBusinessDistrict={selectedBusinessDistrict}
          setSelectedBusinessDistrict={setSelectedBusinessDistrict}
        />,
        bottom: <Footer
          isBranch={isBranch}
          detailData={detailData}
          planId={planId} // 规划id
          setIsReset={setIsReset}
          setSelectedRowKeys={setSelectedRowKeys}
          isActive={isActive}
          setDetailData={setDetailData}
          data={data}
          selectedRowKeys={selectedRowKeys}
          onRefresh={onRefresh}
        />
      }}
      className={styles.container}>
      <List
        pageRef={pageRef}
        loading={loading}
        data={data}
        isBranch={isBranch}
        keywords={searchKeywords}
        detailData={detailData}
        setIsReset={setIsReset}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        setDetailData={setDetailData}
        appendData={appendData}
        isActive={isActive}
        selectedBusinessDistrict={selectedBusinessDistrict}
        setSelectedBusinessDistrict={setSelectedBusinessDistrict}
        curClickTypeRef={curClickTypeRef}
        curSelectRightList={curSelectRightList}
      />
    </V2Container>
  );
};

export default Wrapper;
