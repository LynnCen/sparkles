/** antd charts 的词云图 */
// https://charts.ant.design/zh/examples/more-plots/word-cloud#same-place
// g2plot 渲染有一定问题
import { FC } from 'react';
// import { WordCloud } from '@antv/g2plot';
import { WordCloud } from '@ant-design/plots';
import { Empty } from 'antd';
// import { MainAppContext } from '@/index';

interface WordCloudChartProps {
  data: any
}


const WordCloudChart: FC<WordCloudChartProps> = ({
  data = []
}) => {
  // const { container } = useContext(MainAppContext);
  // const wordCloudChart = (container || document)?.querySelector('#wordCloudChart');// 需要先判断盒子再渲染

  // useEffect(() => {
  //   if (wordCloudChart) {
  //     const wordCloud = new WordCloud('wordCloudChart', {
  //       data,
  //       autoFit: true,
  //       wordField: 'name',
  //       weightField: 'value',
  //       colorField: 'name',
  //       spiral: 'archimedean',
  //       wordStyle: {
  //         fontFamily: 'Verdana',
  //         fontSize: [14, 38],
  //         rotation: 0,
  //         padding: 10
  //       },
  //       tooltip: false,
  //       // 返回值设置成一个 [0, 1) 区间内的值，
  //       // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
  //       random: () => 0.5,
  //     });

  //     wordCloud.render();
  //   }

  // }, [wordCloudChart, data]);

  const config = {
    data,
    autoFit: true,
    wordField: 'name',
    weightField: 'value',
    colorField: 'name',
    spiral: 'archimedean', // 椭圆 ，rectangular 矩形
    // color: ['#17273A'],
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [12, 20],
      rotation: 0,
      padding: 10
    },
    renderer: 'svg',
    tooltip: false,
    // 返回值设置成一个 [0, 1) 区间内的值，默认使用浏览器的math.random
    // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
    // random: () => 0.5,
  };

  return (
    <div style={{ height: '100%' }}>
      {
        data.length
          // ? <div id='wordCloudChart' style={{ height: '100%' }}></div>
          ? <WordCloud {...config as any} />
          : <Empty />
      }
    </div>
  );
};

export default WordCloudChart;
