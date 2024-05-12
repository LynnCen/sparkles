/**
 * @LastEditors Please set LastEditors
 * @Date 2023-09-17 00:09
 * @LastEditTime 2024-03-18 19:03
 * @FilePath /console-pc/src/views/recommend/pages/networkplanapprove/components/ApprovalModal.tsx
 * @Description
 */
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
  approvalAction: string; // 拒绝 reject/rebut
  onSubmit?: (reason: string) => void; // 提交
}

const ApprovalDialog: FC<ApprovalDialogProps> = ({
  visible,
  setVisible,
  approvalAction,
  onSubmit,
}) => {

  const name = approvalAction === 'rebut' ? '驳回' : '拒绝';
  const [form] = Form.useForm();

  const methods = useMethods({
    handleCancel() {
      form.resetFields();
      setVisible(false);
    },
    handleOk() {
      form.validateFields().then(async (values: any) => {
        setVisible(false);
        onSubmit && onSubmit(values.reason);
      });
    }
  });

  return (
    <Modal
      title={`审批${name}`}
      open={visible}
      destroyOnClose={true}
      width={428}
      onCancel={methods.handleCancel}
      onOk={methods.handleOk}>
      <V2Form form={form}>
        <V2FormTextArea
          label={`${name}原因`}
          name='reason'
          maxLength={200}
          placeholder={`请输入${name}原因，最多输入200字`}
          rules={[{ required: true, message: `请输入${name}原因` }]}
        />
      </V2Form>
    </Modal>
  );
};
export default ApprovalDialog;
