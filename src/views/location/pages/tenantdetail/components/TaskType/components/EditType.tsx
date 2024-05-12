/**
 * @Description 新增/编辑拓店任务类型弹框
 */
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { taskTypeSave, taskTypeUpdate } from '@/common/api/location';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const EditTask: React.FC<any> = ({
  visible,
  setVisible,
  tenantId,
  record = {},
  onRefresh,
}) => {
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      form.setFieldValue('typeName', record.typeName || '');
    } else {
      form.resetFields();
    }
  }, [visible]);

  const onCancel = () => {
    setVisible(false);
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      if (isLock) return;
      setIsLock(true);

      const { id } = record;
      const params: any = {
        tenantId,
        typeName: values.typeName
      };
      id && (params.id = id);

      const api = id ? taskTypeUpdate : taskTypeSave;
      api(params).then(() => {
        V2Message.success('提交成功');
        setVisible(false);
        onRefresh && onRefresh();
      }).finally(() => {
        setIsLock(false);
      });
    });
  };

  return (
    <Modal title={record.id ? `编辑拓店任务类型` : `新增拓店任务类型`} open={visible} width={400} onOk={onSubmit} onCancel={onCancel}>
      <Form {...layout} form={form}>
        <V2FormInput
          label='类型名称'
          name='typeName'
          maxLength={15}
          required/>
      </Form>
    </Modal>
  );
};

export default EditTask;
