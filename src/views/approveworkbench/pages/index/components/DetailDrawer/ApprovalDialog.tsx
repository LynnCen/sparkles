/**
 * @Description 执行审批-意见输入弹框
 */
import { FC } from 'react';
import { Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';

interface ApprovalDialogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  event: string; // pass/deny/reject
  onSubmit?: (event: string, reason: string) => void; // 提交
}

const ApprovalDialog: FC<ApprovalDialogProps> = ({
  visible,
  setVisible,
  event,
  onSubmit,
}) => {

  const [form] = Form.useForm();

  const methods = useMethods({
    handleCancel() {
      form.resetFields();
      setVisible(false);
    },
    handleOk() {
      form.validateFields().then(async (values: any) => {
        setVisible(false);
        onSubmit && onSubmit(event, values.reason);
      });
    }
  });

  return (
    <Modal
      title='审批意见'
      open={visible}
      destroyOnClose={true}
      width={648}
      onCancel={methods.handleCancel}
      onOk={methods.handleOk}>
      <V2Form form={form}>
        <V2FormTextArea
          label='输入审批意见'
          name='reason'
          maxLength={500}
          placeholder='请输入意见，最多输入500字'
          rules={[{ required: true, message: '请输入意见' }]}
          config={{
            showCount: true,
            autoSize: { minRows: 8 }
          }}
        />
      </V2Form>
    </Modal>
  );
};
export default ApprovalDialog;
