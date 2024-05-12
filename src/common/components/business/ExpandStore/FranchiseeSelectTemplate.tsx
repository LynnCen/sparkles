/**
 * @Description 选择模版弹框
 */
import React from 'react';
import { Form, Modal } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const FranchiseeSelectTemplate: React.FC<any> = ({
  templateData,
  setTemplateData,
  setFormDrawerData
}) => {
  const [form] = Form.useForm();

  const onCancel = () => {
    setTemplateData({
      ...templateData,
      open: false,
    });
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      setFormDrawerData({
        ...values,
        open: true,
      });
      onCancel();
    });
  };

  return (
    <Modal
      title='选择加盟商模板'
      open={templateData.open}
      width={336}
      onOk={onSubmit}
      onCancel={onCancel}>
      <V2Form form={form}>
        <V2FormSelect
          label='选择模板'
          name='templateId'
          placeholder='请选择模板'
          rules={[{ required: true, message: '请选择模板' }]}
          options={templateData.options || []}
        />
      </V2Form>
    </Modal>
  );
};

export default FranchiseeSelectTemplate;
