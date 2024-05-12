import FormInput from '@/common/components/Form/FormInput';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormTextArea from '@/common/components/Form/FormTextArea';
import { Col, Form, Row, Typography } from 'antd';
import React from 'react';

const DynamicCurrentPrice: React.FC<any> = ({ propertyId }) => {
  const { Text } = Typography;

  return (
    <div>
      <div>
        <FormInput
          label='报批费'
          placeholder='报批费'
          name={['propertyList', propertyId, 'reportPrice']}
          maxLength={100}
        />
        <FormInput
          label='其他杂费'
          placeholder='其他杂费'
          name={['propertyList', propertyId, 'otherPrice']}
          maxLength={100}
        />
        <FormInputNumber
          label='押金'
          placeholder='押金'
          name={['propertyList', propertyId, 'orderPrice']}
          min={0}
          max={1000000}
          config={{
            addonAfter: '元',
            precision: 2,
          }}
        />
        <FormTextArea label='备注' name={['propertyList', propertyId, 'remark']} maxLength={200} />
      </div>

      <Form.Item noStyle>
        <Row style={{ width: '900px', backgroundColor: '#FAFAFA' }}>
          <Col span={3}>
            <Text strong>价格类型</Text>
          </Col>
          <Col span={3}>
            <Text strong>工作日价格</Text>
          </Col>
          <Col span={3}>
            <Text strong>周五价格</Text>
          </Col>
          <Col span={3}>
            <Text strong>周末价格</Text>
          </Col>
          <Col span={3}>
            <Text strong>节假日价格</Text>
          </Col>
          <Col span={3}>
            <Text strong>周价格</Text>
          </Col>
          <Col span={3}>
            <Text strong>月价格</Text>
          </Col>
        </Row>
        <Row style={{ width: '900px', marginTop: 15 }}>
          <Col span={3}>
            <div>成本价</div>
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'costPrice', 'weekdayPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'costPrice', 'fridayPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'costPrice', 'weekendPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'costPrice', 'holidayPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'costPrice', 'weekPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'costPrice', 'monthlyPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
          </Col>
          <Col span={3}>
            <div>刊例价</div>
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'publishPrice', 'weekdayPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'publishPrice', 'fridayPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'publishPrice', 'weekendPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'publishPrice', 'holidayPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'publishPrice', 'weekPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
          <Col span={3}>
            <FormInputNumber
              name={['propertyList', propertyId, 'publishPrice', 'monthlyPrice']}
              min={0}
              max={1000000}
              config={{
                precision: 2,
              }}
            />
          </Col>
        </Row>
      </Form.Item>
    </div>
  );
};
export default DynamicCurrentPrice;
