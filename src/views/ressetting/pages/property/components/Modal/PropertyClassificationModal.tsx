import React, { useEffect } from 'react';
import { Col, Form, message, Modal, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { PropertyClassificationModalProps } from '../../ts-config';
const PropertyClassificationModal: React.FC<PropertyClassificationModalProps> = ({
  onSearch,
  propertyClassificationModalInfo,
  setPropertyClassificationModalInfo,
}) => {
  const [form] = Form.useForm();

  const { onOk, onCancel, parseTitle } = useMethods({
    onCancel() {
      setPropertyClassificationModalInfo({ ...propertyClassificationModalInfo, visible: false });
      form.resetFields();
    },
    parseTitle() {
      return propertyClassificationModalInfo.id ? '编辑类目模板' : '新增属性分类';
    },
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          ...propertyClassificationModalInfo,
          ...values,
        };
        const url = propertyClassificationModalInfo.id
          ? '/propertyClassification/update'
          : '/propertyClassification/create';
        post(url, params, true).then(() => {
          message.success(`${propertyClassificationModalInfo.id ? '修改' : '新建'}属性分类成功`);
          onSearch();
          onCancel();
        });
      });
    },
  });
  useEffect(() => {
    if (propertyClassificationModalInfo.visible && propertyClassificationModalInfo.id) {
      form.setFieldsValue(propertyClassificationModalInfo);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [propertyClassificationModalInfo.visible]);

  return (
    <Modal
      title={parseTitle()}
      width={640}
      open={propertyClassificationModalInfo.visible}
      onOk={onOk}
      onCancel={onCancel}
      forceRender>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput label='分类名称' name='name' required/>
          </Col>
          <Col span={12}>
            <V2FormInput label='分类标识' name='identification' required/>
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};
export default PropertyClassificationModal;
