import React from 'react';
import { Col, Row } from 'antd';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined';
import { useMethods } from '@lhb/hook';

import dayjs from 'dayjs';
import SearchForm from '@/common/components/Form/SearchForm';


const Filter: React.FC<any> = ({ onSearch, searchForm }) => {


  // const onExport = async () => {
  //   downloadFile({
  //     name: '个人绩效报表.xlsx',
  //     url: 'https://staticres.linhuiba.com/project-custom/locationpc/file/个人绩效报表.xlsx',
  //   });
  // };

  const methods = useMethods({
    onFinish(values) {
      const params = {
        ...values,
        start: dayjs(values.time[0]).format('YYYY-MM-DD'),
        end: dayjs(values.time[1]).format('YYYY-MM-DD'),
      };
      onSearch(params);
    },
    onRest() {
      searchForm.setFieldsValue({
        time: [dayjs().startOf('year'), dayjs().endOf('year')]
      });
    }
  });


  return (
    <Row>
      <Col span={22}>
        <SearchForm labelLength ={3} form={searchForm} onSearch={methods.onFinish} onCustomerReset={methods.onRest}>
          <V2FormRangePicker
            label={'统计月份'}
            name={'time'}
            config={{
              format: 'YYYY.MM',
              suffixIcon: <DownOutlined />,
              // disabledDate: disabledDate,
              picker: 'month',
              // onCalendarChange: val => setDates(val),
              style: {
                width: 220
              },
              // onChange: val => setValue(val),
            }}
          />
        </SearchForm>
      </Col>
      <Col span={2} style={{ textAlign: 'right' }}>
        {/* <Button type='primary' onClick={onExport}>
          导出报表
        </Button> */}
      </Col>
    </Row>
  );
};

export default Filter;
