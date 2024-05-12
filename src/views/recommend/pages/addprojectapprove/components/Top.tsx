/**
 * @Description 顶部信息
 */
import { FC, useState } from 'react';
import styles from '../entry.module.less';
import { Badge } from 'antd';
import NodesDrawer from '@/common/components/business/ExpandStore/ApprovalNodes/components/NodesDrawer';
import IconFont from '@/common/components/IconFont';
const Top:FC<any> = ({
  detail
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  return <>
    <div className={styles.topCon}>
      <span className={styles.label}>发起人</span>
      <span>{detail?.creator}</span>
      <span className={styles.label}>发起时间</span>
      <span>{detail?.createdAt}</span>
      <span className={styles.label}>审核状态</span>
      <Badge className={styles.status} color={'#FE861D'} text={detail?.statusName} />
      <span
        className='c-006 pointer right ml-10'
        onClick={() => setVisible(true)}>
            查看审批流程
        <IconFont iconHref='iconarrow-right' className={styles.scaleIcon}/>
      </span>
    </div>
    <NodesDrawer
      open={visible}
      setOpen={() => setVisible(false)}
      detail={detail}
      nodes={detail?.nodes}
    />
  </>;
};
export default Top;
