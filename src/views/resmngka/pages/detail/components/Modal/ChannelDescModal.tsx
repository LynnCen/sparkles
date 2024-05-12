import FormInput from '@/common/components/Form/FormInput';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormSelect from '@/common/components/Form/FormSelect';
import { useMethods } from '@lhb/hook';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';
import { ChannelDescModalProps } from '../../ts-config';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const typeOptions = [
  { label: '大门', value: '大门' },
  { label: '进出口通道', value: '进出口通道' },
  { label: '紧急逃生通道', value: '紧急逃生通道' },
];

const ChannelDescModal: React.FC<ChannelDescModalProps> = ({
  channelDescModalInfo,
  setChannelDescModalInfo,
  data = [],
  onChange,
}) => {
  const [form] = Form.useForm();

  const { parseTitle, onCancel } = useMethods({
    parseTitle() {
      return channelDescModalInfo.id ? '编辑通道' : '新增通道';
    },
    onCancel() {
      setChannelDescModalInfo({ visible: false });
      form.resetFields();
    },
  });
  // 确定
  const onSubmit = () => {
    form.validateFields().then((values) => {
      if (channelDescModalInfo.id) {
        const newData:any = [].concat(data);
        newData.forEach((element) => {
          if (element.id === channelDescModalInfo.id) {
            element.name = values.name;
            element.depth = values.depth;
            element.width = values.width;
            element.height = values.height;
          }
        });
        console.log(111, newData);
        onChange(newData);
        onCancel();
      } else {
        values.id = Math.random();
        data.push(values);
        onChange([].concat(data));
        onCancel();
      }
    });
  };

  useEffect(() => {
    if (channelDescModalInfo.id) {
      form.setFieldsValue(channelDescModalInfo);
    }
    // eslint-disable-next-line
  }, [channelDescModalInfo]);

  return (
    <Modal title={parseTitle()} open={channelDescModalInfo.visible} onOk={onSubmit} onCancel={onCancel}>
      <Form {...layout} form={form}>
        <FormInput
          label='通道名称'
          name='name'
          maxLength={32}
          rules={[{ required: true, message: '请输入通道名称' }]}
          placeholder='请输入通道名称'
        />

        <FormSelect label='通道类型' name='type' options={typeOptions} />
        <Form.Item label='通道尺寸'>
          <FormInputNumber
            placeholder='请输入进深'
            name='depth'
            min={0}
            max={9999}
            config={{
              addonAfter: 'm',
              precision: 0,
            }}
          />
          <FormInputNumber
            placeholder='请输入面宽'
            name='width'
            min={0}
            max={9999}
            config={{
              addonAfter: 'm',
              precision: 0,
            }}
          />
          <FormInputNumber
            placeholder='请输入层高'
            name='height'
            min={0}
            max={9999}
            config={{
              addonAfter: 'm',
              precision: 0,
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ChannelDescModal;
