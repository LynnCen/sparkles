/*
* version: 当前版本2.10.12
*/
import React, { ReactNode, useContext, useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { Form, FormItemProps, InputNumber, InputNumberProps, Tooltip, TooltipProps } from 'antd';
import { V2FormContext } from '../V2Form';
import { useMethods } from '@lhb/hook';
import { isNotEmpty } from '@lhb/func';

export interface DefaultFormItemProps {
  /**
   * @description 字段名，支持数组
   */
  name?: string | number | (string | number)[];
  /**
   * @description label 标签的文本
   */
  label?: ReactNode;
  /**
   * @description 为 true 时不带样式，作为纯字段控件使用
   * @default  false
   */
  noStyle?: boolean;
  /**
   * @description Form.Item中rule属性设置，具体请参考 https://ant.design/components/form-cn/#Rule
   */
  rules?: any[];
  /**
   * @description Form.Item的属性设置，具体请参考 https://ant.design/components/form-cn/#Form.Item
   */
  formItemConfig?: FormItemProps; // Form.Item的其他入参
}

export interface V2FormInputNumberProps extends DefaultFormItemProps {
  /**
   * @description 输入框提示
   */
  placeholder?: string;
  /**
   * @description 最大数
   */
  max?: number;
  /**
   * @description 最小数
   */
  min?: number;
  /**
   * @description 小数点位数
   */
  precision?: number;
  /**
   * @description InputNumber的属性配置，具体请参考 https://ant.design/components/input-number-cn/#API
   */
  config?: InputNumberProps & { ref?: any };
  /**
   * @description 额外插入的外层class
   */
  className?: string;
  /**
   * @description 是否必填
   * @default false
   */
  required?: boolean;
  /**
   * @description 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * @description 失去焦点的回调
   */
  blur?: Function;
  /**
   * @description 获取焦点的回调
   */
  focus?: Function;
  /**
   * @description tooltip配置
   */
  tooltip?: TooltipProps & {
    defaultValue?: ReactNode;
    formatter?: Function;
  };
  /**
   * @description 颜色变化后触发的回调
   */
  onChange?: Function;
  /**
   * @description form实例
   */
  form?: any;
}
/**
* @description 便捷文档地址
* @see https://reactpc.lanhanba.net/components/form/v2form-input-number
*/
const V2FormInputNumber: React.FC<V2FormInputNumberProps> = ({
  label,
  name,
  rules = [],
  placeholder = `请输入${label || ''}`,
  max = 99999999999.99,
  min = 0.01,
  precision = 2,
  blur,
  focus,
  tooltip,
  onChange,
  formItemConfig = {},
  config = {},
  required,
  noStyle = false,
  disabled,
  form,
  className
}) => {
  const { form: baseForm } = useContext(V2FormContext);
  const _form = form || baseForm;
  const [open, setOpen] = useState<boolean>(false);
  const [tipValue, setTipValue] = useState(tooltip?.defaultValue);
  let _rules = rules;
  // 未设置rules 规则,但是有设置必填，就添加一个默认的规则
  // 只要设置了 rules，就完全托管给rules自行校验
  if (!_rules?.length) {
    if (required) {
      _rules = _rules.concat([{ required: true }]);
    }
  }
  const methods = useMethods({
    fixAntInputNumberBug() {
      if (!_form) {
        console.error('请向V2Form中插入参数 form,或向此组件传入form');
        return;
      }
      setTimeout(() => {
        let _precision = precision;
        if (isNotEmpty(config.precision)) {
          _precision = Number(config.precision);
        }
        const lastValue = _form.getFieldValue(name);
        if (isNotEmpty(lastValue)) {
          const start = lastValue + '';
          if (start.indexOf('.') > -1) { // 当有小数点时，需要尝试做2次矫正。疑问ant的input-number组件有 bug。两次输入 . 之后就不会再正常渲染
            const list = start.split('.');
            let res = '';
            if (_precision) { // 大于0个
              if (list[1]) {
                res = list[0] + '.' + list[1].slice(0, _precision);
              }
            } else {
              res = list[0];
            }
            if (res !== start) {
              _form.setFieldValue(name, +res);
              // 待遇到场景后添加
              // if (tooltip?.formatter) {
              //   setTipValue(tooltip?.formatter(+res));
              // }
            }
          }
        }
      });
    },
    doFocus() {
      tooltip && setOpen(true);
      focus && focus();
    },
    doBlur() {
      methods.fixAntInputNumberBug();
      setOpen(false);
      blur && blur();
    },
    onChange(v) {
      if (tooltip?.formatter) {
        setTipValue(tooltip?.formatter(v));
      }
      onChange && onChange(v);
    }
  });
  /* config */
  const wrapperConfig = {
    label,
    noStyle,
    className: cs(styles.V2FormInputNumber, 'v2FormInputNumber', className),
    // 如果传入有规则或只有必填一个选项，则默认添加字符串不能为空格的规则
    ...formItemConfig
  };
  const innerConfig = {
    name,
    rules: _rules,
  };
  /* components */
  const inputCom = () => (<InputNumber
    placeholder={placeholder}
    min={min}
    max={max}
    precision={precision}
    disabled={disabled}
    {...config}
    onChange={methods.onChange}
    onFocus={methods.doFocus}
    onBlur={methods.doBlur}
  />);
  return (
    tooltip ? (
      <Form.Item {...wrapperConfig}>
        <Tooltip
          {...tooltip}
          open={tooltip?.title || tipValue ? open : false}
          title={tooltip?.title || tipValue}
          placement={tooltip?.placement || 'topLeft'}
          overlayInnerStyle={{ ...tooltip?.overlayInnerStyle, minWidth: '48px' }}
        >
          <Form.Item noStyle {...innerConfig}>
            {inputCom()}
          </Form.Item>
        </Tooltip>
      </Form.Item>
    ) : (
      <Form.Item {...wrapperConfig} {...innerConfig}>
        {inputCom()}
      </Form.Item>
    )
  );
};
V2FormInputNumber.displayName = 'V2FormInputNumber';
export default V2FormInputNumber;
