import { FC, ReactNode } from 'react';
import { replaceEmpty, checkIsColor } from '@lhb/func';
import cs from 'classnames';
import styles from './ColorText.module.less';

interface ColorTextProps {
  /** 文本 */
  value?: string | number;
  /** 颜色表中的颜色键名，用来查找该值对应的颜色，默认使用 value */
  colorKey?: string | number;
  /**
   * 颜色映射表，除了以下颜色外，其他需要自定义：primary/success/warning/danger/info/blue/green/orange/red/gray
   * <br>
   * 可以传入颜色英文或者色值，如 #409EFF，rgb(64, 158, 255)
   */
  colorMap?: Record<string, any>;
  /**
   * 默认颜色，除了以下颜色外，其他需要自定义：primary/success/warning/danger/info/blue/green/orange/red/gray
   * <br>
   * 可以传入颜色英文或者色值，如 #409EFF，rgb(64, 158, 255)
   */
  defaultColor?: string;
  /** 是否显示圆点 */
  dot?: boolean;
  /** 文本是否显示颜色 */
  isTextColor?: boolean;
  children?: ReactNode;
}

/**
 * 颜色图标文本
 * @description 状态文本左侧显示圆点图标，常用于状态显示。
 * @category Text
 * @return {*}
 * @demo
import ColorText from 'src/common/components/Text/ColorText';

<ColorText value='颜色文本 #FF861D' colorMap={colorMap} />

const colorMap = {
  'default': 'primary',
  'submitted': 'warning',
  'approved': 'success',
  'rejected': 'danger',
  'blue': 'blue',
  'green': 'green',
  'orange': 'orange',
  'red': 'red',
  'gray': 'gray',
  '#FF861D': '#FF861D',
  '#006AFF': '#006AFF',
  '#67C239': '#67C239',
  '#F5222D': '#F5222D',
  '#BFBFBF': '#BFBFBF',
  'rgb(255, 134, 29)': 'rgb(255, 134, 29)',
};
 */
const Component:FC<ColorTextProps> = ({
  // 文本
  value = '',
  // 颜色表中的颜色键名，用来查找该值对应的颜色，默认使用 value
  colorKey = null,
  /**
   * 颜色映射表，除了以下颜色外，其他需要自定义：primary/success/warning/danger/info/blue/green/orange/red/gray
   * <br>
   * 可以传入颜色英文或者色值，如 #409EFF，rgb(64, 158, 255)
   * @optional
   */
  colorMap = {},
  /**
   * 默认颜色，除了以下颜色外，其他需要自定义：primary/success/warning/danger/info/blue/green/orange/red/gray
   * <br>
   * 可以传入颜色英文或者色值，如 #409EFF，rgb(64, 158, 255)
   * @optional primary/success/warning/danger/info/blue/green/orange/red/gray/...
   */
  defaultColor = '',
  // 是否显示圆点
  dot = true,
  // 文本是否显示颜色
  isTextColor = false,
  children

}) => {

  // 颜色键名对应的值，如果是颜色值的格式（如 #fff，rgb(xxx)）. 使用 colorStyle，否则使用 colorClass
  const colorValue = colorMap[replaceEmpty(colorKey as any, value as any)];
  // 颜色选择器
  const colorClass = !checkIsColor(colorValue) ? colorValue : defaultColor;
  // 颜色样式
  const colorStyle = checkIsColor(colorValue) ? { 'backgroundColor': colorValue } : undefined;
  // 颜色样式
  const textColorStyle = checkIsColor(colorValue) ? { 'color': colorValue } : undefined;

  return (<div className={styles['color-text']}>
    {dot && <i className={cs(colorClass, 'color-text__color')} style={colorStyle}></i>}
    <span className={cs(isTextColor ? 'color-text__text' : '', isTextColor ? colorClass : '')} style={isTextColor ? textColorStyle : undefined}>
      {children || replaceEmpty(value as any)}
    </span>
  </div>);
};

export default Component;
