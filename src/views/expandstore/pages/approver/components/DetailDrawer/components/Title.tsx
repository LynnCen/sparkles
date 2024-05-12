/**
 * @Description 审批详情-顶部
 */
import { FC, useRef, useEffect } from 'react';
import styles from '../index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import ApprovalNodes from '@/common/components/business/ExpandStore/ApprovalNodes';

const Title: FC<any> = ({
  detail,
  hideNodes = false, // 隐藏审批条,集客点的审批跳不一样
  hintStr,
  titleHeightRef,
}) => {
  const selfRef: any = useRef();
  useEffect(() => {
    if (!Object.keys(detail)?.length) return;
    setTimeout(() => {
      titleHeightRef.current = selfRef.current?.getBoundingClientRect()?.height || 0;
    }, 0);
  }, [detail]);
  return Object.keys(detail).length > 0 ? (
    <div ref={selfRef} className={styles.detailTop}>
      {/* 点位名称以及操作按钮 */}
      <V2Title text={detail.name} />
      {
        hintStr ? <div className='c-f23'>
          { hintStr }
        </div> : <></>
      }

      {/* 审批状态条 */}
      {!hideNodes && <ApprovalNodes detail={detail} />}
    </div>
  ) : (
    <></>
  );
};

export default Title;
