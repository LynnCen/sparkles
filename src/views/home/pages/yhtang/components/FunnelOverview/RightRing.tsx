/**
 * @Description 年度目标
 */
import * as echarts from 'echarts/core';
import { FC, useEffect, useState } from 'react';
import { beautifyThePrice } from '@lhb/func';
// 按需引入组件，后缀为Component,  系列类型的定义后缀都为 Option
import {
  TooltipComponent,
  TitleComponent,
} from 'echarts/components';
// 按需引入需要的图表类型
import { PieChart } from 'echarts/charts';
// 全局过渡动画等特性
import { UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import Charts from '@/common/components/EChart';
// import cs from 'classnames';
import styles from './index.module.less';

// 注册必须的组件
echarts.use([
  TooltipComponent,
  CanvasRenderer,
  UniversalTransition,
  TitleComponent,
  PieChart,
]);

const RightRing: FC<any> = ({
  data
}) => {
  const [chartOption, setChartOptions] = useState<any>({});

  useEffect(() => {
    if (!data) return;
    loadData();
  }, [data]);

  const loadData = () => {
    const { targetCount, data: pieData } = data;
    let seriesData = pieData;
    const hasData = seriesData.find((item) => item.value);
    // UI要求没有数据时也要显示圆环
    if (!hasData) {
      seriesData = [
        { name: '', value: 1 }
      ];
    }
    const option = {
      color: hasData ? [
        '#36CEF3',
        '#8263FF',
        '#006AFF',
      ] : '#eee',
      title: { // 标题
        type: 'text',
        text: `${beautifyThePrice(targetCount.result, ',', 0)}`,
        textStyle: {
          color: '#222222',
          fontSize: 24,
          fontWeight: 'bold'
        },
        subtext: `${targetCount.name}`, // 副标题
        subtextStyle: { // 副标题样式
          color: '#666666',
          fontSize: 14,
        },
        textAlign: 'center',
        left: '49%',
        top: '40%',
      },
      tooltip: {
        show: !!hasData,
      },
      series: [{
        name: '年度目标',
        type: 'pie',
        radius: ['50%', '60%'],
        data: seriesData,
        hoverAnimation: false, // 关闭点击变大高亮效果
        label: {
          show: !!hasData,
          formatter: `{val|{c}}\n{name|{b}}`,
          // formatter: (val: any) => {
          //   const { name, value } = val;
          //   return `{val|${beautifyThePrice(value, ',', 0)}}\n{name|${name}}`;
          // },
          rich: {
            val: {
              fontSize: 24,
              color: '#222222',
              fontWeight: 'bold',
              align: 'center',
            },
            name: {
              fontSize: 14,
              color: '#666666',
              align: 'center',
              padding: [6, 0, 0, 0],
            },
          },
        },
        labelLine: {
          lineStyle: {
            color: '#999999'
          },
          length: 30
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 3
        },
        emphasis: {
          ...(hasData ? {} : { itemStyle: { color: '#eee' } })
        }
      }]
    };
    setChartOptions(option);
  };

  return (
    <div className={styles.rightCon}>
      <div className='c-222 font-weight-500 fs-16 mb-34'>
        年度目标
      </div>
      <Charts
        height='320px'
        width='520px'
        option={chartOption}
        initOption={{
          devicePixelRatio: 2
        }}
        isDestroy />
    </div>
  );
};

export default RightRing;
