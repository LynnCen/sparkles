/**
 * @Description 商圈列表内容
 */

import { FC, useState } from 'react';
// import cs from 'classnames';
import styles from '../index.module.less';
import V2Container from '@/common/components/Data/V2Container';
import Top from './Top';
import List from './List';
// import Footer from './Footer';

const Wrapper: FC<any> = ({
  pageRef,
  data,
  // isBranch, // 是否是分公司
  // totalNum, // 总商圈个数
  // openStoresCount, // 已开门店个数
  detailData, // 列表详情页相关（与地图联动）
  loading,
  // isReset, // 是否重置入参
  // setIsReset,
  // planId, // 规划id
  // branchCompanyId, // 分公司id
  searchParams,
  setSearchParams, // 设置接口请求参数
  setDetailData, // 设置详情
  appendData,
  totalInfo// 总商圈个数
}) => {
  const [searchKeywords, setSearchKeywords] = useState<string>(''); // 搜索关键词
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);// 列表勾选规划 id

  return (
    <V2Container
      style={{
        height: 'calc(100vh - 48px - 32px - 16px - 5px)'
      }}
      extraContent={{
        top: <Top
          // isReset={isReset}
          totalInfo={totalInfo}
          // totalCount={totalNum}
          // openStoresCount={openStoresCount}
          detailData={detailData}
          setDetailData={setDetailData}
          searchParams={searchParams}
          setSearchKeywords={setSearchKeywords}
          setSearchParams={setSearchParams}
        />,
        // bottom: <Footer
        //   // isBranch={isBranch}
        //   detailData={detailData}
        //   // planId={planId} // 规划id
        //   // branchCompanyId={branchCompanyId} // 分公司id
        //   setIsReset={setIsReset}
        // />
      }}
      className={styles.container}>
      <List
        pageRef={pageRef}
        loading={loading}
        data={data}
        keywords={searchKeywords}
        detailData={detailData}
        // setIsReset={setIsReset}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        setDetailData={setDetailData}
        appendData={appendData}
      />
    </V2Container>
  );
};

export default Wrapper;
