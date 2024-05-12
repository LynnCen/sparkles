// 基本信息
import { FC, useEffect } from 'react';
import { getKeysFromObjectArray, parseObjectArrayToString } from '@lhb/func';
import { Col, Row, Typography, Form } from 'antd';
import { Description, PageContainer } from '@/common/components';

interface ActiveInfoEditorProps {
  title: string, // 活动名称
  brands: Array<any> // 品牌数组
}

const Component:FC<ActiveInfoEditorProps> = ({ title, brands }) => {

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ title, brandIds: getKeysFromObjectArray(brands, 'id') });
  }, [title, brands]);


  return (
    <>
      <Typography.Title level={5}>活动信息</Typography.Title>
      <PageContainer noPadding noMargin>
        <Row gutter={20}>
          <Col span={12}>
            <Description border label='活动名称'>{title}</Description>
          </Col>
          <Col span={12}>
            <Description border label='品牌'>{parseObjectArrayToString(brands, 'name')}</Description>
          </Col>
        </Row>
      </PageContainer>
    </>);
};

export default Component;
