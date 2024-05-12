
import { FC } from 'react';
import { Divider } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { contendInfoFields } from 'src/common/components/business/DynamicComponent/config';
import { Row, Col } from 'antd';

// 周边店铺信息
const ContendInfoDetail: FC<any> = ({ value }) => {
  return <>
    {value?.map((item, index) => <div key={index}>
      {index ? <Divider style={{
        marginBottom: 8,
        borderColor: '#eee'
      }}/> : <></>}
      <Row gutter={24}>
        {contendInfoFields.map((field, idx) => <Col key={idx} span={12}>
          <V2DetailItem
            label={field.label}
            value={value[index]?.[field.name] ? value[index]?.[field.name] + (field?.suffix ? ` ${field?.suffix}` : '') : value[index]?.[field.name]}
          />
        </Col>)}
      </Row>
    </div>)}
  </>;
};

export default ContendInfoDetail;
