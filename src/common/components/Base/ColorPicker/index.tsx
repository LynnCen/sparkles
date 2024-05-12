import React from 'react';
import { SketchPicker, CompactPicker } from 'react-color';
import { useMethods } from '@lhb/hook';
export interface ColorProps {
  /**
   * @description 颜色
   */
  color: string;
  /**
   * @description 更新Color的方法
   */
  setColor?: Function;
  /**
   * @description 颜色变化后触发的回调
   */
  onChange?: Function;
  /**
   * @description 是否可以设置透明度
   * @default true
   */
  canSetOpacity?: boolean;
}
/**
* @description 便捷文档地址
* @see https://reactpc.lanhanba.net/components/base/color-picker
*/
const ColorPicker: React.FC<ColorProps> = ({
  color,
  setColor,
  onChange,
  canSetOpacity = true
}) => {
  const CusTomPicker = canSetOpacity ? SketchPicker : CompactPicker;
  const methods = useMethods({
    changeColor(value) {
      setColor && setColor(value.hex);
      onChange && onChange(value.hex);
    }
  });
  return <CusTomPicker color={color || '#008cff'} onChangeComplete={methods.changeColor} />;
};

export default ColorPicker;
