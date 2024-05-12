/**
 * @Description 商圈列表底部，问过产品，这里只会有拒绝和通过，但实际可配四个按钮（需产品自己把控）
 */
import { FC, useState } from 'react';
import { useMethods } from '@lhb/hook';
import V2Operate from '@/common/components/Others/V2Operate';
import { denyApproval, passApproval } from '@/common/api/expandStore/approveworkbench';
import { Modal, message } from 'antd';
import ApprovalModal from './ApprovalModal';
import { refactorPermissions } from '@lhb/func';
import styles from '../index.module.less';
const Footer: FC<any> = ({
  approvalDetail,
  getApprovalDetails
}) => {
  // 问过产品，这里只会有拒绝和通过
  const permission = approvalDetail?.permissions.map((item) => {
    item.type = item.event === 'reject' ? 'default' : 'primary';
    return item;
  });

  const [visible, setVisible] = useState<boolean>(false);

  const methods = useMethods({
    handleReject() {
      setVisible(true);
    },
    handleApprove() {
      Modal.confirm({
        title: `审核通过`,
        content: `确定审核通过？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            id: +approvalDetail?.id,
            nodeCode: approvalDetail?.nodeCode
          };
          passApproval(params).then(() => {
            message.success('操作成功');
            getApprovalDetails();
          });
        },
      });
    },

  });

  const rejectHandle = (reason) => {
    const params = {
      id: +approvalDetail?.id,
      reason,
      nodeCode: approvalDetail?.nodeCode
    };
    denyApproval(params).then(() => {
      message.success('操作成功');
      getApprovalDetails();
    });
  };
  return (
    <>
      <div className={styles.footerCon}>
        <V2Operate
          operateList={refactorPermissions(permission)}
          onClick={(btn: any) => methods[btn.func]()}
        />
      </div>
      <ApprovalModal
        visible={visible}
        setVisible={setVisible}
        name='拒绝'
        onSubmit={rejectHandle}
      />
    </>
  );
};

export default Footer;
