/**
 * @Description 审批节点
 */

import { FC, useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import { ApprovalStatus } from '../ts-config';
// import { isArray } from '@lhb/func';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import NodesDrawer from './components/NodesDrawer';

const ApprovalNodes: FC<any> = ({
  detail
}) => {
  const [nodesDrawer, setNodesDrawer] = useState<any>({
    open: false,
  });

  const curNodeStatus = useMemo(() => {
    const { status, statusName } = detail || {};

    // if (nodeCode && isArray(nodes) && nodes.length) {
    //   const target = nodes.find((item: any) => item.nodeCode === nodeCode);
    //   if (target) {
    //     const { status: curStatus, statusName: curStatusName } = target;
    //     return {
    //       status: curStatus,
    //       statusName: curStatusName
    //     };
    //   }
    // }
    return {
      status,
      statusName
    };
  }, [detail]);

  const getStatusClass = (status: number) => {
    let className = '';
    switch (status) {
      case ApprovalStatus.Untreated:
        className = 'c-ff8';
        break;
      case ApprovalStatus.Passed:
        className = 'c-009';
        break;
      case ApprovalStatus.Denied:
        className = 'c-f23';
        break;
      case ApprovalStatus.Revoke:
        className = 'c-999';
        break;
      case ApprovalStatus.Reject:
        className = 'c-f23';
        break;
    }
    return className;
  };

  return (
    <>
      <Row
        align='middle'
        className={cs(styles.nodeCon, 'pointer')}
        onClick={() => setNodesDrawer((state) => ({ ...state, open: true }))}>
        <Col span={18}>
          <div className={cs(styles.flexStart, 'fn-14')}>
            <div>
              发起时间：{detail.createdAt}
            </div>
            <div className={styles.cutLIine}>|</div>
            <div className={getStatusClass(curNodeStatus.status)}>
              审批状态：{curNodeStatus.statusName}
            </div>
          </div>
        </Col>
        <Col span={6} className={'c-006 fn-12 rt'}>
          查看详细信息
          <IconFont iconHref='iconarrow-right' className={styles.scaleIcon}/>
        </Col>
      </Row>

      <NodesDrawer
        detail={detail}
        nodes={detail?.nodes || []}
        open={nodesDrawer.open}
        setOpen={setNodesDrawer}/>
    </>
  );
};

export default ApprovalNodes;
