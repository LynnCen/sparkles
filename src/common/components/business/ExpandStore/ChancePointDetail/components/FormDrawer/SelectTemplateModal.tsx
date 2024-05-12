/**
 * @Description 选择模版弹框
 */
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import FormSelect from '@/common/components/Form/FormSelect';
import { getTemplateLists } from '@/common/api/expandStore/chancepoint';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const SelectTemplateModal: React.FC<any> = ({ visible, setVisible, setFormDrawerData }) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<any>([]);

  const loadOptions = async () => {
    const result: any = await getTemplateLists();
    if (result && result.length) {
      setOptions(result.map((item) => ({ label: item.templateName, value: item.id })));
    }
  };

  useEffect(() => {
    if (visible) {
      loadOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const onCancel = () => {
    setVisible(false);
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
    <Modal title='选择机会点模板' open={visible} width={400} onOk={onSubmit} onCancel={onCancel}>
      <Form {...layout} form={form}>
        <FormSelect
          label='选择模板'
          name='templateId'
          rules={[{ required: true, message: '请选择模板' }]}
          options={options}
        />
      </Form>
    </Modal>
  );
};

export default SelectTemplateModal;
