import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import { Button, Col, Row } from 'antd';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { downloadFile } from '@/common/utils/ways';
import { data } from '../ts-config';

const devDptNameOptions: any = data.map((item) => ({ label: item.devDpt, value: item.devDpt }));

const Filter: React.FC<any> = ({ onSearch }) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  const onExport = async () => {
    downloadFile({
      name: '个人绩效报表.xlsx',
      url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/个人绩效报表.xlsx',
    });
  };

  return (
    <Row>
      <Col span={22}>
        <FormSearch labelLength={2} onSearch={onFinish}>
          <V2FormSelect label='开发部' name='devDpt' options={devDptNameOptions} />
          <V2FormInput label='姓名' name='name'/>
        </FormSearch>
      </Col>
      <Col span={2} style={{ textAlign: 'right' }}>
        <Button type='primary' onClick={onExport}>
          导出报表
        </Button>
      </Col>
    </Row>
  );
};

export default Filter;
