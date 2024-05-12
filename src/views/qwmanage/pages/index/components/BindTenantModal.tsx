/**
 * @Description 企微对接绑定对应租户
 */
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import FormTenant from '@/common/components/FormBusiness/FormTenant';
import { post } from '@/common/request';
import { Col, Modal, Row, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';

const BindTenantModal = ({ visible, setVisible, onRefresh, data }) => {

  /* status */
  const [form] = useForm();
  const [defaultTenant, setDefaultTenant] = useState<any>({});

  useEffect(() => {
    if (visible && data) {
      form.setFieldsValue({ ...data });
      if (data.tenantId) {
        setDefaultTenant({
          ...defaultTenant,
          id: data.tenantId,
          name: data.tenantName
        });
      }
    }
  }, [visible, data]);

  /* methods */
  const onOk = () => {
    form.validateFields().then((values) => {
      // https:// yapi.lanhanba.com/project/378/interface/api/58092
      post('/tp/tenant/bind', { ...values }, {
        needHint: true,
        proxyApi: '/mirage'
      }).then(() => {
        message.success('租户绑定成功');
        setVisible(false);
        onRefresh();
      });
    });
  };
  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title='绑定租户'
      open={visible}
      onOk={onOk}
      // 单列弹窗要求336px
      width={640}
      onCancel={onCancel}
      forceRender
    >
      <V2Form form={form} initialValues={{ tenantId: defaultTenant }}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput
              label='企业名称'
              name='corpName'
              disabled
            />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='企业ID'
              name='corpId'
              disabled
            />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='应用ID'
              name='agentId'
              disabled
            />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='通讯录secret'
              name='addressSecret'
              config={{ allowClear: true, showCount: true }}
            />
          </Col>
          <Col span={12}>
            <FormTenant
              label='选择租户'
              name='tenantId'
              allowClear={true}
              placeholder='请搜索并选择租户'
              enableNotFoundNode={false}
              config={{
                getPopupContainer: (node) => node.parentNode,
              }}
              rules={[{ required: true, message: '请选择租户' }]}
            />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default BindTenantModal;
