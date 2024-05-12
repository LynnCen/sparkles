import React, { useEffect } from 'react';
import { Col, Form, Modal, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { TemplateInfo, TemplateModalProps } from '../../ts-config';

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

const TemplateModal: React.FC<TemplateModalProps> = ({
  templateModalInfo, setTemplateModalInfo, onSearch
}) => {
  const [form] = Form.useForm();

  const { onSubmit, onCancel } = useMethods({
    onCancel() {
      setTemplateModalInfo({ visible: false });
    },
    onSubmit() {
      form
        .validateFields()
        .then((values: TemplateInfo) => {
          // 修改-http://yapi.lanhanba.com/project/289/interface/api/33078
          // 创建-http://yapi.lanhanba.com/project/289/interface/api/33077
          const url = templateModalInfo.id ? '/categoryTemplate/update' : '/categoryTemplate/create';
          const params = {
            ...values,
            ...(templateModalInfo.id && { id: templateModalInfo.id }),
          };
          post(url, params, true).then(() => {
            onCancel();
            onSearch();
          });
        })
        .catch((errorInfo: any) => {
          console.log('errorInfo', errorInfo);
        });
    }
  });

  useEffect(() => {
    if (templateModalInfo.visible && templateModalInfo.id) {
      form.setFieldsValue(templateModalInfo);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [templateModalInfo.visible]);

  return (
    <Modal title={templateModalInfo.id ? '编辑类目模板' : '新增类目模板'}
      forceRender
      width={640}
      destroyOnClose
      open={templateModalInfo.visible}
      onCancel={onCancel}
      onOk={onSubmit}>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput label='类目模板名称' name='name' required/>
            <V2FormSelect label='渠道' name='useType' options={useTypeList} required/>
          </Col>
          <Col span={12}>
            <V2FormSelect label='资源类型' name='resourcesType' options={resTypeList} required/>
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};
export default TemplateModal;
