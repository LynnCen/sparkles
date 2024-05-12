/*
  机会点详情顶部信息
*/
import { FC, useMemo } from 'react';
import styles from './index.module.less';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import TopItem from '@/common/components/business/StoreDetail/components/TopItem';
import TopApproval from '@/common/components/business/StoreDetail/components/TopApproval';
import StoreMap from '@/common/components/business/StoreDetail/components/StoreMap';
import Surround from '@/common/components/business/StoreDetail/components/Surround';
import cs from 'classnames';
import { isDef } from '@lhb/func';

const Basic: FC<any> = ({
  detail,
  isPoint, // 是否作为点位详情，true则detail代表点位评估详情，false则id代表机会点详情
}) => {
  const evaluationId = isPoint ? detail.id : detail.evaluationId;

  /**
   * @description 是否有周边查询入口
   */
  const hasSurroundPermission = useMemo(() => {
    return (
      detail &&
      Array.isArray(detail.permissions) &&
      !!detail.permissions.filter((item) => item.event === 'surroundReport:pcEntrance').length
    );
  }, [detail]);

  return Object.keys(detail).length ? (
    <div className={styles.basic}>
      {evaluationId &&
        (isDef(detail.pointApprovalStatus) ||
          isDef(detail.designAdvanceApprovalStatus) ||
          isDef(detail.contractApprovalStatus)) && (
        <TopApproval evaluationId={evaluationId} detail={detail} className='mt-16' />
      )}

      <div className={styles.topInfo}>
        <div className={styles.leftside}>
          <div className={styles.leftup}>
            <TitleTips name='点位数据' showTips={false} />
            <div className='fs-14'>
              <span className={styles.label23}>选址23不要：</span>
              {+detail.site23ForbidCount ? (
                <>
                  <span className='c-333 bold'>触发，</span>
                  <span className='c-f23 bold'>{` ${+detail.site23ForbidCount}项 `}</span>
                  <span className='c-333 bold'>不符合选址要求</span>
                </>
              ) : (
                <span className='c-333 bold'>未触发，符合选址要求</span>
              )}
            </div>

            <div className={cs(styles.baseInfo, 'mt-16')}>
              <TopItem title='预估日销售额' count={detail.checkBizEstimatedDailySales} unit='元' />
              <TopItem title='日外卖销售额' count={detail.checkBizDailyTakeawaySales} unit='元' />
              <TopItem title='日保本销售额' count={detail.checkBizDailyGuaranteedSalesRevenue} unit='元' />
              <TopItem title='投资回报周期' count={detail.finCalcInvstInvestmentReturnCycle} unit='个月' />
            </div>

            {hasSurroundPermission && <Surround detail={detail} className='mt-16' />}
          </div>
        </div>

        <div className={cs(styles.rightside, 'ml-24')}>
          <TitleTips name='周边200米门店地图' showTips={false} className={styles.mapTip} />
          <StoreMap detail={detail} />
        </div>
      </div>
    </div>
  ) : <></>;
};

export default Basic;
