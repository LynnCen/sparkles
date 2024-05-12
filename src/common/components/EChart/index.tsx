import React, { useState, useRef, useEffect } from 'react';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts';
import { EChartsOption, } from 'echarts';
import { color } from '@/common/enums/color';

interface EchartProp {
  option: EChartsOption | {};
  otherOption?: { // https://echarts.apache.org/zh/api.html#echartsInstance.setOption
    notMerge?: boolean;
    replaceMerge?: string | string[];
    lazyUpdate?: boolean;
  };
  height: string;
  width?: string;
  isDestroy?: boolean; // 数据变化是否清空画布-默认为false
  loadedEchartsHandle?: (ins:any) => void
}

const Echart: React.FC<EchartProp> = ({
  option,
  otherOption = {},
  height = '100%',
  width = '100%',
  isDestroy = false,
  loadedEchartsHandle
}) => {
  // 用来获取渲染后的 DOM
  const chartDomRef = useRef<HTMLDivElement>(null);
  // 存储生成后的 图表实例对象
  const [echartsInstance, setEchartsInstance] = useState<any>(null);

  // 仅第一次挂载时执行，将 DOM 传递给 echarts，通过 echarts.init() 得到真正的图表 JS 对象
  useEffect(() => {
    if (chartDomRef?.current) {
      setEchartsInstance(echarts.init(chartDomRef.current));
    }
  }, []);

  // 监听依赖变化，并根据需要更新图表数据
  useEffect(() => {
    if (echartsInstance) {
      echartsInstance?.setOption({ color: color, ...option, ...otherOption }, isDestroy);
      loadedEchartsHandle && loadedEchartsHandle(echartsInstance);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [echartsInstance, option, isDestroy, otherOption]);

  return <div ref={chartDomRef} style={{ width, height }} />;
};

export default Echart;
