import { FC, useEffect, useState } from 'react';
import { Descriptions, Divider } from 'antd';
import cs from 'classnames';
import { RadarChart, RadarSeriesOption } from 'echarts/charts'; // RadarSeriesOption
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';
import styles from '../../entry.module.less';
import RadarAngleItem from './RadarAngleItem';
import ECharts from '@/common/components/EChart';

echarts.use([RadarChart, CanvasRenderer]);
type EChartsOption = echarts.ComposeOption<RadarSeriesOption>;

const Radar: FC<any> = ({
  info
}) => {
  const [scoreVal, setScoreVal] = useState<any>({
    cityScore: 0,
    situationScore: 0,
    preferenceScore: 0,
    trafficScore: 0
  });
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    const { cityScore, situationScore, preferenceScore, trafficScore } = info;
    const data = [cityScore || 0, situationScore || 0, preferenceScore || 0, trafficScore || 0];
    const scoreObj = {
      cityScore: cityScore || 0,
      situationScore: situationScore || 0,
      preferenceScore: preferenceScore || 0,
      trafficScore: trafficScore || 0,
    };
    setScoreVal(scoreObj);
    const radarOptions: EChartsOption = {
      radar: {
        shape: 'circle', // 设置为圆形
        center: ['50%', '50%'], // 中心点位置
        radius: '100%', // 雷达图大小
        indicator: [ // 指示器文案
          { text: '', max: 100 },
          { text: '', max: 100 },
          { text: '', max: 100 },
          { text: '', max: 100 }
        ],
        axisLine: { // 坐标轴轴线相关设置
          lineStyle: {
            width: 2,
            color: 'rgba(136,185,255, 0.13)'
          }
        },
        axisTick: { // 坐标轴刻度
          show: false
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: ['#042565', '#001955', '#001955', '#001955', '#001955'],
            width: 1.5
          }
        },
        splitArea: {
          areaStyle: { // 配置分割区域颜色
            color: 'transparent'
          }
        }
      },
      series: [{
        name: '',
        type: 'radar',
        data: [
          {
            value: data,
            areaStyle: {
              color: 'rgba(1,67,145, 0.38)'
            },
            itemStyle: {
              color: '#00C2FF',
            },
            emphasis: {
              label: {
                show: true
              }
            },
            // symbol: '', // 默认就是circle
            symbolSize: 5 // 设置圆点的大小
          }
        ]
      }]
    };
    setOptions(radarOptions);
    // return () => {
    //   ins && ins.dispose();
    // };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  // const loadedHandle = (ins: any) => {
  //   ins && setIns(ins);
  // };

  return (
    <div className={styles.radarCon}>
      <div className='fs-19 bold'>
        {info.name}
      </div>
      <Descriptions column={24} className='mt-10'>
        {
          info.type === 1 && <Descriptions.Item
            label='门店地址'
            labelStyle={{
              color: '#d9d9d9'
            }}
            contentStyle={{
              color: '#fff'
            }}
            span={24}>
            { info?.address }
          </Descriptions.Item>
        }
        <Descriptions.Item
          label='分析日期'
          labelStyle={{
            color: '#d9d9d9'
          }}
          contentStyle={{
            color: '#fff'
          }}
          span={24}>
          { info?.createdAt }
        </Descriptions.Item>
        {
          (info.type === 1 && info.radius > 0) || (info.type === 2 && info.area > 0) ? <Descriptions.Item
            label={ info?.type === 1 ? '半径范围' : '面积'}
            labelStyle={{
              color: '#d9d9d9'
            }}
            contentStyle={{
              color: '#fff'
            }}
            span={24}>
            { info?.type === 1 ? `${info.radius / 1000}km` : `${info.area}k㎡` }
          </Descriptions.Item> : null
        }
      </Descriptions>
      <Divider style={{ borderColor: 'rgba(255,255,255,0.23)', marginTop: '14px' }}></Divider>
      <div className={styles.centerTit}>
        <RadarAngleItem color='#E8CB67' title='城市市场' score={scoreVal.cityScore}/>
      </div>
      <div className={cs(styles.roundCon, 'mt-10 mb-10')}>
        <RadarAngleItem color='#60ABA4' title='商业氛围' score={scoreVal.situationScore}/>
        <ECharts
          option={options}
          width='175px'
          height='175px'/>
        <RadarAngleItem color='#D8609D' title='交通便利' score={scoreVal.trafficScore}/>
      </div>
      <div className={styles.centerTit}>
        <RadarAngleItem color='#60ABA4' title='客群客流' score={scoreVal.preferenceScore}/>
      </div>
    </div>
  );
};

export default Radar;
