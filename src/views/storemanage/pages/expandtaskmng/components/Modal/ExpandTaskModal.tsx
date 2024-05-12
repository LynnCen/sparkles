/* 新增拓店任务弹框 */
import React from 'react';
import { Col, Form, Modal, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { MOBILE_REG } from '@lhb/regexp';

const ExpandTaskModal: React.FC<any> = ({ visible, setVisible }) => {
  const [form] = Form.useForm();

  const onCancel = () => {
    setVisible(false);
  };

  const onSubmit = () => {
    form.validateFields().then(() => {
      setVisible(false);
    });
  };

  return (
    <Modal title='创建拓店任务' open={visible} width={640} onOk={onSubmit} onCancel={onCancel} destroyOnClose>
      <V2Form form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <V2FormInput
              label='加盟商姓名'
              name='demo1'
              rules={[{ required: true, message: '请输入员工姓名' }]}
              maxLength={15}
            />
            <V2FormProvinceList
              label='意向城市'
              name='cityId'
              type={2}
              required
            />
            <V2FormSelect
              label='选址费缴纳情况'
              name='demo5'
              options={[
                { label: '是', value: '是' },
                { label: '否', value: '否' },
              ]}
              required
            />
          </Col>
          <Col span={12}>
            <V2FormInput
              label='联系方式'
              name='demo2'
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: MOBILE_REG, message: '手机号格式错误' },
              ]}
            />
            <V2FormInputNumber
              label='投资预算'
              min={0}
              max={9999999999}
              precision={1}
              name='demo4'
              config={{ addonAfter: '万元' }}
              required
            />
            <V2FormInput
              label='客户背景'
              name='demo6'
              required
              maxLength={50}
            />
          </Col>
        </Row>
      </V2Form>
    </Modal>
  );
};

export default ExpandTaskModal;
