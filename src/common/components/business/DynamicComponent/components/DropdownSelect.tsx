/**
 * @Description 下拉组件（支持单选、多选）
 */

import { FC, useState, useEffect, useMemo } from 'react';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { isArray } from '@lhb/func';
import { _otherTypeInputText, otherId, parseValueCatch, setComValue } from '../config';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { changeDynamicOtherFormNameArr } from '@/store/common';
import { Col, Row } from 'antd';
import styles from './index.module.less';
interface InputInfoI {
  visible:boolean;// 是否展示
  value:string;// input表单值
}

const DropdownSelect: FC<any> = ({
  propertyItem,
  isMultiple = false,
  optLabelFieldName = 'name',
  optValueFieldName = 'id',
  disabled,
  required,
  showHintStr,
  form,
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
    const _options = Array.isArray(propertyItem.propertyConfigOptionVOList) ? propertyItem.propertyConfigOptionVOList : [];

    // 根据restriction中有withOther判断是否存在“其他”选项，
    if (restriction?.withOther) {
      console.log('restriction', restriction);
      _options.push({
        name: '其他',
        id: otherId,
      });
      dispatch(changeDynamicOtherFormNameArr(Array.from(new Set([...dynamicOtherFormNameArr, `${propertyItem.identification}${_otherTypeInputText}`]))));

    }
    return _options;
  }, []);

  const rules = [
    { required, message: placeholder },
  ];
  // 回显
  useEffect(() => {
    if (!propertyItem?.textValue) return;
    const textValue = parseValueCatch(propertyItem);
    changeHandle(textValue?.selectedId);
    if (textValue?.selectedId === otherId) {
      form.setFieldValue(`${propertyItem.identification}${_otherTypeInputText}`, textValue?.input);
    }
  }, [propertyItem]);

  const changeHandle = (value: number) => {
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
    <Row>
      <Col span={inputInfo.visible ? 12 : 24}
        style={{
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <V2FormSelect
          label={label}
          name={propertyItem.identification}
          placeholder={placeholder}
          options={options}
          disabled={disabled}
          required={required}
          config={{
            showSearch: false, // UI认为右侧不应展示搜索icon，应展示下拉箭头
            mode: isMultiple ? 'multiple' : undefined,
            fieldNames: { label: optLabelFieldName, value: optValueFieldName },
            filterOption: (input, option) => (
              ((option?.[optLabelFieldName] ?? '') as any).toLowerCase().includes(input.toLowerCase()))
          }}
          rules={rules}
          onChange={changeHandle}
          formItemConfig={{
            help: helpInfo ? <div className='c-f23'>{helpInfo}</div> : null,
          }}
        />
      </Col>

      <Col span={inputInfo.visible ? 12 : 0}
        className={styles.dropdownSelectOther}
        style={{
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        {inputInfo.visible ? <V2FormInput
          name={`${propertyItem.identification}${_otherTypeInputText}`}
          onChange={(e) => setInputInfo((state) => ({
            ...state,
            value: e.target.value
          }))}
          placeholder='请输入其他选项值'
          rules={[{ required: true, message: '请输入其他选项值' }]}
        /> : <></>}
      </Col>

    </Row>
  );
};

export default DropdownSelect;
