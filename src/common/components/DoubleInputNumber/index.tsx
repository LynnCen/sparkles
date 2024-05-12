import { Col, InputNumber, Row } from 'antd';
import { useEffect, useState, FC } from 'react';
import styles from './index.module.less';

interface DoubleInputNumberProps {
  onChange?: (values: Value) => void;
  value?: Value;
  placeholders?: [string, string];
  unit?: string;
  split?: string;
  precision?: number;
}

interface Value {
  minValue?: number;
  maxValue?: number;
}



const DoubleInputNumber: FC< DoubleInputNumberProps> = ({ value, onChange, placeholders, unit = '元', split = '至', ...restProps }) => {
  const [min, setMin] = useState<number | undefined>();
  const [max, setMax] = useState<number | undefined>();
  const [minPlaceholder, maxPlaceholder] = placeholders || ['最小值', '最大值'];

  const precision = restProps.precision === undefined ? 2 : restProps.precision;


  const onMinChnage = (value: number) => {
    setMin(value);
    onChange?.({ maxValue: max, minValue: value });
  };

  const onMaxChange = (value: number) => {
    setMax(value);
    onChange?.({ maxValue: value, minValue: min });
  };

  useEffect(() => {
    const { minValue, maxValue } = value || {};
    setMin(minValue);
    setMax(maxValue);
  }, [value]);

  const onBlur = () => {
    if (max && min) {
      if (min > max!) {
        setMax(min);
        setMin(max);
        onChange?.({ maxValue: min, minValue: max });
      }
    }
  };



  return (
    <Row>
      <Col span={12}>
        <InputNumber
          className={styles.noBorderRight}
          value={min}
          max={9999999999999}
          onChange={onMinChnage as any}
          onBlur={onBlur}
          placeholder={minPlaceholder}
          precision={precision}
          addonAfter={split}/>
      </Col>
      <Col span={12}>
        <InputNumber
          value={max}
          max={9999999999999}
          placeholder={maxPlaceholder}
          precision={precision}
          onBlur={onBlur}
          addonAfter={unit}
          onChange={onMaxChange as any}/>
      </Col>
    </Row>
  );
};


export default DoubleInputNumber;
