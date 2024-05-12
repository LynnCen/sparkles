import React, { useEffect } from 'react';
import { Form, message, Modal } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { LabelClassificationModalProps } from '../../ts-config';
const LabelClassificationModal: React.FC<LabelClassificationModalProps> = ({
  onSearch,
  labelClassificationModalInfo,
  setLabelClassificationModalInfo,
}) => {
  const [form] = Form.useForm();

  const { onOk, onCancel, parseTitle } = useMethods({
    onCancel() {
      setLabelClassificationModalInfo({ ...labelClassificationModalInfo, visible: false });
    },
    parseTitle() {
      return labelClassificationModalInfo.id ? '编辑标签分类' : '新增标签分类';
    },
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          ...labelClassificationModalInfo,
          ...values,
        };
        delete params.visible;
        const url = labelClassificationModalInfo.id ? '/labelClassification/update' : '/labelClassification/create';
        post(url, params, true).then(() => {
          message.success(`${labelClassificationModalInfo.id ? '编辑' : '新建'}分组成功`);
          onCancel();
          onSearch();
        });
      });
    },
  });

  useEffect(() => {
    if (labelClassificationModalInfo.visible && labelClassificationModalInfo.id) {
      form.setFieldsValue(labelClassificationModalInfo);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [labelClassificationModalInfo.visible]);

  return (
    <Modal
      title={parseTitle()}
      width={336}
      open={labelClassificationModalInfo.visible}
      onOk={onOk}
      onCancel={onCancel}
      forceRender>
      <V2Form form={form}>
        <V2FormInput label='分类名称' name='name' required/>
      </V2Form>
    </Modal>
  );
};
export default LabelClassificationModal;
