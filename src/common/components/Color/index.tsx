/* 颜色选择器 */
import { FC } from 'react';
import { SketchPicker } from 'react-color';
import { ColorProps } from './ts-config';

const Color: FC<ColorProps> = ({ color, onChange }) => {
  const changeColor = (value) => {
    onChange(value.hex);
  };

  return <SketchPicker color={color || '#008cff'} onChangeComplete={changeColor} />;
};

export default Color;
