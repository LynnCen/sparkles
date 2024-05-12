import { useMethods } from '@lhb/hook';
import { Radio, Space, Input } from 'antd';
import React, { useMemo, useState } from 'react';
import styles from './detail.module.less';

const DynamicRadio: React.FC<any> = ({ value, onChange, prop }) => {
  const [inputValues, setInputValues] = useState<{ [propname: string | number]: string }>({});

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
    onSelected(e: { target: { value: any } }) {
      const selectId = e.target.value;
      // 如果有输入框
      if (withInput && withOther) {
        const values = { ...inputValues };
        if (value?.selectedId) {
          values[value.selectedId] = values[value.selectedId] || value?.input || '';
          setInputValues(values);
        }
        onChange({ input: values[selectId] || '', selectedId: selectId });
      } else {
        // 单纯radio的时候
        onChange({ selectedId: selectId });
      }
    },
    onInput(k: string | number, value: string) {
      const values = { ...inputValues };
      values[k] = value;
      setInputValues(values);
      onChange({ selectedId: k, input: value });
    },
  });

  return (
    <Radio.Group value={value?.selectedId || ''} onChange={onSelected} >
      <Space direction={withInput || withOther || prop?.propertyOptionList?.length > 2 ? 'vertical' : 'horizontal'}>
        {(prop?.propertyOptionList || []).map(
          (item: {
            id: string | number | null | undefined;
            name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
          }) => {
            return (
              <div key={item.id} className={styles.radioInputWrap}>
                <Radio value={item.id}>{item.name}</Radio>
                {withInput ? (
                  <Input
                    style={{ marginLeft: '10px', width: '90%' }}
                    value={inputValues[item.id || ''] || (value?.selectedId === item.id && value?.input) || ''}
                    onChange={(e) => onInput(item.id, e.target.value)}
                  />
                ) : null}
              </div>
            );
          }
        )}
        {withOther ? (
          <div className={styles.radioInputWrap}>
            <Radio value={'other'}>其他</Radio>
            <div className={styles.nameInputWrap}>
              <Input
                style={{ marginLeft: '10px', width: '90%' }}
                value={inputValues?.other || (value?.selectedId === 'other' && value?.input) || ''}
                onChange={(e) => onInput('other', e.target.value)}
              />
            </div>
          </div>
        ) : null}
      </Space>
    </Radio.Group>
  );
};
export default DynamicRadio;
