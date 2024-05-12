/**
 * @Description 提交审批弹窗
 */

import { FC, useRef } from 'react';
import { useMethods } from '@lhb/hook';
import { Form, Modal } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { post } from '@/common/request';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

interface ApprovalModalProps {
  modalData: { visible: boolean, id?: number | string };
  setModalData: Function;
  successCb?: Function;
}

const ApprovalModal: FC<ApprovalModalProps> = ({
  modalData,
  setModalData,
  successCb
}) => {
  const [form] = Form.useForm();
  const isLockRef = useRef<boolean>(false);
  const methods = useMethods({
    onOk() { // 新建版本
      form.validateFields().then((values: any) => {
        if (isLockRef.current) return;
        // https://yapi.lanhanba.com/project/532/interface/api/55649
        const params = {
          ...values,
          id: modalData.id,
          type: 8,
          typeValue: 15
        };
        isLockRef.current = true;
        post('/approval/create', params, { needCancel: false }).then(() => {
          successCb?.();
          this.onCancel();
          V2Message.success('提交审批成功');
        }).finally(() => {
          isLockRef.current = false;
        });
      });
    },
    onCancel() {
      form.resetFields();
      setModalData({
        ...modalData,
        visible: false,
      });
    }
  });


  return (
    <Modal
      title='提交审批'
      open={modalData.visible}
      onOk={methods.onOk}
      // 两列弹窗要求336px
      width={336}
      onCancel={methods.onCancel}
      forceRender
      okText='创建'
    >
      <V2Form form={form}>
        <V2FormTextArea
          label='规划原因'
          maxLength={500}
          name='reason'
          required
          config={{ showCount: true }} />
      </V2Form>
    </Modal>
  );
};

export default ApprovalModal;
