/**
 * @Description 单选组件
 */

import { FC, useState, useEffect, useMemo } from 'react';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import { _otherTypeInputText, otherId, parseValueCatch, setComValue } from '@/common/components/business/DynamicComponent/config';
import { isArray } from '@lhb/func';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { changeDynamicOtherFormNameArr } from '@/store/common';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.less';
interface InputInfoI {
  visible:boolean;// 是否展示
  value:string;// input表单值
}
const Radio: FC<any> = ({
  propertyItem,
  form,
  disabled,
  required,
  updateRelateShow,
  showHintStr
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
  const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};
  const placeholder = restriction.placeholder ? restriction.placeholder : `请选择${label || ''}`;

  const options = useMemo(() => {
    if (!propertyItem) return;
    const _options = Array.isArray(propertyItem.propertyConfigOptionVOList) ? propertyItem.propertyConfigOptionVOList.map((itm) => ({
      label: itm.name,
      value: itm.id,
    })) : [];

    // 根据restriction中有withOther判断是否存在“其他”选项，
    if (restriction?.withOther && selectValue !== otherId) {
      _options.push({
        label: '其他',
        value: otherId,
      });
    }
    // 当勾选了“其他”
    if (restriction?.withOther && selectValue === otherId) {
      _options.push({
        label: <span className={styles.radioOtherInput}>
          其他
          <V2FormInput
            name={`${propertyItem.identification}${_otherTypeInputText}`}
            onChange={(e) => setInputInfo((state) => ({
              ...state,
              value: e.target.value
            }))}
            rules={[{ required: true, message: '请输入其他选项值' }]}
            placeholder='请输入其他选项值'
          /></span>,
        value: otherId,
      });
      dispatch(changeDynamicOtherFormNameArr(Array.from(new Set([...dynamicOtherFormNameArr, `${propertyItem.identification}${_otherTypeInputText}`]))));
    }
    return _options;
  }, [selectValue]);

  const rules = [
    { required, message: placeholder },
  ];
  const onClear = () => {
    setComValue(propertyItem, null);
    updateRelateShow(propertyItem);
    setInputInfo({
      visible: false,
      value: ''
    });
    setSelectValue(null);
  };
  // 回显
  useEffect(() => {
    if (!propertyItem?.textValue) return;
    const textValue = parseValueCatch(propertyItem);
    changeHandle({
      target: {
        value: textValue?.selectedId
      }
    });
    if (textValue?.selectedId === otherId) {
      form.setFieldValue(`${propertyItem.identification}${_otherTypeInputText}`, textValue?.input);
    }
  }, [propertyItem]);

  const changeHandle = (e: any) => {
    const { target } = e || {};
    const { value } = target || {};
    setSelectValue(value);

    // 是否选中了“其他”
    if (value === otherId) {
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
    if (!(isArray(redMark) && value)) return; // 注意这里预期id不会为0
    const targetConfig = redMark.find((item: any) => item.optionId === value);
    if (targetConfig) {
      const { isRedMark, isItemTip, itemTip, isPageTip } = targetConfig;
      isRedMark && isItemTip && itemTip && (setHelpInfo(itemTip));
      isPageTip && showHintStr && (showHintStr());
    }
  };

  useEffect(() => {
    if (inputInfo.visible && inputInfo.value) {
      propertyItem[_otherTypeInputText] = inputInfo.value;
      setComValue(propertyItem, selectValue);
    }
  }, [inputInfo.value, selectValue]);

  return (
    <>
      <V2FormRadio
        label={label}
        name={propertyItem.identification}
        options={options}
        required={required}
        rules={rules}
        form={form}
        disabled={disabled}
        canClearEmpty={!required && !disabled}
        onClear={onClear}
        onChange={changeHandle}
        formItemConfig={{
          help: helpInfo ? <div className='c-f23'>{helpInfo}</div> : null,
        }}
      />
    </>
  );
};

export default Radio;

