/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑模型 */
import { FC, useEffect } from 'react';
import { Modal, Form } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import { post } from '@/common/request';

const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const EditFieldName: FC<any> = ({ operateModel, setOperateModel, onSearch, templateId }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (operateModel.visible) {
      if (operateModel.id) {
        form.setFieldsValue({ ...operateModel });
      } else {
        form.resetFields();
      }
    }
  }, [operateModel.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 保存-https://yapi.lanhanba.com/project/289/interface/api/47361
      const url = '/dynamic/property/update';
      const params = {
        templateId,
        propertyConfigRequestList: [
          {
            ...values,
            ...operateModel,
            anotherName: values.anotherName,
          },
        ],
      };
      post(url, params, { proxyApi: '/blaster', needHint: true }).then(() => {
        onCancel();
        onSearch();
      });
    });
  };

  const onCancel = () => {
    setOperateModel({ visible: false });
  };

  return (
    <>
      <Modal
        title='重命名'
        open={operateModel.visible}
        onOk={onSubmit}
        width={400}
        onCancel={onCancel}
        getContainer={false}
        destroyOnClose
      >
        <Form {...layout} form={form}>
          <FormInput
            label=''
            name='anotherName'
            rules={[{ required: true, message: '请输入字段名' }]}
            maxLength={20}
            allowClear
            config={{
              ref: (input) => {
                if (input != null) {
                  input.focus({
                    cursor: 'end',
                  });
                }
              },
            }}
          />
        </Form>
      </Modal>
    </>
  );
};

export default EditFieldName;
