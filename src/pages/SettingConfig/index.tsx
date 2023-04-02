import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, useIntl } from 'umi';
import { getConfigure, setConfigure } from '@/pages/SettingConfig/service';
import { UserModelState } from '@/models/user';
import getPermissionsAsObj from '@/utils/permissions';
import { ConnectState } from '@/models/connect';

const inputWidth = 500;

interface PropsType {
  user?: UserModelState;
}

const SettingConfig: React.FC<PropsType> = (props) => {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['setting', 'config']));
  }, [props.user]);
  useEffect(() => {
    getConfigure().then(form.setFieldsValue, console.log);
  }, [form]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };

  const tailLayout = {
    wrapperCol: { offset: 3, span: 16 },
  };

  const onFinish = (values: any) => {
    // eslint-disable-next-line no-underscore-dangle
    setConfigure(values, values._id).then(
      () => {
        form.setFieldsValue(values);
        message.success(formatMessage({ id: 'table-setting-finished' }));
      },
      (e) => console.log(e),
    );
  };

  return (
    <PageHeaderWrapper>
      <Form
        {...formItemLayout}
        layout="vertical"
        form={form}
        name="config"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item name="_id" style={{ display: 'none' }}>
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item
          name="sms_interval"
          label={formatMessage({ id: 'config.interval' })}
          rules={[
            {
              required: true,
              message: `${formatMessage({ id: 'table-form-placeholder' })} ${formatMessage({
                id: 'config.interval',
              })}!`,
            },
          ]}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>

        <Form.Item
          name="captcha_timeout"
          label={formatMessage({ id: 'config.code.expire' })}
          rules={[
            {
              required: true,
              message: `${formatMessage({ id: 'table-form-placeholder' })} ${formatMessage({
                id: 'config.code.expire',
              })}!`,
            },
          ]}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>

        <Form.Item
          name="rec_money_max_amount"
          label={formatMessage({ id: 'config.receipt.count' })}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>

        <Form.Item name="rec_env_remark" label={formatMessage({ id: 'config.bonus.remark' })}>
          <Input.TextArea style={{ width: inputWidth }} />
        </Form.Item>

        <Form.Item name="red_env_timeout" label={formatMessage({ id: 'config.bonus.expire' })}>
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>

        <Form.Item name="oto_red_env_max_sum" label={formatMessage({ id: 'config.bonus.one2one' })}>
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>

        <Form.Item
          name="rand_red_env_max_amount"
          label={formatMessage({ id: 'config.bonus.random.count' })}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>

        <Form.Item
          name="rand_red_env_max_sum"
          label={formatMessage({ id: 'config.bonus.random.amount' })}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item
          name="rand_red_env_up_rate"
          label={formatMessage({ id: 'config.bonus.random.rate' })}
          extra={formatMessage({ id: 'config.bonus.random.desc' })}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item name="transfer_max_sum" label={formatMessage({ id: 'config.transfer.amount' })}>
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item name="transfer_timeout" label={formatMessage({ id: 'config.transfer.expire' })}>
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item
          name="scan_transfer_max_sum"
          label={formatMessage({ id: 'config.transfer.amount.qr' })}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item
          name="trans_bank_service_rate"
          label={formatMessage({ id: 'config.transfer.rate' })}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item
          name="trans_bank_service_min"
          label={formatMessage({ id: 'config.transfer.rate.amount' })}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item
          name="trans_bank_max_sum"
          label={formatMessage({ id: 'config.transfer.max.amount' })}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item
          name="trans_bank_min_sum"
          label={formatMessage({ id: 'config.transfer.min.amount' })}
        >
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item name="withdraw_service_rate" label={formatMessage({ id: 'config.get.rate' })}>
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item name="withdraw_service_min" label={formatMessage({ id: 'config.get.rate.min' })}>
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item name="withdraw_max_sum" label={formatMessage({ id: 'config.get.max.amount' })}>
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item name="withdraw_min_sum" label={formatMessage({ id: 'config.get.min.amount' })}>
          <InputNumber style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item name="sensitive_words" label={formatMessage({ id: 'config.sensitive.word' })}>
          <Input.TextArea style={{ width: inputWidth }} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={!authObj.edit}>
            {formatMessage({ id: 'config.submit' })}
          </Button>
        </Form.Item>
      </Form>
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(SettingConfig);
