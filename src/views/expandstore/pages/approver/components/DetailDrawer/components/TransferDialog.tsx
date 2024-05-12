/**
 * @Description 转交弹窗
 */
import { FC } from 'react';
import { Form, Modal } from 'antd';
import { useMethods } from '@lhb/hook';
import V2Form from '@/common/components/Form/V2Form';
import FormEmployees from '@/common/components/FormBusiness/FormEmployees';
interface TransferDialogDialogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSubmit?: (reason: any) => void; // 提交
}

const TransferDialog: FC<TransferDialogDialogProps> = ({
  visible,
  setVisible,
  // event,
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
        onSubmit && onSubmit({
          approver: values?.approver,
        });
        form.resetFields();
      });
    }
  });

  return (
    <Modal
      title='转交'
      open={visible}
      destroyOnClose={true}
      width={648}
      onCancel={methods.handleCancel}
      onOk={methods.handleOk}>
      <V2Form form={form}>

        <FormEmployees
          form={form}
          allowClear={true}
          placeholder='请输入员工姓名/手机号关键词搜索'
          formItemConfig={{ required: true }}
          rules={[{ required: true, message: '转交审批人不能为空' }]}
          name='approver'
          label='转交审批人'
        />
      </V2Form>
    </Modal>
  );
};
export default TransferDialog;
