/**
 * @Description 商圈列表内容
 */

import { FC } from 'react';
import styles from '../index.module.less';
import V2Container from '@/common/components/Data/V2Container';
import Top from './Top';
import List from './List';
import Footer from './Footer';

const Wrapper: FC<any> = ({
  pageRef,
  data,
  detailData, // 列表详情页相关（与地图联动）
  loading,
  setIsReset,
  setDetailData, // 设置详情
  appendData,
  totalInfo, // 总商圈个数和已开门店个数
  approvalDetail,
  getApprovalDetails
}) => {

  return (
    <V2Container
      style={{
        height: 'calc(100vh - 48px - 32px - 16px - 5px)'
      }}
      extraContent={{
        top: <Top
          detailData={detailData}
          approvalDetail={approvalDetail}
          totalInfo={totalInfo}
        />,
        bottom: <Footer
          approvalDetail={approvalDetail}
          getApprovalDetails={getApprovalDetails}
        />
      }}
      className={styles.container}>
      <List
        pageRef={pageRef}
        loading={loading}
        data={data}
        detailData={detailData}
        setIsReset={setIsReset}
        setDetailData={setDetailData}
        appendData={appendData}
      />
    </V2Container>
  );
};

export default Wrapper;
