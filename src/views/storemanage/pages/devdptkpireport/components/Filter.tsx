import React from 'react';
import { Button, Col, Row } from 'antd';
import { downloadFile } from '@lhb/func';

const Filter: React.FC<any> = () => {

  const onExport = async () => {
    downloadFile({
      name: '开发部绩效报表.xlsx',
      url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/开发部绩效报表.xlsx',
    });
  };

  return (
    <Row>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button type='primary' onClick={onExport} className='mb-24'>
          导出报表
        </Button>
      </Col>
    </Row>
  );
};

export default Filter;
