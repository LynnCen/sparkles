import { useMethods } from '@lhb/hook';
import { FC, useState } from 'react';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Operate from '@/common/components/Others/V2Operate';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import RejectModal from './RejectModal';
import { brandReviewPass } from '@/common/api/brand-center';
import { message, Typography } from 'antd';
import { deepCopy } from '@lhb/func';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

const { Text } = Typography;

const detailItemCommon = {
  className: styles.customItem,
  valueStyle: {
    fontSize: '14px',
    fontWeight: 'bold'
  }
};

const Top: FC<any> = ({
  reviewId,
  detail,
  brandInfo,
  onOK,
}) => {
  const [rejectVisible, setRejectVisible] = useState<boolean>(false);
  const getOperateList = () => {
    const operateList: any[] = [];
    detail && detail.permissions && detail.permissions.find(item => item.event === 'approveCenter:pass') && operateList.push({
      name: detail.permissions.filter(item => item.event === 'approveCenter:pass')[0].name || '通过.',
      event: 'pass',
      type: 'primary',
      func: 'handlePass',
    });
    detail && detail.permissions && detail.permissions.find(item => item.event === 'approveCenter:reject') && operateList.push({
      name: detail.permissions.filter(item => item.event === 'approveCenter:reject')[0].name || '拒绝.',
      event: 'reject',
      type: 'default',
      func: 'handleReject',
    });
    return operateList;
  };

  const methods = useMethods({
    handlePass() {
      V2Confirm({
        content: '确认审核通过？',
        onSure: (modal) => {
          const brandSaveRequest = this.prepareSubmitParams();
          brandReviewPass({
            reviewId,
            brandSaveRequest
          }).then(() => {
            message.success('审核通过');
            modal.destroy();
            onOK?.();
          });
        }
      });
    },
    handleReject() {
      setRejectVisible(true);
    },
    prepareSubmitParams() {
      const values = deepCopy(brandInfo);
      const industryIds:number[] = [];
      if (brandInfo.industryList?.length > 0) {
        brandInfo.industryList.forEach((item) => {
          if (item.threeIndustryId) {
            industryIds.push(item.threeIndustryId);
            return;
          }
          if (item.twoIndustryId) {
            industryIds.push(item.twoIndustryId);
            return;
          }
        });
      }
      const { name, type, brandEstablishTime, provinceId, provinceName, cityId, cityName, companyName, logo, icon, brandIntroduce, mdBrandPictureDtos, mdBrandAnnexDtos } = values;
      return {
        name, type, brandEstablishTime, industryIds, provinceId, provinceName, cityId, cityName, companyName, logo, icon, brandIntroduce, mdBrandPictureDtos, mdBrandAnnexDtos
      };
    }
  });
  return (
    <div className={styles.detailTop}>
      <V2Title text={detail?.reviewName} extra={
        <V2Operate operateList={getOperateList()} onClick={(btns: {func: string | number}) => methods[btns.func]()}/>
      }/>
      <div className={styles.topDesc}>
        <V2DetailGroup direction='vertical' moduleType='easy'>
          <V2DetailItem label='任务类型' value={detail?.reviewContent} {...detailItemCommon}/>
          <V2DetailItem label='提交时间' value={detail?.commitTime} {...detailItemCommon}/>
          <V2DetailItem label='审核人' value={detail?.reviewer} {...detailItemCommon}/>
          <V2DetailItem label='审核时间' value={detail?.reviewTime} {...detailItemCommon}/>
          <V2DetailItem label='任务状态' value={
            detail?.reviewStatusName ? <Text ellipsis={{ tooltip: detail.reason }} style={{ maxWidth: 270 }}>
              {detail.reviewStatusName + (detail.reason ? `(${detail.reason})` : '')}
            </Text> : ''
          } {...detailItemCommon}/>
        </V2DetailGroup>
      </div>
      <RejectModal
        reviewId={reviewId}
        visible={rejectVisible}
        setVisible={setRejectVisible}
        onOK={() => onOK()}
      />
    </div>
  );
};

export default Top;
