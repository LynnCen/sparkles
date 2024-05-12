/**
 * @Description 加盟商详细信息Drawer
 */
import { FC, useEffect, useState } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import Empty from '@/common/components/Empty';
import { DynamicDetail } from '@/common/components/business/StoreDetail';
import styles from '../entry.module.less';
import { franchiseeDetail } from '@/common/api/fishtogether';
import { deepCopy, isNotEmptyAny } from '@lhb/func';

const MoreDetail: FC<any> = ({
  open,
  setOpen,
  franchiseeName,
  franchiseeId,
}) => {
  const [detail, setDetail] = useState<any>({});

  const loadDetail = async () => {
    const { propertyGroupVOList }: any = await franchiseeDetail({ id: franchiseeId });
    propertyGroupVOList && setDetail({
      templateDetailResponse: {
        propertyGroupVOList: deepCopy(propertyGroupVOList)
      }
    });
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (franchiseeId && open) {
      loadDetail();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchiseeId, open]);

  return (
    // 0511 因为更换点位匹配情况和沟通记录顺序，没有必要用容器组件了
    <V2Drawer open={open} onClose={onClose} destroyOnClose>
      <>
        <V2Title>
          <div className={styles.top}>
            <span className={styles.topText}>{franchiseeName}的加盟申请详细信息</span>
          </div>
        </V2Title>
        {isNotEmptyAny(detail) ? <DynamicDetail
          title=''
          ignoreAttach={true}
          notUseTemplate={true}
          data={detail}
          anchorCustomStyle={{ top: '130px' }} />
          : <Empty/>}
      </>
    </V2Drawer>
  );
};
export default MoreDetail;
