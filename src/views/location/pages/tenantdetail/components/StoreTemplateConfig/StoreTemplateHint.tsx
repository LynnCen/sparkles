/**
 * @Description 页面提示语配置
 */
import { FC, useEffect } from 'react';
import { Modal, Form } from 'antd';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { post } from '@/common/request';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const StoreTemplateHint: FC<any> = ({
  templateHint,
  setTemplateHint,
  onSearch,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (templateHint.visible) {
      if (templateHint.id) {
        form.setFieldsValue({ hint: templateHint.hint });
      } else {
        form.resetFields();
      }
    }
  }, [templateHint.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 模版更新页面提示语-https://yapi.lanhanba.com/project/289/interface/api/62089
      const url = '/dynamic/template/info/update/hint';
      const params = {
        templateId: templateHint.id,
        hint: values.hint
      };
      post(url, params, { proxyApi: '/blaster', needHint: true }).then(() => {
        V2Message.success('编辑配置成功');
        onCancel();
        onSearch();
      });
    });
  };

  const onCancel = () => {
    setTemplateHint({ ...templateHint, visible: false });
  };

  return (
    <>
      <Modal
        title='页面提示语配置'
        open={templateHint.visible}
        onOk={onSubmit}
        width={480}
        onCancel={onCancel}
        getContainer={false}
        destroyOnClose
      >
        <Form {...layout} form={form}>
          <V2FormInput
            label='页面提示语'
            name='hint'
            rules={[{ required: true, message: '请输入页面提示语' }]}
            maxLength={30}
            allowClear
          />
        </Form>
      </Modal>
    </>
  );
};

export default StoreTemplateHint;
