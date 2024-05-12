import { Empty } from 'antd';
import React from 'react';
import styles from '../entry.module.less';
import { graphAnalyzeObj } from './config';
import ScatterCharts from './ScatterCharts';

const options = [
  {
    label: '商场满铺率 vs 转化率',
    yAxis: {
      max: 16,
      interval: 2,
      axisLabel: {
        formatter: '{value} %',
      },
    },
    xAxis: { name: `商场满铺率（%）` },
    startData: [31, 3.018],
    endData: [97, 10.11],
    tooltipConfig: {
      formatter: function (params) {
        return `转化率：${params.data[1]}%\n商场满铺率：${params.data[0]}%`;
      },
    },
  },
  {
    label: '商场节假日日均客流 vs 转化率',
    yAxis: {
      max: 16,
      interval: 2,
      axisLabel: {
        formatter: '{value} %',
      },
    },
    xAxis: { name: `商场节假日日均客流（人次）` },
    startData: [1520, 4.038],
    endData: [7695, 10.104],
    tooltipConfig: {
      formatter: function (params) {
        return `转化率：${params.data[1]}%\n商场节假日日均客流：${params.data[0]}`;
      },
    },
  },
  {
    label: '商场停车位数量 vs 转化率',
    yAxis: {
      max: 16,
      interval: 2,
      axisLabel: {
        formatter: '{value} %',
      },
    },
    xAxis: { name: `商场停车位数量（个）` },
    startData: [1000, 3.037],
    endData: [4500, 12.116],
    tooltipConfig: {
      formatter: function (params) {
        return `转化率：${params.data[1]}%\n商场停车位数量：${params.data[0]}`;
      },
    },
  },
  {
    label: '国际快时尚品牌数量 vs 转化率',
    yAxis: {
      max: 16,
      interval: 2,
      axisLabel: {
        formatter: '{value} %',
      },
    },
    xAxis: { name: `国际快时尚品牌数量（个）` },
    startData: [1, 3.02],
    endData: [11, 14.148],
    tooltipConfig: {
      formatter: function (params) {
        return `转化率：${params.data[1]}%\n国际快时尚品牌数量：${params.data[0]}`;
      },
    },
  },
  {
    label: '店铺面积 vs 转化率',
    yAxis: {
      max: 16,
      interval: 2,
      axisLabel: {
        formatter: '{value} %',
      },
    },
    xAxis: { name: `店铺面积（平米）` },
    startData: [24, 3.047],
    endData: [150, 15.936],
    tooltipConfig: {
      formatter: function (params) {
        return `转化率：${params.data[1]}%\n店铺面积：${params.data[0]}`;
      },
    },
  },
  {
    label: '租金条件 vs 转化率',
    yAxis: {
      max: 16,
      interval: 2,
      axisLabel: {
        formatter: '{value} %',
      },
    },
    xAxis: { name: `租金条件（%）` },
    startData: [3.5, 3.035],
    endData: [17, 13.125],
    tooltipConfig: {
      formatter: function (params) {
        return `转化率：${params.data[1]}%\n租金条件：${params.data[0]}`;
      },
    },
  },
  {
    label: '年龄 vs 转化率',
    yAxis: {
      max: 16,
      interval: 2,
      axisLabel: {
        formatter: '{value} %',
      },
    },
    xAxis: { name: `年龄分段占比` },
    startData: [0.0014, 3.458],
    endData: [0.034, 14.118],
    tooltipConfig: {
      formatter: function (params) {
        return `转化率：${params.data[1]}%\n年龄：${params.data[0]}`;
      },
    },
  },
  {
    label: '餐饮消费水平 vs 转化率',
    yAxis: {
      max: 16,
      interval: 2,
      axisLabel: {
        formatter: '{value} %',
      },
    },
    startData: [0.00068, 3.048],
    endData: [0.097, 15.138],
    xAxis: { name: `餐饮消费水平分段占比` },
    tooltipConfig: {
      formatter: function (params) {
        return `转化率：${params.data[1]}%\n餐饮消费水平：${params.data[0]}`;
      },
    },
  },
  // {
  //   label: '居民社区房价 vs 转化率',
  //   startData: [0.00247, 0.0375],
  //   endData: [0.066, 0.14],
  //   tooltipConfig: {
  //     formatter: function(params) {
  //       return `转化率：${params.data[1]}%\n居民社区房价：${params.data[0]}`;
  //     },
  //   }
  // },
];

const format = (number) => {
  return Math.round(number * Math.pow(10, 4)) / Math.pow(10, 4);
};
const graphAnalyzeDatas: any = [];
// eslint-disable-next-line guard-for-in
for (const index in graphAnalyzeObj) {
  graphAnalyzeDatas.push({
    data: graphAnalyzeObj[index].map((i) => {
      return [format(i[0]), format(i[1] * 100)];
    }),
    startData: graphAnalyzeObj[index][0],
    endData: graphAnalyzeObj[index][31],
    ...options[index],
  });
}

const GraphAnalyze: React.FC<any> = (props) => {
  console.log(`props = `, props);
  return (
    <div className={styles.container}>
      <div>
        <span className={styles.title}>转化率回归分析</span>
        <span className={styles.label}>根据您的评分表及门店数据分析得出，与您店铺转化率强相关的指标或因素</span>
      </div>

      {/*  图表 */}
      <div className={styles.chartCon}>
        <div className={styles.chartTop}>
          {graphAnalyzeDatas ? (
            graphAnalyzeDatas.map((item, index) => (
              <div key={index}>
                <div className={styles.chart}>
                  <div className={styles.chartTitle}>{item.label}</div>
                  <ScatterCharts config={item} />
                </div>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphAnalyze;
