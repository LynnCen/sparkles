/**
 * @Description 选择模版弹框
 */
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { getTemplateLists } from '@/common/api/expandStore/chancepoint';

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
    <Modal title='选择机会点模板' open={visible} width={336} onOk={onSubmit} onCancel={onCancel}>
      <V2Form form={form}>
        <V2FormSelect
          label='选择模板'
          name='templateId'
          placeholder='请选择模板'
          rules={[{ required: true, message: '请选择模板' }]}
          options={options}
        />
      </V2Form>
    </Modal>
  );
};

export default SelectTemplateModal;
