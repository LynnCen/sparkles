import { MinusCircleOutlined } from '@ant-design/icons';
import { Col, Row, Select } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames'

interface DataLinkageProps {
  value?: any;
  onChange?: (value: any) => void;
  properties?: any[];
  options?: any[];
  onRemove?: () => void;
  disabled?: boolean;
}

const DataLinkage: FC<DataLinkageProps> = ({ value, onChange, properties, options, onRemove, disabled }) => {
  const [selectValue, setSelectValue] = useState<string>();
  const [treeSelectValue, setTreeSelectValue] = useState<string>();

  // 第2列变动
  const onTreeSelectChange = (value: any) => {
    setTreeSelectValue(value);
    onChange?.({ value: selectValue, relationsComponent: value });
  };

  // 第1列变动
  const onSelectChange = (value: any) => {
    setSelectValue(value);
    onChange?.({ value: value, relationsComponent: treeSelectValue });
  };

  useEffect(() => {
    const { value: optValue, relationsComponent } = value || {};
    setSelectValue(optValue);
    setTreeSelectValue(relationsComponent);
  }, [value]);

  return (
    <div className={styles.wrapper}>
    <div className={styles.dataLinkageWrapper}>
      <div className={styles.dataLinkage}>
        <Row align='middle' justify='center' gutter={10} wrap={false}>
          <Col>
            <span className={styles.text}>当选择了</span>
          </Col>
          <Col>
            <Select placeholder='请选择值'
              value={selectValue}
              options={options}
              style={{width: 120}}
              filterOption={(input, option) => (option?.name ?? '').includes(input)}
              fieldNames={{
                label: 'name',
                value: 'id',
              }}
              onChange={onSelectChange}/>
          </Col>
          <Col>
            <span className={styles.text}>时,显示</span>
          </Col>
          <Col>
            <Select
              placeholder='请选择属性'
              style={{width: 120}}
              options={selectValue ? properties : []}
              value={treeSelectValue}
              filterOption={(input, option) => (option?.name ?? '').includes(input)}
              mode='multiple'
              maxTagCount='responsive'
              fieldNames={{
                label: 'name',
                value: 'propertyId',
              }}
              onChange={onTreeSelectChange}/>
          </Col>
        </Row>
      </div>
    </div>
     <MinusCircleOutlined className={cs(styles.icon, {[styles.disabled]: disabled})} onClick={onRemove} />
     </div>
  );

};

export default DataLinkage;
