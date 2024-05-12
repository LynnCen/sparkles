import React, { useState, useRef, useEffect } from 'react';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core';
// import * as allCharts from 'echarts/charts';
import { EChartsOption } from 'echarts';
import { throttle } from '@lhb/func';
// import { color } from '@/common/enums/color';

interface EchartProp {
  options: EChartsOption | {};
  otherOption?: { // https://echarts.apache.org/zh/api.html#echartsInstance.setOption
    notMerge?: boolean;
    replaceMerge?: string | string[];
    lazyUpdate?: boolean;
  };
  width?: string;
  height?: string;
  // width?: string;
  className?: string;
  // isDestroy?: boolean; // 数据变化是否清空画布-默认为false
  loadedEchartsHandle?: (ins: any) => void
}

const Echart: React.FC<EchartProp> = ({
  options,
  otherOption = {},
  height,
  width,
  className,
  loadedEchartsHandle
}) => {
  // 用来获取渲染后的 DOM
  const chartDomRef = useRef<HTMLDivElement>(null);
  // 存储生成后的 图表实例对象
  const [echartsInstance, setEchartsInstance] = useState<any>(null);

  // 仅第一次挂载时执行，将 DOM 传递给 echarts，通过 echarts.init() 得到真正的图表 JS 对象
  useEffect(() => {
    let chart: any;
    if (chartDomRef?.current) {
      chart = echarts.init(chartDomRef.current);
      setEchartsInstance(chart);
      window.addEventListener('resize', throttle(() => {
        chart.resize(); // 图表根据窗口大小自适应
      }, 300));
    }
    return () => {
      window.removeEventListener('resize', throttle(() => {
        chart.resize();
      }, 300));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    echartsInstance && loadedEchartsHandle && loadedEchartsHandle(echartsInstance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [echartsInstance]);

  // 监听依赖变化，并根据需要更新图表数据
  useEffect(() => {
    if (echartsInstance && options && Object.keys(options).length) {
      try {
        echartsInstance.setOption(options, otherOption);
      } catch (error) {
        console.log(`echartsInstance`, error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, otherOption]);

  return <div
    ref={chartDomRef}
    className={className}
    style={{
      width: width,
      height
    }} />;
};

export default Echart;
