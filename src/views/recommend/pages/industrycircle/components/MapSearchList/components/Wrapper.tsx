/**
 * @Description 商圈列表内容
 */

import { FC, useEffect, useState } from 'react';
// import cs from 'classnames';
import styles from '../index.module.less';
import V2Container from '@/common/components/Data/V2Container';
import Top from './Top';
import List from './List';
import { industryCircleList } from '@/common/api/networkplan';
import { isArray } from '@lhb/func';
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
  amapIns,
  searchParams,
  setSearchParams, // 设置接口请求参数
  setDetailData, // 设置详情
  appendData,
  totalInfo, // 总商圈个数
}) => {
  const [searchKeywords, setSearchKeywords] = useState<string>(''); // 搜索关键词
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);// 列表勾选规划 id
  const [isFavourList, setIsFavourList] = useState<boolean>(false); // 当前是否收藏列表
  const [favourList, setFavourList] = useState<any[]>([]); // 收藏列表
  const [favourTotalInfo, setFavourTotalInfo] = useState<any>({ totalNum: 0 });// 收藏列表的数据总数
  const [favourLoading, setFavourLoading] = useState<boolean>(false); // 收藏列表

  /**
   * @description 刷新收藏列表
   *  tab切换到收藏列表；或者已经在tab收藏列表前提下，搜索关键词变化或从详情返回列表时
   */
  useEffect(() => {
    if (detailData?.visible) return; // 进详情不需要刷新收藏列表
    isFavourList && getFavourList();
  }, [isFavourList, searchKeywords, detailData?.visible]);

  const getFavourList = async () => {
    const params = {
      name: searchKeywords,
      ofCurrentUser: true,
      page: 1,
      size: 100,
    };
    setFavourLoading(true);
    const { objectList, totalNum } = await industryCircleList(params).finally(() => {
      setFavourLoading(false);
    });
    const targetList = isArray(objectList) ? objectList : [];
    setFavourList(targetList);
    setFavourTotalInfo({ totalNum });
  };

  return (
    <V2Container
      style={{
        height: 'calc(100vh - 48px - 32px - 10px - 10px)'
      }}
      extraContent={{
        top: <Top
          // isReset={isReset}
          totalInfo={isFavourList ? favourTotalInfo : totalInfo}
          // totalCount={totalNum}
          // openStoresCount={openStoresCount}
          detailData={detailData}
          searchKeywords={searchKeywords}
          searchParams={searchParams}
          setSearchKeywords={setSearchKeywords}
          setSearchParams={setSearchParams}
          setIsFavourList={setIsFavourList}
          setDetailData={setDetailData}
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
        loading={isFavourList ? favourLoading : loading}
        isFavourList={isFavourList}
        data={isFavourList ? favourList : data}
        keywords={searchKeywords}
        detailData={detailData}
        // setIsReset={setIsReset}
        amapIns={amapIns}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        setDetailData={setDetailData}
        appendData={appendData}
      />
    </V2Container>
  );
};

export default Wrapper;
