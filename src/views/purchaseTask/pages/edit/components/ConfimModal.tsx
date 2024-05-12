import { FC } from 'react';
import { Modal, Button } from 'antd';
import { useMethods } from '@lhb/hook';

export interface RejectModalData {
  visible: boolean;
  formData: Object;
}

export interface ConfirmModalProps {
  data: RejectModalData,
  setData: Function;
  onPost: Function;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  data,
  setData,
  onPost,
}) => {
  const methods = useMethods({
    onCancel() {
      setData({ ...data, visible: false, });
    },
    onOk() {
      onPost && onPost(data.formData);
    },
    onLink() {
      window.open(`${process.env.LHB_ADMIN_URL}/#/contract/supplier/list`);
    }
  });

  return (
    <Modal
      title='提示'
      width='428px'
      open={data.visible}
      maskClosable={false}
      onCancel={methods.onCancel}
      onOk={methods.onOk}
      footer={[
        <Button key='link' type='primary' onClick={methods.onLink}>去创建</Button>,
        <Button key='submit' type='primary' onClick={methods.onOk}>暂不创建</Button>,
        <Button key='back' onClick={methods.onCancel}>取消</Button>,
      ]}>
        该采购任务未关联供应商合同，建议您去创建供应商合同。
    </Modal>
  );
};

export default ConfirmModal;
