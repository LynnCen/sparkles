import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { post } from '@/common/request';
import { message, Button } from 'antd';
import { FC } from 'react';

interface RejectButtonProps {
  id?: number;
  backUrl?:string
}

const RejectButton: FC<RejectButtonProps> = ({ id, backUrl }) => {
  const onClick = () => {
    const content = '是否确认审核拒绝?';
    ConfirmModal({ content, async onSure() {
      const result = await post('/examineOrder/reject', { id }, true);
      if (result) {
        message.success('拒绝成功');
        if (backUrl) {
          setTimeout(() => {
            dispatchNavigate(backUrl);
          }, 3000);
        } else {
          setTimeout(() => {
            dispatchNavigate('/resaudit');
          }, 1500);
        }
      }
    } });
  };
  return (
    <Button type='primary' onClick={onClick} danger>拒绝</Button>
  );
};

export default RejectButton;
