/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑模板 */
import { FC, useEffect } from 'react';
import { Modal, Form } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import { post } from '@/common/request';
import FormTextArea from '@/common/components/Form/FormTextArea';
import { CircleTemplateModalProps } from './ts-config';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const CircleTemplateModal: FC<CircleTemplateModalProps> = ({
  operateCircleTemplate,
  setOperateCircleTemplate,
  onSearch,
}) => {
  const [form] = Form.useForm();

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 保存-https://yapi.lanhanba.com/project/289/interface/api/47718
      const url = '/tenant/templateInfo/save';
      const params = {
        ...values,
        ...(operateCircleTemplate.id && { id: operateCircleTemplate.id }),
        tenantId: operateCircleTemplate.tenantId
      };
      post(url, params, { proxyApi: '/blaster' }).then(() => {
        onCancel();
        onSearch();
      });
    });
  };

  const onCancel = () => {
    setOperateCircleTemplate({ visible: false });
  };

  useEffect(() => {
    if (operateCircleTemplate.id) {
      form.setFieldsValue(operateCircleTemplate);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [operateCircleTemplate]);

  return (
    <>
      <Modal
        title={!operateCircleTemplate.id ? '新建模版' : '编辑模版'}
        open={operateCircleTemplate.visible}
        onOk={onSubmit}
        width={600}
        onCancel={onCancel}
        getContainer={false}
      >
        <Form {...layout} form={form}>
          <FormInput
            label='模版编号'
            name='code'
            rules={[{ required: true, message: '请输入模版编号' }]}
            maxLength={20}
          />
          <FormInput
            label='模版名称'
            name='name'
            rules={[{ required: true, message: '请输入模版名称' }]}
            maxLength={10}
          />
          <FormTextArea
            label='说明'
            name='remark'
            placeholder='请输入说明'
            maxLength={50}
            rules={[{ required: true, message: '请输入说明' }]}
          />
        </Form>
      </Modal>
    </>
  );
};

export default CircleTemplateModal;
