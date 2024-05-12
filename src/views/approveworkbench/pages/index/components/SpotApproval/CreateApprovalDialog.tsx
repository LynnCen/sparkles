/**
 * @Description 发起审批-意见输入弹框
 */
import { FC } from 'react';
import { Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';

interface CreateApprovalDialogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSubmit?: (values: any) => void; // 提交
}

const CreateApprovalDialog: FC<CreateApprovalDialogProps> = ({
  visible,
  setVisible,
  onSubmit,
}) => {

  const [form] = Form.useForm();

  const methods = useMethods({
    handleCancel() {
      setVisible(false);
      form.resetFields();
    },
    handleOk() {
      form.validateFields().then(async (values: any) => {
        setVisible(false);
        onSubmit && onSubmit(values);
      });
    }
  });

  return (
    <Modal
      title='提交审批'
      open={visible}
      destroyOnClose={true}
      width={648}
      onCancel={methods.handleCancel}
      onOk={methods.handleOk}>
      <V2Form form={form}>
        <V2FormTextArea
          label='请输入理由'
          name='reason'
          maxLength={500}
          placeholder='请输入理由，最多输入500字'
          rules={[{ required: true, message: '请输入理由' }]}
        />
      </V2Form>
    </Modal>
  );
};
export default CreateApprovalDialog;
