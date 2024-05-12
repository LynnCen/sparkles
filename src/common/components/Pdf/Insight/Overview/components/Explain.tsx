import { FC } from 'react';
import { Descriptions } from 'antd';
import styles from '../../entry.module.less';
// import DetailItem from '@/common/components/Business/DetailItem';

// const ProgressBarItem: FC<any> = ({
//   percent, // 笑脸位置
//   fillColor,
//   text,
//   url
// }) => {

//   return (
//     <>
//       <div className={styles.progressBarItemCon}>
//         <Progress
//           percent={100}
//           strokeColor={fillColor}
//           strokeWidth={9}
//           showInfo={false}/>
//         {
//           percent && <img
//             src={url}
//             width='100%'
//             height='100%'
//             className={styles.smileCon}
//             style={{
//               left: `${percent}%`
//             }}/>
//         }
//       </div>
//       <div className='ct fs-14 cOpaWhite mt-14'>
//         {text}
//       </div>
//     </>
//   );
// };

const Explain: FC<any> = () => {
  // const [scoreData, setScoreData] = useState<Array<any>>([]);

  // useEffect(() => {
  //   const targetData: any = [
  //     {
  //       span: 3,
  //       fillColor: '#60D473',
  //       text: '很好',
  //       percent: null,
  //       url: 'https://staticres.linhuiba.com/project-custom/location-insight/icon_smile_face_good@2x.png'
  //     },
  //     {
  //       span: 4,
  //       fillColor: '#FBA755',
  //       text: '较好',
  //       percent: null,
  //       url: 'https://staticres.linhuiba.com/project-custom/location-insight/icon_smile_face_better@2x.png'
  //     },
  //     {
  //       span: 4,
  //       fillColor: '#F5C560',
  //       text: '一般',
  //       percent: null,
  //       url: 'https://staticres.linhuiba.com/project-custom/location-insight/icon_smile_face_ordinary@2x.png'
  //     },
  //     {
  //       span: 5,
  //       fillColor: '#B953DE',
  //       text: '较差',
  //       percent: null,
  //       url: 'https://staticres.linhuiba.com/project-custom/location-insight/icon_smile_face_worse@2x.png'
  //     },
  //     {
  //       span: 7,
  //       fillColor: '#FF2525',
  //       text: '非常差',
  //       percent: null,
  //       url: 'https://staticres.linhuiba.com/project-custom/location-insight/icon_smile_face_bad@2x.png'
  //     },
  //   ];
  //   if (isNotEmpty(scoreVal as number)) {
  //     if (scoreVal >= 90) {
  //       targetData[0].percent = getProportion(100, 90, scoreVal);
  //     } else if (scoreVal >= 75 && scoreVal < 90) {
  //       targetData[1].percent = getProportion(90, 75, scoreVal);
  //     } else if (scoreVal >= 60 && scoreVal < 75) {
  //       targetData[2].percent = getProportion(75, 60, scoreVal);
  //     } else if (scoreVal >= 40 && scoreVal < 60) {
  //       targetData[3].percent = getProportion(60, 40, scoreVal);
  //     } else if (scoreVal < 40) {
  //       targetData[4].percent = getProportion(40, 0, scoreVal);
  //     }
  //   } else { // 默认值
  //     targetData[0].percent = 30;
  //   }
  //   setScoreData(targetData);
  // }, [scoreVal]);

  // const getProportion = (max: number, min: number, cur: number) => {
  //   const val = (1 - (cur - min) / (max - min)) * 100;
  //   if (val < 15) { // 不能超出
  //     return 15;
  //   } else if (val > 85) { // 不能超出
  //     return 85;
  //   }
  //   return val;
  // };

  return (
    <div className={styles.explainCon}>
      <div className='fs-18 bold'>
        评估解读:
      </div>
      {/* <Row gutter={8} className='mt-20'>
        {
          scoreData.map((item: any, index: number) => (
            <Col span={item.span} key={index}>
              <ProgressBarItem
                fillColor={item.fillColor}
                text={item.text}
                percent={item.percent}
                url={item.url}/>
            </Col>
          ))
        }
      </Row> */}
      <Descriptions column={24} className='mt-20'>
        <Descriptions.Item
          label='很好'
          labelStyle={{
            color: '#d9d9d9'
          }}
          contentStyle={{
            color: '#d9d9d9'
          }}
          span={24}>
          商圈总体情况非常好,对经营很有利
        </Descriptions.Item>
        <Descriptions.Item
          label='较好'
          labelStyle={{
            color: '#d9d9d9'
          }}
          contentStyle={{
            color: '#d9d9d9'
          }}
          span={24}>
          商圈总体情况较好,对经营较有利
        </Descriptions.Item>
        <Descriptions.Item
          label='一般'
          labelStyle={{
            color: '#d9d9d9'
          }}
          contentStyle={{
            color: '#d9d9d9'
          }}
          span={24}>
          商圈总体情况一般,有好有坏
        </Descriptions.Item>
        <Descriptions.Item
          label='较差'
          labelStyle={{
            color: '#d9d9d9'
          }}
          contentStyle={{
            color: '#d9d9d9'
          }}
          span={24}>
          商圈总体情况较差,对经营较不利
        </Descriptions.Item>
        <Descriptions.Item
          label='非常差'
          labelStyle={{
            color: '#d9d9d9'
          }}
          contentStyle={{
            color: '#d9d9d9'
          }}
          span={24}>
          商圈总体情况非常差,对经营很不利
        </Descriptions.Item>
      </Descriptions>
      {/* <DetailItem
        className='mt-40'
        label='90-100分'
        content='商圈总体情况非常好,对经营很有利'
        labelStyle={{
          color: 'rgba(255, 255, 255, 0.8)'
        }}/>
      <DetailItem
        label='75-89分'
        content='商圈总体情况较好,对经营较有利'
        labelStyle={{
          color: 'rgba(255, 255, 255, 0.8)'
        }}/>
      <DetailItem
        label='60-74分'
        content='商圈总体情况一般,有好有坏'
        labelStyle={{
          color: 'rgba(255, 255, 255, 0.8)'
        }}/>
      <DetailItem
        label='40-59分'
        content='商圈总体情况较差,对经营较不利'
        labelStyle={{
          color: 'rgba(255, 255, 255, 0.8)'
        }}/>
      <DetailItem
        label='39分以下'
        content='商圈总体情况非常差,对经营很不利'
        labelStyle={{
          color: 'rgba(255, 255, 255, 0.8)'
        }}/> */}
    </div>
  );
};

export default Explain;
