/* 选择数据范围弹框 */
import React from 'react';
import { Form, Modal, message } from 'antd';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import copy from 'copy-to-clipboard';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const SelectDataRangeModal: React.FC<any> = ({ visible, setVisible, id, ind }) => {
  const [form] = Form.useForm();
  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      const url = `${process.env.STORE_ASSISTANT_URL}/shoprecommend/detail?id=${id}&index=${ind}&type=${values.range}&isShare=1`;
      copy(url);
      message.success('该链接已复制到剪切板上！');
      onCancel();
    });
  };

  return (
    <Modal title='选择数据范围' open={visible} width={500} onOk={onSubmit} onCancel={onCancel}>
      <Form {...layout} form={form}>
        <V2FormRadio
          name='range'
          label='数据范围'
          options={[
            { label: '评分详情+周边信息', value: '1' },
            { label: '仅周边信息', value: '2' },
          ]}
          required
        />
      </Form>
    </Modal>
  );
};

export default SelectDataRangeModal;
