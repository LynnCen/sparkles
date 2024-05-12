/**
 * @Description 邀请客户表单
 */
import { useState } from 'react';
import styles from '../index.module.less';
import { RedoOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import { useForm } from 'antd/es/form/Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import copy from 'copy-to-clipboard';
import { useMethods } from '@lhb/hook';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { postLocxxMsgSend } from '@/common/api/locxx';
import { CHINESE_ENGLISH_REG } from '@lhb/regexp';
import { MOBILE_REG } from '@lhb/regexp';

const InviteForm = ({ onRefresh }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const methods = useMethods({
    sendInvite() {
      form.validateFields().then((values) => {
        setLoading(true);
        postLocxxMsgSend({
          ...values,
          inviteType: 2,
        }).then((res) => {
          onRefresh?.();
          V2Confirm({
            title: '微信邀请文案',
            content: res,
            okText: '复制文案',
            onSure() {
              copy(res);
              V2Message.success('复制成功');
            }
          });
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
            <V2FormInput
              label='客户名称'
              name='tenantName'
              maxLength={50}
              rules={[
                { required: true, message: '请输入客户名称' },
                { pattern: CHINESE_ENGLISH_REG, message: '仅支持输入中英文' },
              ]}
              placeholder='请填写被邀请的客户名称'/>
          </Col>
          <Col span={6}>
            <V2FormInput label='联系人' required name='contactName' maxLength={10} placeholder='请填写发送邀请的人员名称' />
          </Col>
        </Row>
        <Button type='primary' onClick={methods.sendInvite} loading={loading}>生成邀请链接</Button>
        <Button className='ml-12' onClick={() => form.resetFields()}><RedoOutlined />重置</Button>
      </V2Form>
    </div>
  );
};

export default InviteForm;
