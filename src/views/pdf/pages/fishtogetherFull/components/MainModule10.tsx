import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import V2Title from '@/common/components/Feedback/V2Title';
import Item from './Base/Item';
import { replaceEmpty } from '@lhb/func';
const MainModule10: FC<any> = ({
  number,
  res = {}
}) => {
  return (
    <div className={cs(styles.mainModule, styles.mainModule10)}>
      <TopTitle number={number}>十、项目店地址视频</TopTitle>
      <div className={styles.mainModuleWrapper}>
        <V2Title divider type='H3' text='视频地址' style={{ marginBottom: '10px' }}/>
        <div className={styles.module10Item}>
          项目整体商业视频: <span className={styles.module10Link}>{
            res?.videos?.projSubmitBusinessDistrictVideo?.length
              ? res?.videos?.projSubmitBusinessDistrictVideo?.join('、')
              : '无'
          }</span>
        </div>
        <div className={styles.module10Item}>
          铺位本身视频: <span className={styles.module10Link}>{
            res?.videos?.projSubmitPointInternalVideo?.length
              ? res?.videos?.projSubmitPointInternalVideo?.join('、')
              : '无'
          }</span>
        </div>
        <div className={styles.module10Item}>
          餐饮集中区域/主力店视频: <span className={styles.module10Link}>{
            res?.videos?.projSubmitCompetitorVideo?.length
              ? res?.videos?.projSubmitCompetitorVideo?.join('、')
              : '无'
          }</span>
        </div>
        <V2Title divider type='H3' text='历史闭店原因' style={{ marginBottom: '10px', marginTop: '6px' }}/>
        <Item className='mb-10' label='门店经营失败原因分析:'>{replaceEmpty(res?.historyAna?.projSubmitAnalysisFailure)}</Item>
        <Item className='mb-10' label='再次入驻原因分析:'>{replaceEmpty(res?.historyAna?.projSubmitReasonAnalysis)}</Item>
        <Item className='mb-10' label='两铺位动线对比:'>{replaceEmpty(res?.historyAna?.projSubmitComparisonBunkTracks)}</Item>
        <Item className='mb-10' label='是否告知过该客户商业有过经营失败的门店'>{replaceEmpty(res?.historyAna?.projSubmitClearlyInformedTheCustomer)}</Item>
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule10;
