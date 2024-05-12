/**
 * @Description 基本信息
 */
import { FC } from 'react';
import styles from './index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
const BasicInfo:FC<any> = ({
  detail,
  aprDetail
}) => {

  const infos: any[] = [
    { label: '任务类型', value: detail?.taskTypeName, maxWidth: '106px' },
    { label: '开发经理', value: aprDetail?.manager || detail?.manager || detail?.developManager, maxWidth: '106px' },
    { label: '期望落位日期', value: detail?.expectDropInDate, maxWidth: '85px' },
    { label: '加盟商姓名', value: detail?.franchiseeDetail?.name, maxWidth: '96px' },
    { label: detail?.franchiseeDetail?.uniqueName || '加盟商唯一标识', value: detail?.franchiseeDetail?.uniqueId, maxWidth: '143px' },
  ];

  return <div className='pb-4'>
    <V2DetailGroup moduleType='easy' className={styles.basicInfo}>
      {
        infos.map((item, index) => <div
          style={{
            maxWidth: item?.maxWidth,
            width: item?.maxWidth,
          }}
          className={styles.card}
          key={index}>
          { item?.node || <V2DetailItem label={item?.label} value={item?.value} />}
        </div>
        )
      }
    </V2DetailGroup>

  </div>;
};
export default BasicInfo;
