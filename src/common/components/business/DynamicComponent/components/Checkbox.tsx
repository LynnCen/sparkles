/**
 * @Description 复选组件
 */

import { FC, useEffect, useMemo, useState } from 'react';
import V2FormCheckbox from '@/common/components/Form/V2FormCheckbox/V2FormCheckbox';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { _otherTypeInputText, otherId, parseValueCatch, setComValue } from '../config';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { changeDynamicOtherFormNameArr } from '@/store/common';
import styles from './index.module.less';

interface InputInfoI {
  visible:boolean;// 是否展示
  value:string;// input表单值
}

const Checkbox: FC<any> = ({
  propertyItem,
  optLabelFieldName = 'name',
  optValueFieldName = 'id',
  disabled,
  required,
  showHintStr,
  form
}) => {
  const dispatch = useDispatch();
  const dynamicOtherFormNameArr = useSelector((state: any) => state.common.dynamicOtherFormNameArr); // 存放“其他”表单的formName

  const [helpInfo, setHelpInfo] = useState<string>('');
  const [selectValue, setSelectValue] = useState<any>(null);// 保存radio值
  const [inputInfo, setInputInfo] = useState<InputInfoI>({
    visible: false,
    value: ''
  });

  const label = propertyItem.anotherName || propertyItem.name || '';
  // const restrictionJson = (isNotEmptyAny(propertyItem.templateRestriction) ? propertyItem.templateRestriction : propertyItem.restriction);
  const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};
  const placeholder = restriction.placeholder ? restriction.placeholder : `请选择${label || ''}`;
  const selectMin = restriction.selectMin;
  const selectMax = restriction.selectMax;

  const options = useMemo(() => {
    if (!propertyItem) return;
    const _options = Array.isArray(propertyItem.propertyConfigOptionVOList) ? propertyItem.propertyConfigOptionVOList : [];

    // 根据restriction中有withOther判断是否存在“其他”选项，
    if (restriction?.withOther && !_options.map((item) => item.id).includes(otherId)) {
      _options.push({
        name: '其他',
        id: otherId,
      });
      dispatch(changeDynamicOtherFormNameArr(Array.from(new Set([...dynamicOtherFormNameArr, `${propertyItem.identification}${_otherTypeInputText}`]))));
    }
    return _options;
  }, []);

  // 回显
  useEffect(() => {
    if (!propertyItem?.textValue) return;
    const textValue = parseValueCatch(propertyItem);
    changeHandle(textValue?.map((item) => item.selectedId));

    textValue.map((value) => {
      if (value.selectedId === otherId) {
        form.setFieldValue(`${propertyItem.identification}${_otherTypeInputText}`, value?.input);
      }
    });

  }, [propertyItem]);

  const rules = [
    { required, message: placeholder },
    () => ({
      validator(_, value) {
        if (+selectMin && isNotEmptyAny(value) && value.length < selectMin) {
          return Promise.reject(`请至少选择${selectMin}项`);
        }
        if (+selectMax && isNotEmptyAny(value) && value.length > selectMax) {
          return Promise.reject(`最多可选择${selectMax}项`);
        }
        return Promise.resolve();
      },
    }),
  ];

  const changeHandle = (val: number[]) => {
    setSelectValue(val);

    // 是否选中了“其他”
    if (val.includes(otherId)) {
      setInputInfo({
        visible: true,
        value: ''
      });
    } else {
      setInputInfo({
        visible: false,
        value: ''
      });
    }

    const { restriction } = propertyItem || {};
    setHelpInfo(''); // 清空
    // 取消选中或者没有配置时不继续执行
    if (!restriction) return;
    const parsedRestriction = JSON.parse(restriction);
    const { redMark } = parsedRestriction || {};
    if (!(isArray(redMark) && isArray(val))) return;
    const str: string[] = [];
    val.forEach((item: number) => {
      redMark.forEach((redMarkItem: any) => {
        const { optionId, isRedMark, isItemTip, itemTip, isPageTip } = redMarkItem;
        if (optionId !== item) return;
        isRedMark && isItemTip && itemTip && (str.push(itemTip));
        isPageTip && showHintStr && (showHintStr());
      });
    });
    setHelpInfo(str.join('、'));

  };

  useEffect(() => {
    if (inputInfo.visible && inputInfo.value) {
      propertyItem[_otherTypeInputText] = inputInfo.value;
      setComValue(propertyItem, selectValue);
    }
  }, [inputInfo.value, selectValue]);

  return (
    <>
      <V2FormCheckbox
        className={styles.checkbox}
        label={label}
        name={propertyItem.identification}
        options={options}
        fieldNames={{
          label: optLabelFieldName,
          value: optValueFieldName
        }}
        disabled={disabled}
        required={required}
        rules={rules}
        onChange={changeHandle}
        formItemConfig={{
          help: helpInfo ? <div className='c-f23'>{helpInfo}</div> : null,
        }}
      />
      { inputInfo.visible
        ? <V2FormInput
          className={styles.checkboxOther}
          name={`${propertyItem.identification}${_otherTypeInputText}`}
          onChange={(e) => setInputInfo((state) => ({
            ...state,
            value: e.target.value
          }))}
          placeholder='请输入其他选项值'
          rules={[{ required: true, message: '请输入其他选项值' }]}
        />
        : <></>}
    </>
  );
};

export default Checkbox;

