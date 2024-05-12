import { Select, Input, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';

const { Group } = Input;

const DynamicSelect: React.FC<any> = (
  { placeholder,
    propertyOptionList = [],
    restriction = [],
    value,
    onChange
  }) => {
  const options = propertyOptionList?.map(item => ({ value: item.id, label: item.name }));
  if (restriction && restriction.indexOf('withOther') > -1) {
    options.push({ value: 'other', label: '其他' });
  };
  const [newOptions, setnewOptions] = useState<any[]>(options || []);
  const [isShowInput, setIsShowInput] = useState<boolean>(false);
  const [values, setValues] = useState<{selectedId?: string, input?: string}>({});
  const { selectedId, input } = values;

  const onSelectChange = (value) => {
    const newValues = {
      ...values,
      selectedId: value
    };
    setValues(newValues);
    onChange?.(newValues);
  };

  const onInputChange = (e: any) => {
    const { target } = e;
    const newValues = {
      ...values,
      input: target.value
    };
    setValues(newValues);
    onChange?.(newValues);
  };

  const onSearch = (value: string) => {
    const newOptions = options.filter(option => {
      const { label } = option;
      return label.includes(value);

    });
    setnewOptions(newOptions);
  };

  const onCleaer = () => {
    setnewOptions(options);
  };


  useEffect(() => {
    if (!value) {
      return;
    }
    setValues(value);
  }, [value]);

  useEffect(() => {
    if (!selectedId || !restriction) {
      return;
    }

    if (selectedId === 'other') {
      setIsShowInput(true);
      return;
    }

    if (restriction.indexOf('withInput') < 0 && restriction.indexOf('withOther')) {
      setIsShowInput(false);
      return;
    }

    setIsShowInput(true);

  }, [restriction, selectedId]);

  useEffect(() => {

  }, [propertyOptionList]);



  return (
    <Group>
      <Row>
        <Col span={ isShowInput ? 16 : 24}>
          <Select
            style={{ width: '100%' }}
            filterOption={false}
            allowClear
            showSearch
            onSearch={onSearch}
            onClear={onCleaer}
            placeholder={placeholder}
            value={selectedId}
            onChange={onSelectChange}
            options={newOptions}/>
        </Col>
        {
          isShowInput &&
        <Col span={8}><Input value={input} onChange={onInputChange} placeholder='请输入'/></Col>
        }
      </Row>
    </Group>
  );
};
export default DynamicSelect;
