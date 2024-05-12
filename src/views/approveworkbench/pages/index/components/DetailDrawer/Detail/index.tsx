/**
 * @Description 鱼你-审批详情
 */
import { FC } from 'react';
import { Spin } from 'antd';
import Header from './Header';
import Basic from './Basic';
import AdvanceDesignTab from './AdvanceDesignTab';
import ContractTab from './ContractTab';
import DynamicDetail, { AdditionalTabProps } from '@/common/components/business/StoreDetail/components/DynamicDetail';
import styles from '../index.module.less';

export interface DetailProps {
  loading?: boolean;
  aprDetail?: any;
  detail?: any;
  mainHeight: any,
}

const Detail: FC<any> = ({
  loading,
  aprDetail,
  detail,
  mainHeight,
}) => {

  /**
   * @description 附加tabs，有提前设计tab、合同tab
   */
  const additionTabs = () => {
    const { type, typeValue } = aprDetail;
    const tabs: AdditionalTabProps[] = [];
    if (type === 3 && typeValue === 9) {
      tabs.push({
        name: '提前设计',
        children: <AdvanceDesignTab designAdvanceId={detail.designAdvanceId}/>
      });
    }
    if (type === 3 && typeValue === 10) {
      tabs.push({
        name: '合同审批',
        children: <ContractTab contractId={detail.contractId}/>
      });
    }
    return tabs;
  };

  return (
    <div className={styles.mainCon}
      style={{
        height: `${mainHeight}px` || 'auto'
      }}>
      <Spin spinning={loading}>
        <Header aprDetail={aprDetail} detail={detail} />
        <Basic aprDetail={aprDetail} detail={detail} />
        {/* https://confluence.lanhanba.com/pages/viewpage.action?pageId=67530577 加了独占一行的逻辑 */}
        <DynamicDetail
          title=''
          data={detail}
          isApproval
          isTopSticky={false}
          additionTabs={additionTabs()}
          anchorCustomStyle={{ top: '520px' }}/>
      </Spin>
    </div>
  );
};

export default Detail;
