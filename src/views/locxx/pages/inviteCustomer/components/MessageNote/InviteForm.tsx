/**
 * @Description 邀请客户表单
 */
import V2Form from '@/common/components/Form/V2Form';
import styles from '../index.module.less';
import { useForm } from 'antd/es/form/Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { Button, Col, Row, message } from 'antd';
import { useMethods } from '@lhb/hook';
import { MOBILE_REG } from '@lhb/regexp';
import { useState } from 'react';
import { RedoOutlined } from '@ant-design/icons';
import { postLocxxMsgSend } from '@/common/api/locxx';

const InviteForm = ({ onRefresh }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const methods = useMethods({
    sendInvite() {
      form.validateFields().then((values) => {
        setLoading(true);
        postLocxxMsgSend({
          ...values,
          inviteType: 1,
        }).then(() => {
          message.success('已发送短信邀请');
          onRefresh?.();
        }).finally(() => setLoading(false));
      });
    }
  });

  return (
    <div className={styles.inviteForm}>
      <V2Form form={form}>
        <Row gutter={24}>
          <Col span={6}>
            <V2FormInput
              label='手机号'
              maxLength={11}
              name='mobile'
              placeholder='输入被邀请的手机号'
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: MOBILE_REG, message: '请输入正确的手机号' },
              ]}
            />
          </Col>
          <Col span={6}>
            <V2FormInput label='租户名称' required name='tenantName' maxLength={15} placeholder='输入发起邀请的租户名称' />
          </Col>
          <Col span={6}>
            <V2FormInput label='联系人' required name='contactName' maxLength={5} placeholder='输入发起邀请的联系人姓名' />
          </Col>
        </Row>
        <Button type='primary' onClick={methods.sendInvite} loading={loading}>发送邀请</Button>
        <Button className='ml-12' onClick={() => form.resetFields()}><RedoOutlined />重置</Button>
      </V2Form>
    </div>
  );
};

export default InviteForm;
