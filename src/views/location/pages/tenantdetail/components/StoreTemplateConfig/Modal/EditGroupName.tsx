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

const EditGroupName: FC<any> = ({ operateModel, setOperateModel, onSearch, templateId }) => {
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
      // 保存-https://yapi.lanhanba.com/project/289/interface/api/47340
      const url = '/dynamic/group/add';
      const params = {
        templateId,
        ...values,
        ...(operateModel.id && { id: operateModel.id })
      };
      post(url, params, { proxyApi: '/blaster' }).then(() => {
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
        title='模块名称'
        open={operateModel.visible}
        onOk={onSubmit}
        width={400}
        onCancel={onCancel}
        getContainer={false}
      >
        <Form {...layout} form={form}>
          <FormInput
            label=''
            name='name'
            rules={[{ required: true, message: '请输入模块名称' }]}
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

export default EditGroupName;
