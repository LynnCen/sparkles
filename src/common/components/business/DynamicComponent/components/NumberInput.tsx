/**
 * @Description 数字输入框
 */

import { FC, useEffect, useMemo, useState } from 'react';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import { isNotEmpty, contrast, isArray } from '@lhb/func';
import { parseValueCatch } from '../config';

const NumberInput: FC<any> = ({
  propertyItem,
  disabled,
  required,
  showHintStr
}) => {
  const [helpInfo, setHelpInfo] = useState<string>('');
  const label = propertyItem.anotherName || propertyItem.name || '';
  const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};
  const placeholder = restriction.placeholder ? restriction.placeholder : `请输入${label || ''}`;
  const minValue = contrast(restriction, 'range.minValue');
  const maxValue = contrast(restriction, 'range.maxValue', 9999999999);
  const decimals = contrast(restriction, 'precision.decimals', 0); // 小数点位数
  const addonAfter = Array.isArray(restriction.suffixOptionList) && restriction.suffixOptionList.length && restriction.suffixOptionList[0].name ? restriction.suffixOptionList[0].name : null;

  const rules = [
    { required, message: placeholder },
    () => ({
      validator(_, value) {
        if (isNotEmpty(minValue) && isNotEmpty(value) && value < minValue) {
          return Promise.reject(`请输入至少${minValue}`);
        }
        return Promise.resolve();
      },
    }),
  ];

  useEffect(() => {
    if (!propertyItem?.textValue) return;
    const textValue = parseValueCatch(propertyItem);
    changeHandle(textValue?.value);
  }, [propertyItem]);

  const isDisabled = useMemo(() => {
    if (!propertyItem) return false;
    const { restriction, identification } = propertyItem;
    if (identification === 'returnperiod') return true; // 定制逻辑（益禾堂租户专用的字段）
    if (!restriction) return false;
    const { expr } = parseValueCatch(propertyItem, 'restriction');
    return isArray(expr) && expr.length > 0;
  }, [propertyItem]);

  const changeHandle = (val: number) => {
    const { restriction } = propertyItem || {};
    setHelpInfo('');
    if (!restriction) return;
    const parsedRestriction = JSON.parse(restriction);
    const { redMark } = parsedRestriction || {};
    if (!redMark) return;
    const {
      firstComapre,
      firstValue,
      isItemTip,
      isRedMark,
      itemTip,
      joinType,
      secondComapre,
      secondValue,
      isPageTip
    } = redMark;
    // if (!joinType) return; // 值为 '&&'或者'||'
    let expressionStr = '';
    if (firstComapre && firstValue) { // 满足的第一个条件
      expressionStr += `(${val}${firstComapre === '=' ? '==' : firstComapre}${firstValue})`;
    }
    if (secondComapre && secondValue) { // 满足的第二个条件
      // 如果第一个条件 ？(拼接上joinType + 第二个条件) : 第二个条件
      expressionStr += `${expressionStr ? `${firstComapre && firstValue && joinType ? joinType : ''}(${val}${secondComapre === '=' ? '==' : secondComapre}${secondValue})` : `${val}${secondComapre}${secondValue}`}`;
    }
    // eslint-disable-next-line no-eval
    if (eval(expressionStr)) {
      isRedMark && isItemTip && itemTip && (setHelpInfo(itemTip));
      isPageTip && showHintStr && (showHintStr());
    }
  };

  return (
    <V2FormInputNumber
      label={label}
      name={propertyItem.identification}
      placeholder={placeholder}
      max={maxValue}
      min={minValue}
      precision={!!decimals && decimals > 0 ? decimals : 0}
      config={{ addonAfter }}
      required={required}
      rules={rules}
      disabled={isDisabled || disabled}
      onChange={changeHandle}
      formItemConfig={{
        help: helpInfo ? <div className='c-f23'>{helpInfo}</div> : null
      }}
    />
  );
};

export default NumberInput;
