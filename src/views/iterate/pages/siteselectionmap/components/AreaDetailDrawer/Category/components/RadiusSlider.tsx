// 半径选择

import { Slider } from 'antd';
import { FC } from 'react';
import styles from '../index.module.less';


const markersToValueMAp = new Map([
  [0.5, 500],
  [1.6, 1000],
  [2.3, 2000],
  [3.1, 3000],
  [3.8, 4000],
  [4.7, 5000],
]);

// sliderBar有偏移量
const marks = {
  0.5: '0.5km',
  1.6: '1km',
  2.3: '2km',
  3.1: '3km',
  3.8: '4km',
  4.7: '5km',
};

const RadiusSlider: FC<any> = ({
  setRadius,
  defaultValue = 1.6
}) => {

  // 滑块拖动后再set值
  const onAfterChange = (value) => {
    const radius = markersToValueMAp.get(value);
    setRadius(radius);
  };


  // 在这里编写组件的逻辑和渲染
  return (
    <div className={styles.sliderCon}>
      <Slider
        min={0.5}
        max={4.7}
        defaultValue={defaultValue}
        dots
        included
        marks={marks}
        step={null}
        tooltip={{
          open: false
        }}
        onAfterChange={onAfterChange}
      />
    </div>
  );
};

export default RadiusSlider;
