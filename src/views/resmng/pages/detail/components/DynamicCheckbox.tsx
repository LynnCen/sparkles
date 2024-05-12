import { useMethods } from '@lhb/hook';
import { Space, Input, Checkbox } from 'antd';
import React, { useMemo, useState } from 'react';
import styles from './detail.module.less';

// [{'selectedId':123, input:''222"},{'selectedId':222, input:''222"}] 和输入框一起使用
// [{'selectedId':123,},{'selectedId':222}] 单纯作为checkbox使用

// prop.restriction为原始属性
// restriction是与模版属性合并过的

const DynamicCheckbox: React.FC<any> = ({ value, onChange, prop, restriction }) => {
  const [inputValues, setInputValues] = useState<{ [propname: string | number]: string }>({});

  // checkbox选中的value
  const checkValues = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => item.selectedId);
  }, [value]);

  // 是否显示input输入框
  const withInput = useMemo(() => {
    if (prop?.restriction) {
      const res = JSON.parse(prop?.restriction || '');
      if (res && res.length && res.indexOf('withInput') > -1) {
        return true;
      }
    }
    return false;
  }, [prop]);

  // 是否显示其他
  const withOther = useMemo(() => {
    if (prop?.restriction) {
      const res = JSON.parse(prop?.restriction || '');
      if (res && res.length && res.indexOf('withOther') > -1) {
        return true;
      }
    }
    return false;
  }, [prop]);

  const { onSelected, onInput } = useMethods({
    onSelected(checkedValues: any[]) {
      // 如果有输入框
      if (withInput || withOther) {
        const values = { ...inputValues };
        if (Array.isArray(value) && value.length) {
          for (let i = 0, len = value.length; i < len; i++) {
            const item = value[i];
            values[item.selectedId] = values[item.selectedId] || item?.input;
          }
        }
        const checklist = checkedValues.map((item) => ({
          selectedId: item,
          input: values[item],
        }));
        onChange(checklist);
        setInputValues(values);
      } else {
        // 单纯checkbox的时候
        onChange(checkedValues.map((item) => ({ selectedId: item })));
      }
    },

    onInput(k: string | number, input: string) {
      if (Array.isArray(value) && value.length) {
        const targetIndex = value.findIndex((item) => item.selectedId === k);
        if (targetIndex !== -1) {
          const checkList = (value || []).slice();
          checkList[targetIndex].input = input;
          onChange(checkList);
        }
      }
      const values = { ...inputValues };
      values[k] = input;
      setInputValues(values);
    },
  });

  const showInput = (id) => {
    if (!Array.isArray(value)) return '';
    const target = value.find((item) => item.selectedId === id);
    return target?.input || '';
  };

  return (
    <Checkbox.Group value={checkValues} onChange={onSelected}>
      {/* <Space direction={withInput || withOther || prop?.propertyOptionList?.length > 4 ? 'vertical' : 'horizontal'}> */}
      <Space wrap>
        {(prop?.propertyOptionList || []).map(
          (item: {
            id: string | number | null | undefined;
            name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
          }) => {
            return (
              <div key={item.id} className={styles.radioInputWrap}>
                <Checkbox
                  value={item.id}
                  disabled={checkValues.length >= restriction.max && !checkValues.includes(item.id)}
                >{item.name}</Checkbox>
                {withInput ? (
                  <Input
                    disabled={checkValues.length >= restriction.max && !checkValues.includes(item.id)}
                    style={{ marginLeft: '10px', width: '150px' }}
                    value={inputValues[item.id || ''] || showInput(item.id)}
                    onChange={(e) => onInput(item.id, e.target.value)}
                  />
                ) : null}
              </div>
            );
          }
        )}
        {withOther ? (
          <div className={styles.radioInputWrap}>
            <Checkbox value={'other'} disabled={checkValues.length >= restriction.max && !checkValues.includes('other')}>其他</Checkbox>
            <div className={styles.nameInputWrap}>
              <Input
                disabled={checkValues.length >= restriction.max && !checkValues.includes('other')}
                style={{ marginLeft: '10px', width: '150px' }}
                value={inputValues?.other || showInput('other')}
                onChange={(e) => onInput('other', e.target.value)}
              />
            </div>
          </div>
        ) : null}
      </Space>
    </Checkbox.Group>
  );
};
export default DynamicCheckbox;
