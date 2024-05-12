import { DatePicker, InputNumber, Row, Col } from 'antd';
import { FC, useEffect, useState } from 'react';

interface AddPriceProps {
  value?: any;
  onChange?: (value: any) => void;
}

const AddPrice: FC<AddPriceProps> = ({ value, onChange }) => {
  const [date, setDate] = useState<any>();
  const [number, setNumber] = useState<number | undefined>();

  const onDateChange = (value: any) => {
    setDate(value);
    onChange?.({ amount: number, date: value });
  };

  const onNumberChange = (value: any) => {
    setNumber(value);
    onChange?.({ amount: value, date });
  };

  useEffect(() => {
    const { date, amount } = value || {};
    setDate(date);
    setNumber(amount);
  }, [value]);

  return (
    <Row gutter={24}>
      <Col span={12}>
        <DatePicker style={{ width: '100%' }} value={date} onChange={onDateChange}/>
      </Col>
      <Col span={12}>
        <InputNumber
          addonAfter='元'
          placeholder='请输入数字'
          style={{ width: '100%' }}
          precision={2}
          max={9999999999.99}
          min={0}
          value={number} onChange={onNumberChange}/>
      </Col>
    </Row>

  );
};

export default AddPrice;
