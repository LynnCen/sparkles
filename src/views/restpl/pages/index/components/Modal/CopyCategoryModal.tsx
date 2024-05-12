import React, { useEffect } from 'react';
import { Col, Form, message, Modal, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { CopyCategoryModalProps } from '../../ts-config';

const resTypeList = [
  { label: '场地', value: 0 },
  { label: '点位', value: 1 },
  { label: '供给', value: 2 },
];

const useTypeList = [
  { label: '资源中心', value: 0 },
  { label: 'PMS', value: 1 },
  { label: 'LOCATION', value: 2 },
  { label: '客流宝', value: 3 },
  { label: 'KA', value: 4 },
];

const CopyCategoryModal: React.FC<CopyCategoryModalProps> = ({ copyCategoryModalInfo, setCopyCategoryModalInfo, onSearch }) => {
  const [form] = Form.useForm();

  const { onOk, onCancel } = useMethods({
    onOk() {
      form.validateFields().then((values: any) => {
        const params = {
          id: copyCategoryModalInfo.categoryTemplateId,
          name: values.name,
          useType: values.useType,
          resourcesType: values.resourcesType
        };
        const url = '/categoryTemplate/copy';
        post(url, params, true).then(() => {
          message.success(`复制类目模板成功`);
          onCancel();
          onSearch();
        });
      });
    },
    onCancel() {
      setCopyCategoryModalInfo({ visible: false });
    },
  });

  useEffect(() => {
    if (copyCategoryModalInfo.visible) {
      form.setFieldsValue({
        name: copyCategoryModalInfo.name,
        resourcesType: copyCategoryModalInfo.resourceType,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copyCategoryModalInfo.visible]);

  return (
    <Modal
      title={'复制类目模板'}
      destroyOnClose
      open={copyCategoryModalInfo.visible}
      onCancel={onCancel}
      onOk={onOk}
      width={640}
    >
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput label='类目模板名称' name='name' required/>
            <V2FormSelect label='渠道' name='useType' options={useTypeList} required/>
          </Col>
          <Col span={12}>
            <V2FormSelect label='资源类型' name='resourcesType' disabled options={resTypeList} required/>
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};
export default CopyCategoryModal;
