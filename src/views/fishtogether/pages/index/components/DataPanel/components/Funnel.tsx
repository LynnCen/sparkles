import { FC, } from 'react';
import styles from '../../../entry.module.less';
import FunnelItem from './FunnelItem';

const Funnel: FC<any> = ({
  funnelData,
}) => {

  /**
   * name 漏斗展示的名词
   * countRatio 人数相较于全国
   * ratio 转化率
   * leftBg 左侧背景色
   * rightBg 右侧背景色
   */
  const funnelDataList = [
    {
      name: '新增点位数',
      number: funnelData.pointCount,
      leftBg: 'rgba(0,117,255,0.03)',
      rightBg: '#006AFF',
      width: '140px',
      borderWidth: '18px',
    },
    {
      name: '新增加盟商',
      number: funnelData.franchiseeCount,
      leftBg: 'rgba(34,171,255,0.03)',
      rightBg: '#22ABFF',
      width: '119px',
      borderWidth: '18px',
    },
    {
      name: '评估通过',
      number: funnelData.evaluationAgreeCount,
      leftBg: 'rgba(206,119,255, 0.04)',
      rightBg: '#B855F1',
      width: '98px',
      borderWidth: '18px',
    },
    {
      name: '落位',
      number: funnelData.contractAgreeCount,
      leftBg: 'rgba(255,134,29,0.03)',
      rightBg: '#FEA253',
      width: '77px',
      borderWidth: '18px',
    },
  ];

  return (
    <>
      {
        funnelData ? (
          <>
            <div className={styles.funnelCon}>
              <div className='ml-12'>
                { funnelDataList.map((item, index) => <FunnelItem
                  isFirst={!index}
                  data={item}
                  key={index}
                  style={{ width: index + 1 === funnelDataList.length ? 0 : '21px' }}
                />)}
              </div>
            </div>
          </>
        ) : null
      }
    </>
  );
};

export default Funnel;
