/**
 * @LastEditors Please set LastEditors
 * @Date 2023-09-13 16:09
 * @LastEditTime 2023-11-21 10:11
 * @FilePath /console-pc/src/views/recommend/pages/networkplanapprove/components/BasicInfo.tsx
 * @Description
 */
import { FC, useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { Badge } from 'antd';
import { beautifyThePrice } from '@lhb/func';
import NodesDrawer from '@/common/components/business/ExpandStore/ApprovalNodes/components/NodesDrawer';
import IconFont from '@/common/components/IconFont';


const ApproveBasicInfo: FC<any> = ({
  detail,
  data,
  mainHeight
}) => {
  const [visible, setVisible] = useState<any>({
    open: false
  });
  return (
    <div className={styles.basicInfo} style={{
      height: mainHeight
    }}>
      <div className={styles.infoItem}>
        <div className={styles.label}>分公司名称</div>
        <div className={styles.value}>{data?.branchCompanyName || '-'}</div>
      </div>
      <div className={cs([styles.infoItem, 'mt-16'])}>
        <div className={styles.label}>发起时间</div>
        <div className={styles.value}>{detail?.createdAt}</div>
      </div>
      <div className={cs([styles.infoItem, 'mt-16'])}>
        <div className={styles.label}>审核状态
          <span
            className='c-006 pointer right'
            onClick={() => setVisible({ open: true })}>
            查看审批流程
            <IconFont iconHref='iconarrow-right' className={styles.scaleIcon}/>
          </span>
        </div>
        <div className={styles.value}><Badge className={styles.status} color={'#FE861D'} text={detail?.statusName} /></div>
      </div>
      <div className={cs([styles.planInfo, 'mt-16'])}>
        <div className={styles.planInfoItem}>
          <div className={styles.planLabel}>总部规划</div>
          <div className={styles.planValue}>
            <div className={styles.item}>
              <div className={styles.label}>{beautifyThePrice(data?.parentCompanyPlannedClusterNum, ',', 0)}</div>
              <div className={styles.value}>商圈数</div>
            </div>
            <div className={styles.item}>
              <div className={styles.label}>{beautifyThePrice(data?.parentCompanyPlannedStoreNum, ',', 0)}</div>
              <div className={styles.value}>开店数</div>
            </div>
          </div>
        </div>
        <div className={cs([styles.planInfoItem, 'mt-24'])}>
          <div className={styles.planLabel}>分公司规划</div>
          <div className={styles.planValue}>
            <div className={styles.item}>
              <div className={styles.label}>{beautifyThePrice(data?.childCompanyPlannedClusterNum, ',', 0)}</div>
              <div className={styles.value}>商圈数</div>
            </div>
            <div className={styles.item}>
              <div className={styles.label}>{beautifyThePrice(data?.childCompanyPlannedStoreNum, ',', 0)}</div>
              <div className={styles.value}>开店数</div>
            </div>
          </div>
        </div>
        <div className={cs([styles.planInfoItem, 'mt-24'])}>
          <div className={styles.planLabel}>规划原因</div>
          <div className={styles.reason}>
            {detail?.applyReason || '-'}
          </div>
        </div>
      </div>
      <NodesDrawer
        open={visible.open}
        setOpen={setVisible}
        detail={detail}
        nodes={detail?.nodes}
      />
    </div>
  );
};

export default ApproveBasicInfo;
