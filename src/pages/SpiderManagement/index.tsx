import React, { useEffect, useState } from 'react';
import { Button, Form, message, Radio } from 'antd';
import { connect, useIntl } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { query, update } from './service';
import { ConnectState, UserModelState } from '@/models/connect';
import getPermissionsAsObj from '@/utils/permissions';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 16 },
};
interface PropsType {
  user?: UserModelState;
}

const SpiderManagement: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['setting', 'spiderswitch']));
  }, [props.user]);
  const onFinish = (values: any) => {
    console.log('Success:', values);
    update(values).then(
      () => message.success(formatMessage({ id: 'table-setting-finished' })),
      () => message.error(formatMessage({ id: 'table-setting-failure' })),
    );
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    query().then(form.setFieldsValue, console.log);
  });

  return (
    <PageHeaderWrapper>
      <Form
        {...layout}
        layout="vertical"
        name="basic"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label={formatMessage({ id: 'table-news-spider' })} name="news">
          <Radio.Group>
            <Radio value="0">{formatMessage({ id: 'word.close' })}</Radio>
            <Radio value="1">{formatMessage({ id: 'word.open' })}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={formatMessage({ id: 'table-covid-spider' })} name="covid">
          <Radio.Group>
            <Radio value="0">{formatMessage({ id: 'word.close' })}</Radio>
            <Radio value="1">{formatMessage({ id: 'word.open' })}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={!authObj.edit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(SpiderManagement);
