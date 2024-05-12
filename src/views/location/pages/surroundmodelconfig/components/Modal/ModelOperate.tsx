/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑模型 */
import { FC, useEffect } from 'react';
import { Modal, Form } from 'antd';
import { post } from '@/common/request';
import { ModelModalProps } from '../../ts-config';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import V2Form from '@/common/components/Form/V2Form';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const ModelOperate: FC<ModelModalProps> = ({ operateModel, setOperateModel, onSearch }) => {
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
      // 保存-https://yapi.lanhanba.com/project/462/interface/api/45275
      const url = '/surround/model/save';
      post(url, values, { proxyApi: '/blaster' }).then(() => {
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
        title={!operateModel.id ? '新建模型' : '编辑模型'}
        open={operateModel.visible}
        onOk={onSubmit}
        width={336}
        onCancel={onCancel}
        getContainer={false}
      >
        <V2Form {...layout} form={form}>
          <V2FormInput
            label='模型名称'
            name='name'
            config={{ style: { width: '288px' } }}
            rules={[{ required: true, message: '请输入模型名称' }]}
            maxLength={20}
          />
          <V2FormTextArea
            label='描述'
            name='description'
            config={{ style: { width: '288px' } }}
            placeholder='请输入描述'
            rules={[{ required: true, message: '请输入描述' }]}
            maxLength={50}/>
        </V2Form>
      </Modal>
    </>
  );
};

export default ModelOperate;
