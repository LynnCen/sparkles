import React, { useEffect } from 'react';
import { Form, message, Modal } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { LabelModalProps } from '../../ts-config';

const LabelModal: React.FC<LabelModalProps> = ({ onSearch, labelModalInfo, setLabelModalInfo }) => {
  const [form] = Form.useForm();

  const { onOk, onCancel, parseTitle } = useMethods({
    onCancel() {
      setLabelModalInfo({ ...labelModalInfo, visible: false });
    },
    parseTitle() {
      return labelModalInfo.id ? '编辑标签' : '新增标签';
    },
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          ...labelModalInfo,
          ...values,
        };
        delete params.visible;
        const url = labelModalInfo.id ? '/label/update' : '/label/create';
        post(url, params, true).then(() => {
          message.success(`${labelModalInfo.id ? '编辑' : '新建'}标签成功`);
          onCancel();
          onSearch();
        });
      });
    },
  });

  useEffect(() => {
    if (labelModalInfo.visible && labelModalInfo.id) {
      form.setFieldsValue({ name: labelModalInfo.name });
      console.log(111, labelModalInfo);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [labelModalInfo.visible]);

  return (
    <Modal
      title={parseTitle()}
      width={336}
      open={labelModalInfo.visible}
      onOk={onOk}
      onCancel={onCancel}
      forceRender>
      <V2Form form={form}>
        <V2FormInput label='标签名称' name='name' required/>
      </V2Form>
    </Modal>
  );
};
export default LabelModal;
