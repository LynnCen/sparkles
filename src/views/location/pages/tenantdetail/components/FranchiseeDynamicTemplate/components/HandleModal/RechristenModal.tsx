/**
 * @Description 重命名弹窗
 */
import { FC, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { dynamicTemplateUpdateProperty } from '@/common/api/location';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';

const RechristenModal: FC<any> = ({
  templateId,
  modalData,
  close,
  loadData
}) => {
  const { open, data } = modalData;
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    if (!data) return;
    const { anotherName } = data || {};
    anotherName && form.setFieldsValue({ anotherName });
  }, [open, data]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      const params = {
        templateId,
        propertyConfigRequestList: [
          {
            ...data,
            ...values,
          },
        ],
      };
      dynamicTemplateUpdateProperty(params).then(() => {
        onCancel();
        loadData && loadData();
      });
    });
  };
  const onCancel = () => {
    form.resetFields();
    close && close();
  };

  return (
    <Modal
      title='重命名'
      open={open}
      onOk={onSubmit}
      width={400}
      onCancel={onCancel}
      getContainer={false}
      destroyOnClose
    >
      <V2Form form={form}>
        <V2FormInput
          label=''
          name='anotherName'
          placeholder='请输入字段名'
          maxLength={20}
          rules={[{ required: true, message: '请输入字段名' }]}
        />
      </V2Form>
    </Modal>
  );
};

export default RechristenModal;

