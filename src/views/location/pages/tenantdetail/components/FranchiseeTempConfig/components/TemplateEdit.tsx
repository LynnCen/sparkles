/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑模板 */
import { FC, useEffect, useState } from 'react';
import { Modal, Form } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { TemplateEditProps } from '../ts-config';
import { createFranchiseeTemplate, updateFranchiseeTemplate } from '@/common/api/location';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};

const TemplateEdit: FC<TemplateEditProps> = ({
  operateStoreTemplate,
  setOperateStoreTemplate,
  onSearch,
  tenantId,
}) => {
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);

  useEffect(() => {
    if (operateStoreTemplate.visible) {
      if (operateStoreTemplate.id) {
        form.setFieldsValue({
          templateName: operateStoreTemplate.templateName
        });
      } else {
        form.resetFields();
      }
    }
  }, [operateStoreTemplate.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      if (isLock) return;
      setIsLock(true);

      const { id } = operateStoreTemplate;
      const api = id ? updateFranchiseeTemplate : createFranchiseeTemplate;
      const params = {
        tenantId,
        ...values,
        ...(id && { id }),
      };
      api(params).then(() => {
        onCancel();
        onSearch();
      }).finally(() => {
        setIsLock(false);
      });
    });
  };

  const onCancel = () => {
    setOperateStoreTemplate({ visible: false });
  };

  return (
    <>
      <Modal
        title={!operateStoreTemplate.id ? '新建模板' : '编辑模板'}
        open={operateStoreTemplate.visible}
        onOk={onSubmit}
        width={400}
        confirmLoading={isLock}
        onCancel={onCancel}
        getContainer={false}
      >
        <V2Form {...layout} form={form} layout='horizontal'>
          <V2FormInput
            label='模版名'
            name='templateName'
            rules={[{ required: true, message: '请输入模板名' }]}
            maxLength={15}
            required
          />
        </V2Form>
      </Modal>
    </>
  );
};

export default TemplateEdit;
